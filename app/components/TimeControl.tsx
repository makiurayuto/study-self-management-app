"use client";

import { useState } from "react";
import Button from "./Button";
import { addMinutes } from "@/app/utils/time";

type Props = {
  label: string;
  value: string;
  setValue: (v: string) => void;
};

export default function TimeControl({ label, value, setValue }: Props) {
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(value || "00:00");

  const displayValue = value || "00:00";

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

      {/* 表示 or 直接入力 */}
      {!editing ? (
        <div
          onClick={() => {
            setTemp(value || "00:00");
            setEditing(true);
          }}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid var(--border)",
            textAlign: "center",
            fontWeight: "bold",
            background: "var(--bg)",
            cursor: "pointer",
          }}
        >
          {displayValue}
        </div>
      ) : (
        <input
          type="time"
          value={temp}
          onChange={(e) => setTemp(e.target.value)}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: "var(--bg)",
            color: "var(--text)",
            fontSize: 16,
          }}
        />
      )}

      {/* ボタン群 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        
        {/* 増加 */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Button onClick={() => setValue(addMinutes(value, 180))}>
            +3h
          </Button>

          <Button onClick={() => setValue(addMinutes(value, 60))}>
            +1h
          </Button>

          <Button onClick={() => setValue(addMinutes(value, 15))}>
            +15m
          </Button>
        </div>

        {/* 減少 */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Button onClick={() => setValue(addMinutes(value, -60))}>
                -1h
            </Button>
            
            <Button onClick={() => setValue(addMinutes(value, -15))}>
                -15m
            </Button>
        </div>

        {/* 直接入力確定ボタン */}
        {editing && (
          <div style={{ display: "flex", gap: 8 }}>
            <Button
              onClick={() => {
                setValue(temp);
                setEditing(false);
              }}
            >
              保存
            </Button>

            <Button
              variant="secondary"
              onClick={() => setEditing(false)}
            >
              キャンセル
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}