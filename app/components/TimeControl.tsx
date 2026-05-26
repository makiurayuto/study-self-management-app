"use client";

import Button from "./Button";
import { addMinutes } from "@/app/utils/time";

type Props = {
  label: string;
  value: string;
  setValue: (v: string) => void;
};

export default function TimeControl({ label, value, setValue }: Props) {
  return (
    <div
      style={{
        background: "var(--card)",   // ← cardStyle相当
        borderRadius: 12,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {/* ラベル */}
      <div style={{ fontWeight: "bold" }}>{label}</div>

      {/* 操作エリア */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <Button variant="secondary" onClick={() => setValue(addMinutes(value, -60))}>
          -1h
        </Button>

        <Button variant="secondary" onClick={() => setValue(addMinutes(value, -15))}>
          -15m
        </Button>

        {/* 表示部分（cardStyleの中の「小カード」） */}
        <div
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            border: "1px solid var(--border)",
            minWidth: 80,
            textAlign: "center",
            fontWeight: "bold",
            background: "var(--bg)",
          }}
        >
          {value || "00:00"}
        </div>

        <Button variant="secondary" onClick={() => setValue(addMinutes(value, 15))}>
          +15m
        </Button>

        <Button variant="secondary" onClick={() => setValue(addMinutes(value, 60))}>
          +1h
        </Button>
      </div>
    </div>
  );
}