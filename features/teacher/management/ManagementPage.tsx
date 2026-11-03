"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { useTeacherStudents } from "@/features/teacher/students/hooks/useTeacherStudents";
import { useStudentActions } from "@/features/teacher/management/hooks/useStudentActions";
import Button from "@/components/shared/Button";
import ConfirmDialog, { type ConfirmOptions } from "@/components/shared/ConfirmDialog";
import NameEditModal from "@/components/shared/NameEditModal";
import Skeleton from "@/components/shared/Skeleton";
import Tabs from "@/components/shared/Tabs";
import Toast, { useToast } from "@/components/shared/Toast";
import { colors, textInputStyle } from "@/components/shared/styles";
import PageTitle from "@/features/teacher/components/PageTitle";
import StudentMenu from "@/features/teacher/management/components/StudentMenu";
import { deleteStudent, bulkDeleteStudents } from "@/lib/studentService";
import type { Student, StudentStatus } from "@/types/student";

type Tab = StudentStatus;

const STATUS_LABELS: Record<StudentStatus, string> = {
  active: "在籍",
  hidden: "非表示",
  graduated: "退塾",
};

const GRADUATE_NOTE = (
  <>
    退塾した生徒は「退塾」タブへ移動します。
    <br />
    完全に削除したい場合は、退塾タブから削除できます。
  </>
);

