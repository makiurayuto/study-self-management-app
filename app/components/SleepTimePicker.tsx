"use client";

import type { CSSProperties } from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

const sleepTimes = Array.from({ length: 96 }).map((_, i) => {
  const h = String(Math.floor(i / 4)).padStart(2, "0");
  const m = String((i % 4) * 15).padStart(2, "0");
  return `${h}:${m}`;
});

const startIndex = sleepTimes.findIndex((t) => t === "20:00");

const reorderedSleepTimes = [
  ...sleepTimes.slice(startIndex),
  ...sleepTimes.slice(0, startIndex),
];

export default function SleepTimePicker({ value, onChange }: Props) {
  return (
    <div style={wrapperStyle}>
      <div style={centerLineStyle} />

      <div style={listStyle}>
        {reorderedSleepTimes.map((time) => (
          <div
            key={time}
            style={{
              ...itemStyle,
              opacity: value === time ? 1 : 0.4,
              fontWeight: value === time ? "bold" : "normal",
            }}
            onClick={() => onChange(time)}
          >
            {time}
          </div>
        ))}
      </div>
    </div>
  );
}

const wrapperStyle: CSSProperties = {
  height: 200,
  overflowY: "scroll",
  position: "relative",
  borderRadius: 12,
};

const listStyle: CSSProperties = {
  paddingTop: 80,
  paddingBottom: 80,
};

const itemStyle: CSSProperties = {
  height: 40,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  scrollSnapAlign: "center",
  cursor: "pointer",
};

const centerLineStyle: CSSProperties = {
  position: "absolute",
  top: "50%",
  left: 0,
  right: 0,
  height: 40,
  transform: "translateY(-50%)",
  borderTop: "1px solid #aaa",
  borderBottom: "1px solid #aaa",
  pointerEvents: "none",
};