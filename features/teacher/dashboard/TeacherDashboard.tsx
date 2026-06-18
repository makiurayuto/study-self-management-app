"use client";

import { useState } from "react";
import Button from "@/components/shared/Button";
import { useAuth } from "@/lib/auth/AuthContext";
import { useRouter } from "next/navigation";

import { useTeacherData }
from "@/features/teacher/dashboard/hooks/useTeacherData";
import DashboardContent from
"@/features/teacher/dashboard/components/DashboardContent";

import { formatDateForDisplay } from "@/lib/date";
import { formatDateForQuery } from "@/lib/date";

import { useMediaQuery } from "@/hooks/ui/useMediaQuery";

import { useTeacherDashboard } 
from "@/features/teacher/dashboard/hooks/useTeacherDashboard";

// =========================
// コンポーネント
// =========================

export default function TeacherDashboard() {

  const {
    currentDate,
    setCurrentDate,
    onPrevDay,
    onNextDay,
    onYesterday,
  } = useTeacherDashboard();

  const router = useRouter();
  const { user, authLoading, logout } = useAuth();

  const {
    logs,
    loading,
    studentMap,
    missingStudents,
    visibleLogs,
  } = useTeacherData(formatDateForQuery(currentDate));

  const currentDateLabel = formatDateForDisplay(currentDate);

  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  return (
    <div style={{ width: "100%", padding: "20px 24px", boxSizing: "border-box" }}>
      {/* ヘッダー */}
      <div style={{ marginBottom: 12 }}>
        <h1 style={{ textAlign: "center", marginBottom: 16, fontSize: "28px", fontWeight: "bold" }}>
          👨‍🏫 先生ダッシュボード
        </h1>

        <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", gap: 8, paddingRight: 20 }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCurrentDate(new Date(currentDate))}
          >
            更新
          </Button>

          <Button variant="secondary" size="sm" onClick={handleLogout}>
            ログアウト
          </Button>
        </div>
      </div>

      {/* ナビ */}
      <div style={{ display: "flex", justifyContent: "center", gap: 30, marginBottom: 24 }}>
        <Button variant="primary" size="lg" onClick={() => router.push("/teacher/students")}>
          生徒詳細一覧
        </Button>

        <Button variant="primary" size="lg" onClick={() => router.push("/teacher/management")}>
          生徒管理画面
        </Button>
      </div>

      {/* メイン */}
      <DashboardContent
        isMobile={isMobile}
        currentDateLabel={currentDateLabel}
        visibleLogs={visibleLogs}
        missingStudents={missingStudents}
        studentMap={studentMap}
        loading={loading}
        onPrevDay={onPrevDay}
        onNextDay={onNextDay}
        onYesterday={onYesterday}
      />
    </div>
  );
}