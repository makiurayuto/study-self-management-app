"use client";

import Button from "@/app/components/shared/Button";

type Props = {
  weekOffset: number;
  setWeekOffset: React.Dispatch<React.SetStateAction<number>>;
  getWeekLabel: (offset: number) => string;
  formatDateForDisplay: (date: string) => string;
  week: { date: string }[];
};

export default function WeekHeader({
  weekOffset,
  setWeekOffset,
  getWeekLabel,
  formatDateForDisplay,
  week,
}: Props) {
  return (
    <>
      <div style={{ marginBottom: 12 }}>
        <h2 style={{ marginBottom: 4 }}>
          {getWeekLabel(weekOffset)}
        </h2>

        <div style={{ color: "#666", fontSize: 14 }}>
          {formatDateForDisplay(week[0].date)} 〜{" "}
          {formatDateForDisplay(week[6].date)}
        </div>
      </div>

      <div style={{ marginBottom: 12, display: "flex", gap: 8 }}>
        <Button variant="secondary" size="md" onClick={() => setWeekOffset((p) => p - 1)}>
          ← 前の週
        </Button>

        <Button variant="secondary" size="md" onClick={() => setWeekOffset(0)}>
          今週
        </Button>

        <Button variant="secondary" size="md" onClick={() => setWeekOffset((p) => p + 1)}>
          次の週 →
        </Button>
      </div>
    </>
  );
}