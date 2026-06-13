"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useTeacherStudents } from "../students/hooks/useTeacherStudents";
import { useStudentActions } from "@/app/teacher/management/hooks/useStudentActions";
import Button from "@/components/shared/Button";
import StudentMenu from "./components/StudentMenu";
import { useRouter } from "next/navigation"
import { db } from "@/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";

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
  const [graduateTarget, setGraduateTarget] = useState<string | null>(null);
  const [showBulkGraduateModal, setShowBulkGraduateModal] =
    useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  
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

    const enableBulkMode = () => {
        setBulkMode(true);
        setOpenedMenuId(null);
        setSelectedIds([]);
    };

    const handleDeleteStudent = async (
        uid: string
    ) => {
        const ok = window.confirm(
            "本当に削除しますか？\n学習ログも全て削除されます。"
        );

        if (!ok) return;

        const logsQuery = query(
            collection(db, "weeklyLogs"),
            where("uid", "==", uid)
        );

        const logsSnap = await getDocs(logsQuery);

        for (const logDoc of logsSnap.docs) {
            await deleteDoc(logDoc.ref);
        }

        await deleteDoc(doc(db, "users", uid));

        await fetchData();
    };

    const deleteStudentByUid = async (uid: string) => {
        const cleanUid = uid.trim();

        const allLogs = await getDocs(collection(db, "weeklyLogs"));

        console.log("total logs:", allLogs.size);

        allLogs.docs.slice(0, 5).forEach((d) => {
            console.log(d.id, d.data().uid);
        });

        const logsQuery = query(
            collection(db, "weeklyLogs"),
            where("uid", "==", cleanUid)
        );

        const logsSnap = await getDocs(logsQuery);

            console.log(
        "Deleting user:",
        cleanUid,
        "logs:",
        logsSnap.docs.length
    );

        await Promise.all(
            logsSnap.docs.map((d) => deleteDoc(d.ref))
        );

        await deleteDoc(doc(db, "users", cleanUid));
    };

    const handleBulkDelete = async () => {
         console.log("bulk delete start");
        const ok = window.confirm(
            `本当に${selectedIds.length}人を完全削除しますか？\nこの操作は戻せません。`
        );

        if (!ok) return;

        await Promise.all(
            selectedIds.map((uid) => deleteStudentByUid(uid))
        );

        setSelectedIds([]);
        setBulkMode(false);
        setShowBulkDeleteModal(false);

        await fetchData();
    };

  return (
    <div
        style={{
            width: "100%",
            maxWidth: 1400,
            margin: "0 auto",
            padding: "20px 24px",
        }}
    >
        <h1
          style={{
            textAlign: "center",
            marginBottom: 16,
            fontSize: "28px", 
            fontWeight: "bold",
          }}
        >
            生徒管理画面
        </h1>

        <div
            style={{
                display: "flex",
                gap: 30,
                justifyContent: "center",
                marginBottom: 16,
            }}
        >
            <Button
                variant="secondary"
                size="lg"
                onClick={() => router.push("/teacher")}
            >
                ダッシュボード
            </Button>

            <Button
                variant="secondary"
                size="lg"
                onClick={() => router.push("/teacher/students")}
            >
                生徒詳細一覧
            </Button>
        </div>

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
            onClick={() => {
                setTab("active");
                cancelBulkMode();
            }}
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
            onClick={() => {
                setTab("hidden");
                cancelBulkMode();
            }}
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
            onClick={() => {
                setTab("graduated");
                cancelBulkMode();
            }}
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

      <div style={{ marginLeft: "auto", marginBottom: 12 }}>
          {!bulkMode ? (
            <Button variant="secondary" onClick={enableBulkMode}>
              一括操作
            </Button>
          ) : (
            <Button
                variant="secondary"
                colorVariant="gray"
                onClick={cancelBulkMode}>
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
            <Button variant="secondary" onClick={clearSelection}>リセット</Button>
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
                    colorVariant="danger"
                    onClick={() => {
                        console.log("bulk graduate click");
                        setShowBulkGraduateModal(true);
                    }}
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
                    colorVariant="danger"
                    onClick={() => {
                        console.log("bulk graduate click");
                        setShowBulkGraduateModal(true);
                    }}
                >
                    退塾
                </Button>
                </>
            )}

            {tab === "graduated" && (
                <>
                <Button
                variant="secondary" 
                onClick={handleBulkRestore}
                >
                復帰
                </Button>

                <Button
                    variant="secondary"
                    colorVariant="danger"
                    onClick={handleBulkDelete}
                >
                    完全削除
                </Button>
                </>   
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
                    <div>
                        <div>{student.name}</div>

                        {student.status === "graduated" &&
                            student.graduatedAt && (
                            <div
                                style={{
                                fontSize: 12,
                                color: "#6b7280",
                                marginTop: 4,
                                }}
                            >
                                退塾日：
                                {student.graduatedAt.toDate().toLocaleDateString("ja-JP")}
                            </div>
                        )}
                    </div>
                </span>
                </div>

                {/* 右：3点メニュー（ここだけ変更） */}
                <div style={{ marginLeft: "auto" }}>
                    <StudentMenu
                        uid={student.uid}
                        status={student.status}
                        openedMenuId={openedMenuId}
                        onOpenChange={(id) => {
                            setOpenedMenuId(id);
                            setBulkMode(false); 
                            setSelectedIds([]);
                        }}
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
                        onHide={async (uid) => {
                            await changeStatus(uid, "hidden");
                            setOpenedMenuId(null);
                        }}

                        onGraduate={(uid) => {
                            setGraduateTarget(uid);
                            setOpenedMenuId(null);
                        }}

                        onRestore={async (uid) => {
                            await changeStatus(uid, "active");
                            setOpenedMenuId(null);
                        }}

                        onDelete={async (uid) => {
                            await handleDeleteStudent(uid);
                            setOpenedMenuId(null);
                        }}
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
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                    >
                    <h2 style={{ margin: 0, fontWeight: 700}}>名前変更</h2>

                    <button
                        onClick={() => setRenameTarget(null)}
                        style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontSize: 20,
                        lineHeight: 1,
                        }}
                    >
                        ✕
                    </button>
                </div>

                <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    style={{
                        width: "100%",
                        padding: 10,
                        marginTop: 10,

                        border: "1px solid #d1d5db",
                        borderRadius: 8,
                        outline: "none",
                    }}
                    onFocus={(e) => {
                        e.currentTarget.style.border = "1px solid #111827";
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.border = "1px solid #d1d5db";
                    }}
                />

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 15 }}>

                    <Button variant="secondary" onClick={() => setRenameTarget(null)}>
                        キャンセル
                    </Button>

                    <Button variant="secondary" onClick={handleRename}>
                        保存
                    </Button>

                </div>
                </div>
            </div>
        )}

        {showBulkGraduateModal && (
            <div
                style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                }}
            >
                <div
                style={{
                    background: "#fff",
                    padding: 24,
                    borderRadius: 12,
                    width: 360,
                }}
                >
                <h2 style={{ marginTop: 0, marginBottom: 12 , fontWeight: 700}}>
                    退塾確認
                </h2>

                <p style={{ marginBottom: 12 }}>
                    選択した {selectedIds.length} 名を退塾にしますか？
                </p>

                <p
                    style={{
                    fontSize: 13,
                    color: "#6b7280",
                    }}
                >
                    退塾した生徒は退塾タブへ移動します。<br />
                    完全に削除したい場合は、退塾タブから削除できます。
                </p>

                <div
                    style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 10,
                    marginTop: 20,
                    }}
                >
                    <Button
                        variant="secondary"
                        colorVariant="gray"
                        onClick={() =>
                            setShowBulkGraduateModal(false)
                        }
                    >
                    キャンセル
                    </Button>

                    <Button
                    variant="secondary" 
                    colorVariant="danger"
                    onClick={async () => {
                        await handleBulkGraduate();
                        setShowBulkGraduateModal(false);
                    }}
                    >
                    退塾する
                    </Button>
                </div>
                </div>
            </div>
        )}

        {graduateTarget && (
        <div
            style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            }}
        >
            <div
            style={{
                background: "#fff",
                padding: 24,
                borderRadius: 12,
                width: 360,
            }}
            >
            <h2 style={{ marginTop: 0, marginBottom: 12 , fontWeight: 700 }}>
                退塾確認
            </h2>

            <p style={{ marginBottom: 12 }}>
                この生徒を退塾にしますか？
            </p>

            <p
                style={{
                fontSize: 13,
                color: "#6b7280",
                }}
            >
                退塾した生徒は退塾タブへ移動します。<br />
                完全に削除したい場合は、退塾タブから削除できます。
            </p>

            <div
                style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                marginTop: 20,
                }}
            >
                <Button
                    variant="secondary"
                    colorVariant="gray"
                    onClick={() => setGraduateTarget(null)}
                >
                キャンセル
                </Button>

                <Button
                    variant="secondary" 
                    colorVariant="danger"
                    onClick={async () => {
                        await changeStatus(
                        graduateTarget,
                        "graduated"
                        );

                        setGraduateTarget(null);
                    }}
                >
                退塾する
                </Button>
            </div>
            </div>
        </div>
        )}

        {showBulkDeleteModal && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)" }}>
                <div style={{ background: "#fff", padding: 24, width: 360, margin: "auto", marginTop: 100 }}>
                
                <h2>完全削除</h2>

                <p>
                    {selectedIds.length}人を完全削除しますか？
                </p>

                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                    <Button
                    variant="secondary"
                    onClick={() => setShowBulkDeleteModal(false)}
                    >
                    キャンセル
                    </Button>

                    <Button
                    variant="secondary"
                    colorVariant="danger"
                    onClick={handleBulkDelete}
                    >
                    削除する
                    </Button>
                </div>
                </div>
            </div>
        )}
    </div>
    
  );
}