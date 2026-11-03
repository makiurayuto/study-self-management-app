"use client";

import { useState } from "react";
import Button from "@/components/shared/Button";
import { formatDateWithDay } from "@/lib/date";
import { useMediaQuery } from "@/hooks/ui/useMediaQuery";
import PageTitle from "@/features/teacher/components/PageTitle";
import { useTeacherData } from "@/features/teacher/dashboard/hooks/useTeacherData";
import { useTeacherDashboard } from "@/features/teacher/dashboard/hooks/useTeacherDashboard";
import DashboardContent from "@/features/teacher/dashboard/components/DashboardContent";

export default function TeacherDashboard() {
  const dashboard = useTeacherDashboard();

  const {
    loading,
    initialLoading,
    error,
    studentMap,
    missingStudents,
    visibleLogs,
    totalCount,
    refresh,
  } = useTeacherData(dashboard.date);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  return (
    <>
      <PageTitle
        title="ダッシュボード"
        description="日ごとの提出状況を確認できます"
        actions={
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing || loading}
          >
            {refreshing ? "更新中…" : "🔄 更新"}
          </Button>
        }
      />

      <DashboardContent
        isMobile={isMobile}
        currentDateLabel={formatDateWithDay(dashboard.date)}
        dateNav={dashboard}
        visibleLogs={visibleLogs}
        missingStudents={missingStudents}
        studentMap={studentMap}
        totalCount={totalCount}
        loading={loading}
        initialLoading={initialLoading}
        error={error}
      />
    </>
  );
}
