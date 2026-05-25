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

const base = sleepTimes; // 00:00〜23:45
const infinite = [...base, ...base, ...base];

// 22:00開始
const startIndex = sleepTimes.findIndex((t) => t === "22:00");

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

let isAdjusting = false;

const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
  if (isAdjusting) return;

  const el = e.currentTarget;
  const itemHeight = 40;

  const index = Math.round(el.scrollTop / itemHeight);

  if (index < base.length) {
    isAdjusting = true;

    requestAnimationFrame(() => {
      el.scrollTop = index + base.length * itemHeight;
      isAdjusting = false;
    });
  }

  if (index > base.length * 2) {
    isAdjusting = true;

    requestAnimationFrame(() => {
      el.scrollTop = index - base.length * itemHeight;
      isAdjusting = false;
    });
  }
};

export default function SleepTimePicker({
  value,
  onChange,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const itemHeight = 40;
    containerRef.current.scrollTop = base.length * itemHeight;

    containerRef.current.scrollTop =
    (base.length + startIndex) * itemHeight;
  }, []);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{
        height: 240,
        overflowY: "scroll",
      }}
    >
      {infinite.map((t, i) => (
        <div
          key={i}
          onClick={() => onChange(t)}
          style={{
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {t}
        </div>
      ))}
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