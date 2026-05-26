"use client";

import { timeToMinutes, minutesToTime } from "@/app/utils/time";

type Props = {
  value: string;
  onChange: (v: string) => void;
  label: string;
};

export default function TimeAdjuster({ value, onChange, label }: Props) {
  const current = value || "00:00";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ fontWeight: "bold" }}>{label}</div>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button
          onClick={() =>
            onChange(
              minutesToTime(Math.max(0, timeToMinutes(current) - 60))
            )
          }
        >
          -1h
        </button>

        <button
          onClick={() =>
            onChange(
              minutesToTime(Math.max(0, timeToMinutes(current) - 15))
            )
          }
        >
          -15m
        </button>

        <div
          style={{
            minWidth: 100,
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 20,
          }}
        >
          {current}
        </div>

        <button
          onClick={() =>
            onChange(minutesToTime(timeToMinutes(current) + 15))
          }
        >
          +15m
        </button>

        <button
          onClick={() =>
            onChange(minutesToTime(timeToMinutes(current) + 60))
          }
        >
          +1h
        </button>
      </div>
    </div>
  );
}