"use client";

import Button from "@/app/components/shared/Button";
import { addMinutes } from "@/lib/time";

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
        gap: 10,
      }}
    >
      {/* ラベル */}
      <div style={{ fontWeight: "bold" }}>{label}</div>

      {/* 直接入力（ここがメイン） */}
      <input
        type="time"
        value={value || "00:00"}
        onChange={(e) => setValue(e.target.value)} // ← 即反映
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
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        
        {/* 増加系 */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Button variant="secondary" size="md" onClick={() => setValue(addMinutes(value, 180))}>
            +3h
          </Button>

          <Button variant="secondary" size="md" onClick={() => setValue(addMinutes(value, 60))}>
            +1h
          </Button>

          <Button variant="secondary" size="md" onClick={() => setValue(addMinutes(value, 15))}>
            +15m
          </Button>
        </div>

        {/* 減少系 */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Button variant="secondary" size="md" onClick={() => setValue(addMinutes(value, -60))}>
            -1h
          </Button>

          <Button variant="secondary" size="md" onClick={() => setValue(addMinutes(value, -15))}>
            -15m
          </Button>

            <Button
              variant="secondary"
              colorVariant="gray"
              size="sm"
              className="ml-2"
              onClick={() => setValue("00:00")}
            >
              リセット
            </Button>
        </div>
      </div>
    </div>
  );
}