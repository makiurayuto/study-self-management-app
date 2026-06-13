"use client";

import Card from "@/app/components/shared/Card";
import SectionTitle from "@/app/components/shared/SectionTitle";

import DateSection from "@/features/teacher/dashboard/components/DateSection";
import MissingStudents from "@/features/teacher/dashboard/components/MissingStudents";
import SubmittedStudentsTable from "@/features/teacher/dashboard/components/SubmittedStudentsTable";
import SubmittedStudentsAccordion from "@/features/teacher/dashboard/components/SubmittedStudentsAccordion";

type Student = {
  uid: string;
  name: string;
};

type Log = {
  uid: string;
  date: string;
  studyTime: number | null;
  phoneTime: number | null;
  sleepTime: string;
  satisfaction: string;
};

type Props = {
  isMobile: boolean;

  currentDateLabel: string;

  visibleLogs: Log[];
  missingStudents: Student[];

  studentMap: Record<string, string>;

  loading: boolean;

  onPrevDay: () => void;
  onNextDay: () => void;
  onYesterday: () => void;
};

export default function DashboardContent({
  isMobile,

  currentDateLabel,

  visibleLogs,
  missingStudents,

  studentMap,

  loading,

  onPrevDay,
  onNextDay,
  onYesterday,
}: Props) {
  return (
    <>
      <DateSection
        currentDateLabel={currentDateLabel}
        onPrevDay={onPrevDay}
        onNextDay={onNextDay}
        onYesterday={onYesterday}
      />

      <MissingStudents
        students={missingStudents}
      />

      <Card>
        <SectionTitle>
          ✅ 提出済み
        </SectionTitle>

        {isMobile ? (
          <SubmittedStudentsAccordion
            logs={visibleLogs}
            studentMap={studentMap}
          />
        ) : (
          <SubmittedStudentsTable
            visibleLogs={visibleLogs}
            studentMap={studentMap}
            loading={loading}
          />
        )}
      </Card>
    </>
  );
}