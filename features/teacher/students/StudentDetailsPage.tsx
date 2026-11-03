"use client";
import { useMemo, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { getWeekDates } from "@/lib/date";
import Skeleton from "@/components/shared/Skeleton";
import { useMediaQuery } from "@/hooks/ui/useMediaQuery";
import PageTitle from "@/features/teacher/components/PageTitle";
import Sidebar from "@/features/teacher/students/components/Sidebar";
import StudentDetail from "@/features/teacher/students/components/StudentDetail";
import { useTeacherData } from "@/features/teacher/students/hooks/useTeacherData";

export default function StudentDetailsPage() {
  const { user, authLoading } = useAuth();
  const isMobile = useMediaQuery("(max-width: 768px)");

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

  // 今週の記録日数（一覧のバッジ用）
  const weekCounts = useMemo(() => {
    const thisWeek = new Set(getWeekDates(0).map((d) => d.date));
    const counts: Record<string, number> = {};

    for (const log of logs) {
      if (thisWeek.has(log.date)) {
        counts[log.uid] = (counts[log.uid] ?? 0) + 1;
      }
    }

    return counts;
  }, [logs]);

  const title = (
    <PageTitle title="生徒詳細" description="生徒ごとの1週間の記録とCSV出力" />
  );

  if (loading) {
    return (
      <>
        {title}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "280px 1fr", gap: 16 }}>
          <Skeleton height={400} radius={12} />
          {!isMobile && <Skeleton height={400} radius={12} />}
        </div>
      </>
    );
  }

  const sidebar = (
    <Sidebar
      students={students}
      selectedUid={selectedUid}
      setSelectedUid={setSelectedUid}
      weekCounts={weekCounts}
    />
  );

  const detail = (
    <StudentDetail
      selectedUid={selectedUid}
      studentMap={studentMap}
      weekOffset={weekOffset}
      setWeekOffset={setWeekOffset}
      week={week}
      filteredLogs={filteredLogs}
      logs={logs}
      onBack={isMobile ? () => setSelectedUid(null) : undefined}
    />
  );

  // スマホ：一覧 → 詳細 の画面切替
  if (isMobile) {
    return (
      <>
        {title}
        {selectedUid ? <div>{detail}</div> : sidebar}
      </>
    );
  }

  return (
    <>
      {title}
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20, alignItems: "start" }}>
        {sidebar}
        <div
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 20,
            minWidth: 0,
          }}
        >
          {detail}
        </div>
      </div>
    </>
  );
}
