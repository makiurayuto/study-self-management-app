"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useTeacherStudents } from "../students/hooks/useTeacherStudents";
import { useStudentActions } from "@/app/teacher/management/hooks/useStudentActions";
import Button from "@/app/components/shared/Button";

type Tab = "active" | "hidden" | "graduated";

export default function ManagementPage() {
  const { user, authLoading } = useAuth();

  const {
    students,
    hiddenStudents,
    graduatedStudents,
    loading: studentsLoading,
    fetchData,
  } = useTeacherStudents(user, authLoading);

  const { changeStatus, bulkChange } = useStudentActions(fetchData);

  const [tab, setTab] = useState<Tab>("active");
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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

  if (authLoading) {
    return <div style={{ padding: 24 }}>読み込み中...</div>;
  }

  return (
    <div
        style={{
            width: "100%",
            maxWidth: 1400,
            margin: "0 auto",
            padding: 24,
        }}
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
            生徒
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
            非表示
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
            退塾生徒
        </button>
      </div>

      <div style={{ marginLeft: "auto" }}>
          {!bulkMode ? (
            <Button onClick={() => setBulkMode(true)}>
              一括操作
            </Button>
          ) : (
            <Button onClick={cancelBulkMode}>
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
            <Button onClick={selectAll}>全選択</Button>
            <Button onClick={clearSelection}>全解除</Button>
          </div>

          <div style={{ marginBottom: 12, fontWeight: "bold" }}>
            {selectedIds.length}件選択中
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            {tab === "active" && (
                <>
                <Button
                    onClick={handleBulkHide}
                >
                    非表示
                </Button>

                <Button
                    onClick={handleBulkGraduate}
                >
                    卒業
                </Button>
                </>
            )}

            {tab === "hidden" && (
                <>
                <Button
                    onClick={handleBulkRestore}
                >
                    復帰
                </Button>

                <Button
                    onClick={handleBulkGraduate}
                >
                    卒業
                </Button>
                </>
            )}

            {tab === "graduated" && (
                <Button
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
                backgroundColor: selectedIds.includes(student.uid)
                    ? "#f0f9ff"
                    : "transparent",
                cursor: "pointer",
                }}
                onClick={() => bulkMode && toggleSelect(student.uid)}
            >
                {bulkMode && (
                <input
                    type="checkbox"
                    checked={selectedIds.includes(student.uid)}
                    onChange={() => toggleSelect(student.uid)}
                    onClick={(e) => e.stopPropagation()} // ←チェックと行クリックの競合防止
                />
                )}

                <span
                onClick={(e) => {
                    e.stopPropagation(); // 行クリックと二重発火防止
                    if (bulkMode) toggleSelect(student.uid);
                }}
                style={{
                    userSelect: "none",
                }}
                >
                {student.name}
                </span>
            </div>
            ))
        )}
        </div>
    </div>
  );
}