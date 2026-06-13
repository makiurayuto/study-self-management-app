"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import Sidebar from "@/app/teacher/students/components/Sidebar";
import StudentDetail from "@/app/teacher/students/components/StudentDetail";
import { useTeacherGuard } from "@/app/teacher/students/hooks/useTeacherGuard";
import { useTeacherData } from "@/app/teacher/students/hooks/useTeacherData";
import Button from "@/app/components/shared/Button";

export default function TeacherPage() {
  const { user, authLoading } = useAuth();
  const router = useRouter();

  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const [viewMode, setViewMode] =
    useState<"students" | "hidden">("students");

  const [weekOffset, setWeekOffset] = useState(0);

  const {
    students,
    hiddenStudents,
    studentMap,
    week,
    filteredLogs,
    logs,
    loading,
    fetchData,
    hideStudent,
  } = useTeacherData({
    user,
    authLoading,
    selectedUid,
    weekOffset,
  });

  useTeacherGuard({
    user,
    authLoading,
    fetchData,
  });

  const getWeekLabel = (offset: number) => {
    if (offset === 0) return "今週";
    if (offset === -1) return "先週";
    if (offset === 1) return "来週";
    return `${offset > 0 ? "+" : ""}${offset}週`;
  };

  useEffect(() => {
    console.log(selectedUid);
    console.log(studentMap);
  }, [selectedUid, studentMap]);

  if (authLoading) {
    return <div>認証確認中...</div>;
  }

  if (!user || user.role !== "teacher") {
    return null;
  }

  if (loading) {
    return <div>データ読み込み中...</div>;
  }

  // =========================
  // UI
  // =========================
  return (
    <div style={{ marginBottom: 16, padding: "20px 24px",}}>
      {/* 👇ここにタイトル */}
      <h1
          style={{
            textAlign: "center",
            marginBottom: 16,
            fontSize: "28px",
            fontWeight: "bold",
          }}
        >
        生徒詳細一覧
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
              onClick={() => router.push("/teacher/management")}
          >
              生徒管理画面
          </Button>
      </div>
      <hr style={{ marginTop: 20, border: "none", borderTop: "1px solid #e5e7eb" }} />

      <div style={{ display: "flex", height: "100vh" }}>
        <Sidebar
          students={students}
          hiddenStudents={hiddenStudents}
          viewMode={viewMode}
          setViewMode={setViewMode}
          selectedUid={selectedUid}
          setSelectedUid={setSelectedUid}
          fetchData={fetchData}
        />

        {/* ================= 右：詳細 ================= */}
        <div style={{ width: "70%", padding: 20 }}>

        <StudentDetail
            selectedUid={selectedUid}
            studentMap={studentMap}
            weekOffset={weekOffset}
            setWeekOffset={setWeekOffset}
            week={week}
            filteredLogs={filteredLogs}
            logs={logs}
            setHidden={hideStudent}
          />

        </div>
      </div>
    </div>
  );
}

// =========================
// styles
// =========================

const thStyle = {
  border: "1px solid #ccc",
  padding: 10,
  background: "#f3f4f6",
  textAlign: "left" as const,
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: 10,
};
