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
        background: "var(--card)",
        borderRadius: 12,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {/* ラベル */}
      <div style={{ fontWeight: "bold" }}>{label}</div>

      {/* 表示 */}
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

      {/* ボタン（2段構成） */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        
        {/* 1段目 */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>

            <Button
                variant="secondary"
                onClick={() => setValue(addMinutes(value, 180))}
            >
                +3h
          </Button>

            <Button
                variant="secondary"
                onClick={() => setValue(addMinutes(value, 60))}
            >
                +1h
          </Button>
          <Button
            variant="secondary"
            onClick={() => setValue(addMinutes(value, 15))}
          >
            +15m
          </Button>
        </div>

        {/* 2段目 */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Button
            variant="secondary"
            onClick={() => setValue(addMinutes(value, -60))}
          >
            -1h
          </Button>

          <Button
            variant="secondary"
            onClick={() => setValue(addMinutes(value, -15))}
          >
            -15m
          </Button>
        </div>

      </div>
    </div>
  );
}