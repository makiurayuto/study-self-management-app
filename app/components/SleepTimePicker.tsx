"use client";

import { useRef } from "react";
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

const list = [
  ...sleepTimes.slice(startIndex),
  ...sleepTimes.slice(0, startIndex),
];

export default function SleepTimePicker({ value, onChange }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div style={wrapper}>
      {/* 上フェード */}
      <div style={fadeTop} />

      {/* 下フェード */}
      <div style={fadeBottom} />

      {/* スクロールエリア */}
      <div ref={ref} style={scrollArea}>
        <div style={{ paddingTop: 88, paddingBottom: 88 }}>
          {list.map((t) => {
            const active = value === t;

            return (
              <div
                key={t}
                onClick={() => onChange(t)}
                style={{
                  ...item,
                  transform: active ? "scale(1.1)" : "scale(0.95)",
                  opacity: active ? 1 : 0.35,
                  fontWeight: active ? 600 : 400,
                }}
              >
                {t}
              </div>
            );
          })}
        </div>
      </div>

      {/* 中央ライン */}
      <div style={centerLine} />
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
  pointerEvents: "none",
};

const fadeTop: CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 60,
  background: "linear-gradient(to bottom, var(--card), transparent)",
  pointerEvents: "none",
};

const fadeBottom: CSSProperties = {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  height: 60,
  background: "linear-gradient(to top, var(--card), transparent)",
  pointerEvents: "none",
};