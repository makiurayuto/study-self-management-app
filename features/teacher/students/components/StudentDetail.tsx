"use client";

import { useState } from "react";
import WeekHeader from "./WeekHeader";
import LogTable from "./LogTable";
import CsvExportModal from "./CsvExportModal";
import Button from "@/components/shared/Button";
import Skeleton from "@/components/shared/Skeleton";
import { colors } from "@/components/shared/styles";
import { useStudentCsv } from "../hooks/useStudentCsv";
import type { WeekDate } from "@/lib/date";
import type { StudentDailyLog } from "@/types/student-log";

type Props = {
  selectedUid: string | null;
  studentMap: Record<string, string>;
  weekOffset: number;
  setWeekOffset: React.Dispatch<React.SetStateAction<number>>;
  week: WeekDate[];
  filteredLogs: StudentDailyLog[];
  logs: StudentDailyLog[];
  logsLoading?: boolean;
  onBack?: () => void;
};

export default function StudentDetail({
  selectedUid,
  studentMap,
  weekOffset,
  setWeekOffset,
  week,
  filteredLogs,
  logs,
  logsLoading = false,
  onBack,
}: Props) {
  const [showCsvModal, setShowCsvModal] = useState(false);

  const { exportCsv } = useStudentCsv({
    logs,
    selectedUid,
    studentMap,
  });

  if (!selectedUid) {
    return (
      <div style={{ padding: "60px 0", textAlign: "center", color: colors.muted }}>
        👈 左の一覧から生徒を選択してください
      </div>
    );
  }

  return (
    <>
      {onBack && (
        <Button variant="secondary" colorVariant="gray" size="sm" onClick={onBack}>
          ← 一覧に戻る
        </Button>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          margin: "12px 0 16px",
        }}
      >
        <h2 style={{ fontSize: 20, margin: 0 }}>
          <span style={{ color: colors.primary, fontWeight: 700 }}>
            {studentMap[selectedUid] ?? "不明な生徒"}
          </span>
          <span style={{ opacity: 0.6, fontWeight: 400 }}> の学習ログ</span>
        </h2>

        <Button
          variant="secondary"
          colorVariant="success"
          size="sm"
          onClick={() => setShowCsvModal(true)}
        >
          ⬇ CSV出力
        </Button>
      </div>

      <WeekHeader
        weekOffset={weekOffset}
        setWeekOffset={setWeekOffset}
        week={week}
      />

      {logsLoading ? (
        <Skeleton height={320} radius={12} />
      ) : (
        <LogTable week={week} filteredLogs={filteredLogs} />
      )}

      <CsvExportModal
        open={showCsvModal}
        onClose={() => setShowCsvModal(false)}
        onExport={exportCsv}
      />
    </>
  );
}
