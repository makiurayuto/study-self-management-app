"use client";

import { useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useTeacherStudents } from "../students/hooks/useTeacherStudents";

type Tab = "active" | "hidden" | "graduated";

export default function ManagementPage() {
  const { user, authLoading } = useAuth();

  const {
    students,
    hiddenStudents,
    graduatedStudents,
    loading: studentsLoading,
  } = useTeacherStudents(user, authLoading);

  const [tab, setTab] = useState<Tab>("active");

  const currentStudents =
    tab === "active"
      ? students
      : tab === "hidden"
      ? hiddenStudents
      : graduatedStudents;

  if (authLoading) {
    return <div style={{ padding: 24 }}>読み込み中...</div>;
  }

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: 24,
      }}
    >
      <h1>生徒管理</h1>

      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <button
          onClick={() => setTab("active")}
          style={{
            padding: "8px 16px",
            fontWeight: tab === "active" ? "bold" : "normal",
          }}
        >
          現役 ({students.length})
        </button>

        <button
          onClick={() => setTab("hidden")}
          style={{
            padding: "8px 16px",
            fontWeight: tab === "hidden" ? "bold" : "normal",
          }}
        >
          テスト ({hiddenStudents.length})
        </button>

        <button
          onClick={() => setTab("graduated")}
          style={{
            padding: "8px 16px",
            fontWeight: tab === "graduated" ? "bold" : "normal",
          }}
        >
          卒業 ({graduatedStudents.length})
        </button>
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        {currentStudents.length === 0 ? (
          <div style={{ padding: 16 }}>
            生徒がいません
          </div>
        ) : (
          currentStudents.map((student) => (
            <div
              key={student.uid}
              style={{
                padding: 16,
                borderBottom: "1px solid #eee",
              }}
            >
              {student.name}
            </div>
          ))
        )}
      </div>
    </div>
  );
}