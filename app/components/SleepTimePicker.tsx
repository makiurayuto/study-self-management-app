"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

// 15分刻み
const sleepTimes = Array.from({ length: 96 }).map((_, i) => {
  const h = String(Math.floor(i / 4)).padStart(2, "0");
  const m = String((i % 4) * 15).padStart(2, "0");
  return `${h}:${m}`;
});

// 20:00開始
const startIndex = sleepTimes.findIndex((t) => t === "20:00");

const reordered = [
  ...sleepTimes.slice(startIndex),
  ...sleepTimes.slice(0, startIndex),
];

// 無限ループ風
const infiniteOptions = [
  ...reordered,
  ...reordered,
  ...reordered,
];

export default function SleepTimePicker({
  value,
  onChange,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const itemHeight = 44;

      // 真ん中から開始
      containerRef.current.scrollTop =
        reordered.length * itemHeight;
    }
  }, []);

  return (
    <div style={wrapper}>
      <div ref={containerRef} style={scrollArea}>
        {infiniteOptions.map((time, i) => (
          <div
            key={i}
            onClick={() => onChange(time)}
            style={{
              ...item,
              background:
                value === time
                  ? "rgba(79,70,229,0.15)"
                  : "transparent",

              fontWeight:
                value === time ? "bold" : "normal",
            }}
          >
            {time}
          </div>
        ))}
      </div>

      <div style={centerLine} />
      <div style={fadeTop} />
      <div style={fadeBottom} />
    </div>
  );
}

const wrapper: CSSProperties = {
  position: "relative",
  height: 220,
  borderRadius: 16,
  overflow: "hidden",
  background: "var(--card)",
};

const scrollArea: CSSProperties = {
  height: "100%",
  overflowY: "scroll",
  overflowX: "hidden",
  scrollSnapType: "y mandatory",
  WebkitOverflowScrolling: "touch",
};

const item: CSSProperties = {
  height: 44,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  scrollSnapAlign: "center",
  transition: "0.15s",
  fontSize: 18,
  cursor: "pointer",
};

const centerLine: CSSProperties = {
  position: "absolute",
  top: "50%",
  left: 0,
  right: 0,
  height: 44,
  transform: "translateY(-50%)",
  borderTop: "1px solid var(--border)",
  borderBottom: "1px solid var(--border)",
  pointerEvents: "none",
};

const fadeTop: CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 60,
  background:
    "linear-gradient(to bottom, var(--card), transparent)",
  pointerEvents: "none",
};

const fadeBottom: CSSProperties = {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  height: 60,
  background:
    "linear-gradient(to top, var(--card), transparent)",
  pointerEvents: "none",
};