export default function ManagementPage() {
  const { user, authLoading } = useAuth();

  const {
    students,
    hiddenStudents,
    graduatedStudents,
    loading,
    error,
    fetchData,
  } = useTeacherStudents(user, authLoading);

  const { updateName, changeStatus, bulkChange } = useStudentActions(fetchData);
  const { toast, showToast } = useToast();

  const [tab, setTab] = useState<Tab>("active");
  const [query, setQuery] = useState("");
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [openedMenuId, setOpenedMenuId] = useState<string | null>(null);
  const [renameTarget, setRenameTarget] = useState<Student | null>(null);
  const [confirm, setConfirm] = useState<ConfirmOptions | null>(null);

  // =========================
  // 現在表示データ
  // =========================
  const studentsByTab: Record<Tab, Student[]> = {
    active: students,
    hidden: hiddenStudents,
    graduated: graduatedStudents,
  };

  const currentStudents = useMemo(() => {
    const list = { active: students, hidden: hiddenStudents, graduated: graduatedStudents }[tab];
    const q = query.trim();

    const filtered = q ? list.filter((s) => s.name.includes(q)) : list;

    // 退塾は退塾日の新しい順、それ以外は名前順
    return tab === "graduated"
      ? filtered
      : [...filtered].sort((a, b) => a.name.localeCompare(b.name, "ja"));
  }, [tab, query, students, hiddenStudents, graduatedStudents]);

  // =========================
  // 操作の共通処理
  // =========================
  const run = async (action: () => Promise<void>, successText: string) => {
    try {
      await action();
      showToast({ type: "success", text: successText });
    } catch (e) {
      console.error(e);
      showToast({ type: "error", text: "操作に失敗しました。もう一度お試しください" });
    }
  };

  const changeTab = (next: Tab) => {
    setTab(next);
    cancelBulkMode();
  };

  // =========================
  // bulk操作系
  // =========================
  const toggleSelect = (uid: string) => {
    setSelectedIds((prev) =>
      prev.includes(uid)
        ? prev.filter((id) => id !== uid)
        : [...prev, uid]
    );
  };

  const allSelected =
    currentStudents.length > 0 &&
    currentStudents.every((s) => selectedIds.includes(s.uid));

  const toggleSelectAll = () => {
    setSelectedIds(allSelected ? [] : currentStudents.map((s) => s.uid));
  };

  const cancelBulkMode = () => {
    setBulkMode(false);
    setSelectedIds([]);
  };

  const finishBulk = () => {
    setBulkMode(false);
    setSelectedIds([]);
  };

  const bulkStatus = (status: StudentStatus) =>
    run(async () => {
      await bulkChange(selectedIds, status);
      finishBulk();
    }, `${selectedIds.length}人を「${STATUS_LABELS[status]}」にしました`);

  const confirmBulkGraduate = () =>
    setConfirm({
      title: "退塾確認",
      message: `選択した ${selectedIds.length} 人を退塾にしますか？`,
      note: GRADUATE_NOTE,
      confirmLabel: "退塾する",
      danger: true,
      onConfirm: () => bulkStatus("graduated"),
    });

  const confirmBulkDelete = () =>
    setConfirm({
      title: "完全削除",
      message: `選択した ${selectedIds.length} 人を完全に削除しますか？`,
      note: "学習ログもすべて削除されます。この操作は元に戻せません。",
      confirmLabel: "削除する",
      danger: true,
      onConfirm: () =>
        run(async () => {
          await bulkDeleteStudents(selectedIds);
          finishBulk();
          await fetchData();
        }, `${selectedIds.length}人を削除しました`),
    });

  // =========================
  // 個別操作
  // =========================
  const confirmGraduate = (student: Student) =>
    setConfirm({
      title: "退塾確認",
      message: `${student.name} さんを退塾にしますか？`,
      note: GRADUATE_NOTE,
      confirmLabel: "退塾する",
      danger: true,
      onConfirm: () =>
        run(() => changeStatus(student.uid, "graduated"), `${student.name} さんを退塾にしました`),
    });

  const confirmDelete = (student: Student) =>
    setConfirm({
      title: "完全削除",
      message: `${student.name} さんを完全に削除しますか？`,
      note: "学習ログもすべて削除されます。この操作は元に戻せません。",
      confirmLabel: "削除する",
      danger: true,
      onConfirm: () =>
        run(async () => {
          await deleteStudent(student.uid);
          await fetchData();
        }, `${student.name} さんを削除しました`),
    });

  const tabs = (Object.keys(STATUS_LABELS) as Tab[]).map((value) => ({
    value,
    label: `${STATUS_LABELS[value]} (${studentsByTab[value].length})`,
  }));

  return (
    <>
      <PageTitle title="生徒管理" description="名前変更・非表示・退塾・削除ができます" />

      <Tabs tabs={tabs} value={tab} onChange={changeTab} />

      {/* ===================== */}
      {/* ツールバー */}
      {/* ===================== */}
      <div style={{ display: "flex", gap: 8, margin: "16px 0 12px", alignItems: "center" }}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="名前で検索"
          aria-label="名前で検索"
          style={{ ...textInputStyle, padding: 10, fontSize: 14, flex: 1, maxWidth: 320 }}
        />

        <div style={{ marginLeft: "auto" }}>
          {!bulkMode ? (
            <Button
              variant="secondary"
              size="sm"
              disabled={currentStudents.length === 0}
              onClick={() => {
                setBulkMode(true);
                setOpenedMenuId(null);
              }}
            >
              ☑ 一括操作
            </Button>
          ) : (
            <Button variant="secondary" colorVariant="gray" size="sm" onClick={cancelBulkMode}>
              一括操作をやめる
            </Button>
          )}
        </div>
      </div>

      {/* ===================== */}
      {/* bulk操作バー */}
      {/* ===================== */}
      {bulkMode && (
        <div
          style={{
            position: "sticky",
            top: 8,
            zIndex: 5,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 8,
            padding: 12,
            marginBottom: 12,
            borderRadius: 12,
            border: `1px solid ${colors.primary}`,
            background: "var(--card)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 14 }}>
            <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} />
            すべて選択
          </label>

          <div style={{ fontWeight: 700, fontSize: 14 }}>{selectedIds.length}人選択中</div>

          <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
            {tab === "active" && (
              <Button variant="secondary" size="sm" disabled={!selectedIds.length} onClick={() => bulkStatus("hidden")}>
                非表示
              </Button>
            )}

            {tab !== "active" && (
              <Button variant="secondary" size="sm" disabled={!selectedIds.length} onClick={() => bulkStatus("active")}>
                復帰
              </Button>
            )}

            {tab !== "graduated" && (
              <Button
                variant="secondary"
                colorVariant="danger"
                size="sm"
                disabled={!selectedIds.length}
                onClick={confirmBulkGraduate}
              >
                退塾
              </Button>
            )}

            {tab === "graduated" && (
              <Button
                variant="primary"
                colorVariant="danger"
                size="sm"
                disabled={!selectedIds.length}
                onClick={confirmBulkDelete}
              >
                完全削除
              </Button>
            )}
          </div>
        </div>
      )}

      {error && (
        <div
          role="alert"
          style={{
            padding: "10px 12px",
            marginBottom: 12,
            borderRadius: 10,
            background: `${colors.danger}15`,
            color: colors.danger,
            fontSize: 14,
          }}
        >
          生徒データの読み込みに失敗しました。ページを再読み込みしてください。
        </div>
      )}

      {/* ===================== */}
      {/* 一覧 */}
      {/* ===================== */}
      <div
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 12,
        }}
      >
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 16 }}>
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} height={24} width={`${60 - i * 8}%`} />
            ))}
          </div>
        ) : currentStudents.length === 0 ? (
          <div style={{ padding: 24, textAlign: "center", color: colors.muted }}>
            {query ? "該当する生徒がいません" : `${STATUS_LABELS[tab]}の生徒はいません`}
          </div>
        ) : (
          currentStudents.map((student) => {
            const selected = selectedIds.includes(student.uid);
            const highlighted = selected || openedMenuId === student.uid;

            return (
              <div
                key={student.uid}
                onClick={() => bulkMode && toggleSelect(student.uid)}
                style={{
                  padding: "14px 16px",
                  borderBottom: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: highlighted ? colors.primarySoft : "transparent",
                  boxShadow: highlighted ? `inset 4px 0 0 ${colors.primary}` : "none",
                  cursor: bulkMode ? "pointer" : "default",
                  userSelect: bulkMode ? "none" : "auto",
                }}
              >
                {bulkMode && (
                  <input
                    type="checkbox"
                    checked={selected}
                    aria-label={`${student.name}を選択`}
                    onChange={() => toggleSelect(student.uid)}
                    onClick={(e) => e.stopPropagation()}
                  />
                )}

                <div>
                  <div style={{ fontWeight: 600 }}>{student.name}</div>

                  {student.status === "graduated" && student.graduatedAt && (
                    <div style={{ fontSize: 12, color: colors.muted, marginTop: 4 }}>
                      退塾日：{student.graduatedAt.toDate().toLocaleDateString("ja-JP")}
                    </div>
                  )}
                </div>

                {!bulkMode && (
                  <div style={{ marginLeft: "auto" }}>
                    <StudentMenu
                      uid={student.uid}
                      status={student.status}
                      openedMenuId={openedMenuId}
                      onOpenChange={setOpenedMenuId}
                      onRename={() => setRenameTarget(student)}
                      onHide={() =>
                        run(() => changeStatus(student.uid, "hidden"), `${student.name} さんを非表示にしました`)
                      }
                      onGraduate={() => confirmGraduate(student)}
                      onRestore={() =>
                        run(() => changeStatus(student.uid, "active"), `${student.name} さんを復帰しました`)
                      }
                      onDelete={() => confirmDelete(student)}
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <NameEditModal
        open={renameTarget !== null}
        currentName={renameTarget?.name ?? ""}
        onClose={() => setRenameTarget(null)}
        onSave={async (name) => {
          if (!renameTarget) return;
          await updateName(renameTarget.uid, name);
          showToast({ type: "success", text: `名前を「${name}」に変更しました` });
        }}
      />

      <ConfirmDialog options={confirm} onClose={() => setConfirm(null)} />

      <Toast toast={toast} />
    </>
  );
}
