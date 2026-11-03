"use client";

import Button from "@/components/shared/Button";
import { formatDateWithDay, type WeekDate } from "@/lib/date";

type Props = {
  weekOffset: number;
  setWeekOffset: React.Dispatch<React.SetStateAction<number>>;
  week: WeekDate[];
};

const getWeekLabel = (offset: number) => {
  if (offset === 0) return "今週";
  if (offset === -1) return "先週";
  if (offset === 1) return "来週";

  return offset > 0 ? `${offset}週後` : `${-offset}週前`;
};

export default function WeekHeader({
  weekOffset,
  setWeekOffset,
  week,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
        marginBottom: 12,
      }}
    >
      <div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>{getWeekLabel(weekOffset)}</div>
        <div style={{ fontSize: 13, opacity: 0.6 }}>
          {formatDateWithDay(week[0].date)} ～ {formatDateWithDay(week[6].date)}
        </div>
      </div>

      <div style={{ display: "flex", gap: 6 }}>
        <Button variant="secondary" size="sm" onClick={() => setWeekOffset((p) => p - 1)}>
          ◀ 前の週
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={weekOffset === 0}
          onClick={() => setWeekOffset(0)}
        >
          今週
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={weekOffset >= 0}
          onClick={() => setWeekOffset((p) => p + 1)}
        >
          次の週 ▶
        </Button>
      </div>
    </div>
  );
}
