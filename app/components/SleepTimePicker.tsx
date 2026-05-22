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

const wrapperStyle: CSSProperties = {
  height: 200,
  overflowY: "scroll",
  position: "relative",
  border: "1px solid #ddd",
  borderRadius: 12,
  scrollSnapType: "y mandatory",
};

const itemStyle: CSSProperties = {
  height: 40,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  scrollSnapAlign: "center",
  cursor: "pointer",
};

const listStyle = {
  paddingTop: 80,
  paddingBottom: 80,
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

const startIndex = sleepTimes.findIndex((t) => t === "20:00");

const reorderedSleepTimes = [
  ...sleepTimes.slice(startIndex),
  ...sleepTimes.slice(0, startIndex),
];

const pickerStyle: CSSProperties = {
  height: 200,
  overflowY: "scroll",
  position: "relative",
  border: "1px solid #eee",
  borderRadius: 12,
};

const inputStyle: CSSProperties = {
  padding: 12,
  borderRadius: 8,
  border: "1px solid var(--border)",
  background: "var(--card)",
  color: "var(--text)",
  fontSize: 16,
};

const style: CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 50,
  transform: "translateY(-50%)",
  borderTop: "1px solid #ccc",
  borderBottom: "1px solid #ccc",
  pointerEvents: "none",
};


export default function SleepTimePicker({ value, onChange }: Props) {

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const scrollTop = e.currentTarget.scrollTop;
        const index = Math.round(scrollTop / 40);
        const selected = reorderedSleepTimes[index];

        if (selected) onChange(selected);
    };

  return (
    <div
    style={wrapperStyle}
    onScroll={handleScroll}
    >
      
      {/* 👇 ② これが中央ライン（必ず上） */}
      <div style={centerLineStyle} />

      {/* 👇 ③ 時間リスト */}
      <div style={listStyle}>
        {reorderedSleepTimes.map((time) => (
          <div
            key={time}
            style={{
              ...itemStyle,
              opacity: value === time ? 1 : 0.4,
              fontWeight: value === time ? "bold" : "normal",
            }}
            onClick={() => onChange(time)} // ←これ重要（選択できない原因防止）
          >
            {time}
          </div>
        ))}
      </div>
    </div>
  );
}
