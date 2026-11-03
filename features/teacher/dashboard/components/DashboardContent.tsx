"use client";

import Card from "@/components/shared/Card";
import SectionTitle from "@/components/shared/SectionTitle";
import Skeleton from "@/components/shared/Skeleton";
import { colors } from "@/components/shared/styles";
import DateNavigator from "@/components/shared/DateNavigator";

import SummaryStats from "@/features/teacher/dashboard/components/SummaryStats";
import MissingStudents from "@/features/teacher/dashboard/components/MissingStudents";
import SubmittedStudentsTable from "@/features/teacher/dashboard/components/SubmittedStudentsTable";
import SubmittedStudentsAccordion from "@/features/teacher/dashboard/components/SubmittedStudentsAccordion";
import type { useTeacherDashboard } from "@/features/teacher/dashboard/hooks/useTeacherDashboard";
import type { StudentDailyLog } from "@/types/student-log";
import type { Student } from "@/types/student";

type Props = {
  isMobile: boolean;
  currentDateLabel: string;
  dateNav: ReturnType<typeof useTeacherDashboard>;

  visibleLogs: StudentDailyLog[];
  missingStudents: Student[];
  studentMap: Record<string, string>;
  totalCount: number;

  loading: boolean;
  initialLoading: boolean;
  error: boolean;
};

export default function DashboardContent({
  isMobile,
  currentDateLabel,
  dateNav,
  visibleLogs,
  missingStudents,
  studentMap,
  totalCount,
  loading,
  initialLoading,
  error,
}: Props) {
  return (
    <>
      <Card>
        <DateNavigator
          currentDateLabel={currentDateLabel}
          onPrevDay={dateNav.onPrevDay}
          onNextDay={dateNav.onNextDay}
          onYesterday={dateNav.onYesterday}
          onToday={dateNav.onToday}
          disableNext={dateNav.isToday}
          isYesterday={dateNav.isYesterday}
          isToday={dateNav.isToday}
        />
      </Card>

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
          データの読み込みに失敗しました。「更新」を押すか、ページを再読み込みしてください。
        </div>
      )}

      {initialLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Skeleton height={90} radius={12} />
          <Skeleton height={120} radius={12} />
          <Skeleton height={240} radius={12} />
        </div>
      ) : (
        <div
          style={{
            opacity: loading ? 0.5 : 1,
            pointerEvents: loading ? "none" : "auto",
            transition: "opacity 0.2s",
          }}
        >
          <SummaryStats logs={visibleLogs} totalCount={totalCount} />

          <MissingStudents students={missingStudents} />

          <Card>
            <SectionTitle>
              ✅ 提出済み（{visibleLogs.length}人）
            </SectionTitle>

            {visibleLogs.length === 0 ? (
              <p style={{ margin: 0, color: colors.muted }}>まだ提出がありません</p>
            ) : isMobile ? (
              <SubmittedStudentsAccordion
                logs={visibleLogs}
                studentMap={studentMap}
              />
            ) : (
              <SubmittedStudentsTable
                visibleLogs={visibleLogs}
                studentMap={studentMap}
              />
            )}
          </Card>
        </div>
      )}
    </>
  );
}
