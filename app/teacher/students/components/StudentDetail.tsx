"use client";

import WeekHeader from "./WeekHeader";
import LogTable from "./LogTable";
import Button from "@/app/components/shared/Button";

type Props = {
  selectedUid: string | null;
  studentMap: Record<string, string>;
  weekOffset: number;
  setWeekOffset: React.Dispatch<React.SetStateAction<number>>;
  getWeekLabel: (offset: number) => string;
  formatDateForDisplay: (date: string) => string;
  week: { date: string }[];
  filteredLogs: any[];
  setHidden: (uid: string) => Promise<void>;
};

export default function StudentDetail({
  selectedUid,
  studentMap,
  weekOffset,
  setWeekOffset,
  getWeekLabel,
  formatDateForDisplay,
  week,
  filteredLogs,
  setHidden,
}: Props) {
  if (!selectedUid) {
    return <p>👈 生徒を選択してください</p>;
  }

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20 }}>
          📊{" "}
          <span style={{ color: "#2563eb", fontWeight: 700 }}>
            {studentMap[selectedUid] ?? "不明な生徒"}
          </span>
          <span style={{ color: "#666" }}> の学習ログ</span>
        </h2>
      </div>

      <hr style={{ margin: "12px 0", borderColor: "#e5e7eb" }} />

      <WeekHeader
        weekOffset={weekOffset}
        setWeekOffset={setWeekOffset}
        getWeekLabel={getWeekLabel}
        formatDateForDisplay={formatDateForDisplay}
        week={week}
      />

      <LogTable
        filteredLogs={filteredLogs}
        formatDateDisplay={formatDateForDisplay}
      />

      <div style={{ height: 24 }} />

      <Button
        variant="secondary"
        colorVariant="danger"
        onClick={() => setHidden(selectedUid)}
      >
        非表示にする
      </Button>
    </>
  );
}