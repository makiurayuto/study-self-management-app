"use client";

import Button from "@/components/shared/Button";
import { formatDuration, minutesToTime, timeToMinutes } from "@/lib/time";

type Props = {
  label: string;
  value: string; // "" = 未入力 / "HH:MM"
  setValue: (v: string) => void;
  invalid?: boolean;
};

const MAX_MINUTES = 23 * 60 + 59;

export default function TimeControl({ label, value, setValue, invalid = false }: Props) {
  // 時間の長さなので 0〜23:59 に収める（日付をまたいで戻らないように）
  const add = (diff: number) => {
    const next = Math.min(
      MAX_MINUTES,
      Math.max(0, timeToMinutes(value) + diff)
    );
    setValue(minutesToTime(next));
  };

  return (
    <div
      style={{
        background: "var(--card)",
        border: `1px solid ${invalid ? "#ef4444" : "var(--border)"}`,
        borderRadius: 16,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {/* ラベル + 現在値 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ fontWeight: "bold" }}>{label}</div>
        <div style={{ fontSize: 14, color: value ? "#4f46e5" : invalid ? "#ef4444" : "#9ca3af", fontWeight: 600 }}>
          {value ? formatDuration(timeToMinutes(value)) : "未入力"}
        </div>
      </div>

      {/* 直接入力 */}
      <input
        type="time"
        value={value}
        aria-label={label}
        onChange={(e) => setValue(e.target.value)}
        style={{
          padding: "10px 14px",
          borderRadius: 8,
          border: "1px solid var(--border)",
          background: "var(--bg)",
          color: "var(--text)",
          fontSize: 16,
          textAlign: "center",
          outline: "none",
        }}
      />

      {/* ボタン群 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
        <Button variant="secondary" size="md" onClick={() => add(180)}>
          +3h
        </Button>
        <Button variant="secondary" size="md" onClick={() => add(60)}>
          +1h
        </Button>
        <Button variant="secondary" size="md" onClick={() => add(15)}>
          +15m
        </Button>

        <Button variant="secondary" size="md" onClick={() => add(-60)} disabled={!value}>
          -1h
        </Button>
        <Button variant="secondary" size="md" onClick={() => add(-15)} disabled={!value}>
          -15m
        </Button>
        <Button variant="secondary" colorVariant="gray" size="md" onClick={() => setValue("00:00")}>
          0時間
        </Button>
      </div>
    </div>
  );
}
