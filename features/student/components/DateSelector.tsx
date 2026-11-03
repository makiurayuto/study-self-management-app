"use client";

import Button from "@/components/shared/Button";
import { cardStyle, colors } from "@/components/shared/styles";
import { addDays, formatDateWithDay, getToday } from "@/lib/date";

type Props = {
  date: string;
  onChange: (date: string) => void;
};

const getRelativeLabel = (date: string, today: string) => {
  if (date === today) return "今日";
  if (date === addDays(today, -1)) return "昨日";
  if (date === addDays(today, -2)) return "一昨日";
  return null;
};

export default function DateSelector({ date, onChange }: Props) {
  const today = getToday();
  const relative = getRelativeLabel(date, today);
  const isToday = date === today;

  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: "bold" }}>📅 日付</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: colors.primary }}>
          {formatDateWithDay(date)}
          {relative && `（${relative}）`}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 8, alignItems: "center" }}>
        <Button
          variant="secondary"
          size="md"
          ariaLabel="前の日"
          onClick={() => onChange(addDays(date, -1))}
        >
          ◀
        </Button>

        <input
          type="date"
          value={date}
          max={today}
          aria-label="日付"
          onChange={(e) => {
            // クリアされた場合は無視
            if (e.target.value) onChange(e.target.value);
          }}
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: 12,
            border: "1px solid var(--border)",
            background: "var(--bg)",
            color: "var(--text)",
            fontSize: 16,
            outline: "none",
            boxSizing: "border-box",
            appearance: "none",
            WebkitAppearance: "none",
            textAlign: "center",
          }}
        />

        <Button
          variant="secondary"
          size="md"
          ariaLabel="次の日"
          disabled={isToday}
          onClick={() => onChange(addDays(date, 1))}
        >
          ▶
        </Button>
      </div>

      {!isToday && (
        <Button
          variant="secondary"
          colorVariant="gray"
          size="sm"
          onClick={() => onChange(today)}
        >
          今日に戻る
        </Button>
      )}
    </div>
  );
}
