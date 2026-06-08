"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useTeacherStudents } from "../students/hooks/useTeacherStudents";
import { useStudentActions } from "@/app/teacher/management/hooks/useStudentActions";
import Button from "@/app/components/shared/Button";
import StudentMenu from "./components/StudentMenu";
import { useRouter } from "next/navigation"

type Tab = "active" | "hidden" | "graduated";

export default function ManagementPage() {
  const router = useRouter();
  const { user, authLoading } = useAuth();

  const {
    students,
    hiddenStudents,
    graduatedStudents,
    loading: studentsLoading,
    fetchData,
  } = useTeacherStudents(user, authLoading);

  const { updateName, changeStatus, bulkChange } = useStudentActions(fetchData);

  const [tab, setTab] = useState<Tab>("active");
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [openedMenuId, setOpenedMenuId] = useState<string | null>(null);
  console.log("openedMenuId =", openedMenuId);
  const [renameTarget, setRenameTarget] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  // =========================
  // 現在表示データ
  // =========================
  const currentStudents = useMemo(() => {
    switch (tab) {
      case "active":
        return students;
      case "hidden":
        return hiddenStudents;
      case "graduated":
        return graduatedStudents;
      default:
        return [];
    }
  }, [tab, students, hiddenStudents, graduatedStudents]);

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

  const selectAll = () => {
    setSelectedIds(currentStudents.map((s) => s.uid));
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const cancelBulkMode = () => {
    setBulkMode(false);
    setSelectedIds([]);
  };

    const handleBulkHide = async () => {
    await Promise.all(
        selectedIds.map((uid) => changeStatus(uid, "hidden"))
    );

    setBulkMode(false);
    setSelectedIds([]);
    };

    const handleBulkGraduate = async () => {
    await Promise.all(
        selectedIds.map((uid) => changeStatus(uid, "graduated"))
    );

    setBulkMode(false);
    setSelectedIds([]);
    };

    const handleBulkRestore = async () => {
        await Promise.all(
            selectedIds.map((uid) => changeStatus(uid, "active"))
        );

        setBulkMode(false);
        setSelectedIds([]);
    };

    const handleRename = async () => {
        if (!renameTarget) return;

        await updateName(renameTarget, newName);

        setRenameTarget(null);
        setNewName("");

        await fetchData();
    };

  return (
    <div
        style={{
            width: "100%",
            maxWidth: 1400,
            margin: "0 auto",
            padding: 24,
        }}
        onClick={() => setOpenedMenuId(null)}
    >
      <h1>生徒管理</h1>

      {/* ===================== */}
      {/* タブ */}
      {/* ===================== */}
      <div
        style={{
            display: "flex",
            gap: 10,
            marginBottom: 20,
            padding: 6,
            background: "#f3f4f6",
            borderRadius: 12,
        }}
        >
        <button
            onClick={() => setTab("active")}
            style={{
            flex: 1,
            padding: "12px 14px",
            borderRadius: 10,
            border: "none",
            fontSize: 14,
            fontWeight: tab === "active" ? 600 : 500,
            background: tab === "active" ? "#ffffff" : "transparent",
            color: tab === "active" ? "#111827" : "#6b7280",
            boxShadow:
                tab === "active"
                ? "0 2px 10px rgba(0,0,0,0.08)"
                : "none",
            cursor: "pointer",
            transition: "all 0.15s ease",
            }}
        >
            生徒 ({students.length})
        </button>

        <button
            onClick={() => setTab("hidden")}
            style={{
            flex: 1,
            padding: "12px 14px",
            borderRadius: 10,
            border: "none",
            fontSize: 14,
            fontWeight: tab === "hidden" ? 600 : 500,
            background: tab === "hidden" ? "#ffffff" : "transparent",
            color: tab === "hidden" ? "#111827" : "#6b7280",
            boxShadow:
                tab === "hidden"
                ? "0 2px 10px rgba(0,0,0,0.08)"
                : "none",
            cursor: "pointer",
            transition: "all 0.15s ease",
            }}
        >
            非表示 ({hiddenStudents.length})
        </button>

        <button
            onClick={() => setTab("graduated")}
            style={{
            flex: 1,
            padding: "12px 14px",
            borderRadius: 10,
            border: "none",
            fontSize: 14,
            fontWeight: tab === "graduated" ? 600 : 500,
            background: tab === "graduated" ? "#ffffff" : "transparent",
            color: tab === "graduated" ? "#111827" : "#6b7280",
            boxShadow:
                tab === "graduated"
                ? "0 2px 10px rgba(0,0,0,0.08)"
                : "none",
            cursor: "pointer",
            transition: "all 0.15s ease",
            }}
        >
            退塾生徒 ({graduatedStudents.length})
        </button>
      </div>

      <div style={{ marginLeft: "auto" }}>
          {!bulkMode ? (
            <Button variant="secondary" onClick={() => setBulkMode(true)}>
              一括操作
            </Button>
          ) : (
            <Button variant="secondary" onClick={cancelBulkMode}>
              キャンセル
            </Button>
          )}
      </div>

      {/* ===================== */}
      {/* bulk操作バー */}
      {/* ===================== */}
      {bulkMode && (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
            <Button variant="secondary" onClick={selectAll}>全選択</Button>
            <Button variant="secondary" onClick={clearSelection}>全解除</Button>
          </div>

          <div style={{ marginBottom: 12, fontWeight: "bold" }}>
            {selectedIds.length}件選択中
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            {tab === "active" && (
                <>
                <Button
                    variant="secondary" 
                    onClick={handleBulkHide}
                >
                    非表示
                </Button>

                <Button
                    variant="secondary" 
                    onClick={handleBulkGraduate}
                >
                    退塾
                </Button>
                </>
            )}

            {tab === "hidden" && (
                <>
                <Button
                    variant="secondary" 
                    onClick={handleBulkRestore}
                >
                    復帰
                </Button>

                <Button
                    variant="secondary" 
                    onClick={handleBulkGraduate}
                >
                    卒業
                </Button>
                </>
            )}

            {tab === "graduated" && (
                <Button
                variant="secondary" 
                onClick={handleBulkRestore}
                >
                復帰
                </Button>
            )}
            </div>
        </div>
      )}

      {/* ===================== */}
      {/* 一覧 */}
      {/* ===================== */}
        <div style={{ border: "1px solid #ddd", borderRadius: 8 }}>
        {currentStudents.length === 0 ? (
            <div style={{ padding: 16 }}>生徒がいません</div>
        ) : (
            currentStudents.map((student) => (
            <div
                key={student.uid}
                style={{
                padding: 16,
                borderBottom: "1px solid #eee",
                display: "flex",
                alignItems: "center",
                gap: 12,
                backgroundColor:
                    openedMenuId === student.uid ||
                    selectedIds.includes(student.uid)
                        ? "#f0f9ff"
                        : "transparent",

                boxShadow:
                    openedMenuId === student.uid ||
                    selectedIds.includes(student.uid)
                        ? "inset 4px 0 0 #3b82f6"
                        : "none",
                cursor: bulkMode ? "pointer" : "default",
                transition: "all 0.15s ease",
                }}
                onClick={() => bulkMode && toggleSelect(student.uid)}
            >
                {/* 左：チェック＋名前 */}
                <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                }}
                >
                {bulkMode && (
                    <input
                    type="checkbox"
                    checked={selectedIds.includes(student.uid)}
                    onChange={() => toggleSelect(student.uid)}
                    onClick={(e) => e.stopPropagation()}
                    />
                )}

                <span
                    onClick={(e) => {
                        e.stopPropagation();
                        if (bulkMode) toggleSelect(student.uid);
                    }}
                    style={{
                        userSelect: "none",
                        cursor: bulkMode ? "pointer" : "default",
                    }}
                >
                    {student.name}
                </span>
                </div>

                {/* 右：3点メニュー（ここだけ変更） */}
                <div style={{ marginLeft: "auto" }}>
                    <StudentMenu
                        uid={student.uid}
                        status={student.status}
                        openedMenuId={openedMenuId}
                        onOpenChange={setOpenedMenuId}
                        onDetail={(uid) =>
                            router.push(`/teacher/students/${uid}`)
                        }
                        onRename={(uid) => {
                            const target = [...students, ...hiddenStudents, ...graduatedStudents]
                            .find((s) => s.uid === uid);

                            setOpenedMenuId(null);

                            setTimeout(() => {
                            setRenameTarget(uid);
                            setNewName(target?.name ?? "");
                            }, 0);
                        }}
                        onHide={(uid) => changeStatus(uid, "hidden")}
                        onGraduate={(uid) => changeStatus(uid, "graduated")}
                        onRestore={(uid) => changeStatus(uid, "active")}
                    />
                </div>
            </div>
            ))
        )}
        </div>
        {renameTarget && (
            <div
                style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                }}
                onClick={() => setRenameTarget(null)}
            >
                <div
                style={{
                    background: "white",
                    padding: 20,
                    borderRadius: 12,
                    width: 320,
                }}
                onClick={(e) => e.stopPropagation()}
                >
                <h3>名前変更</h3>

                <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    style={{ width: "100%", padding: 8, marginTop: 10 }}
                />

                <div style={{ display: "flex", gap: 10, marginTop: 15 }}>

                    <button onClick={() => setRenameTarget(null)}>
                        キャンセル
                    </button>

                    <button onClick={handleRename}>
                        保存
                    </button>

                </div>
                </div>
            </div>
          )}
    </div>
    
  );
}