"use client";

import Button from "@/app/components/shared/Button";
import { formatDateForDisplay } from "@/app/lib/date";

type Props = {
  weekOffset: number;
  setWeekOffset: React.Dispatch<React.SetStateAction<number>>;
  week: { date: string }[];
};

export default function WeekHeader({
  weekOffset,
  setWeekOffset,
  week,
}: Props) {
  const getWeekLabel = (offset: number) => {
    if (offset === 0) return "今週";
    if (offset === -1) return "先週";
    if (offset === 1) return "来週";

    return `${offset > 0 ? "+" : ""}${offset}週`;
  };

  return (
    <>
      <div style={{ marginBottom: 12 }}>
        <h2 style={{ marginBottom: 4 }}>
          {getWeekLabel(weekOffset)}
        </h2>

        <div style={{ color: "#666", fontSize: 14 }}>
          {formatDateForDisplay(week[0].date)}
          {" ～ "}
          {formatDateForDisplay(week[6].date)}
        </div>
      </div>

      <div style={{ marginBottom: 12, display: "flex", gap: 8 }}>
        <Button
          variant="secondary"
          size="md"
          onClick={() => setWeekOffset((p) => p - 1)}
        >
          ← 前の週
        </Button>

        <Button
          variant="secondary"
          size="md"
          onClick={() => setWeekOffset(0)}
        >
          今週
        </Button>

        <Button
          variant="secondary"
          size="md"
          onClick={() => setWeekOffset((p) => p + 1)}
        >
          次の週 →
        </Button>
      </div>
    </>
  );
}