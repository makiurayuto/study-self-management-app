"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import Sidebar from "@/features/teacher/students/components/Sidebar";
import StudentDetail from "@/features/teacher/students/components/StudentDetail";
import { useTeacherGuard } from "@/features/teacher/students/hooks/useTeacherGuard";
import { useTeacherData } from "@/features/teacher/students/hooks/useTeacherData";
import Button from "@/components/shared/Button";

export default function StudentDetailsPage() {
  const { user, authLoading } = useAuth();
  const router = useRouter();

  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);

  const {
    students,
    studentMap,
    week,
    filteredLogs,
    logs,
    loading,
  } = useTeacherData({
    user,
    authLoading,
    selectedUid,
    weekOffset,
  });

  useTeacherGuard({
    user,
    authLoading,
  });

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
          selectedUid={selectedUid}
          setSelectedUid={setSelectedUid}
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
          />

        </div>
      </div>
    </div>
  );
}
