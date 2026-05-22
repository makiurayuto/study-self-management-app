"use client";

import { useEffect, useRef } from "react";
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

  const ITEM_HEIGHT = 44;

  // スクロール停止後に中央補正
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timeout: NodeJS.Timeout;

    const handle = () => {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        const index = Math.round(el.scrollTop / ITEM_HEIGHT);
        const clamped = Math.max(0, Math.min(list.length - 1, index));

        const target = list[clamped];
        onChange(target);

        el.scrollTo({
          top: clamped * ITEM_HEIGHT,
          behavior: "smooth",
        });
      }, 80);
    };

    el.addEventListener("scroll", handle);
    return () => el.removeEventListener("scroll", handle);
  }, [onChange]);

  return (
    <div style={wrapper}>
      {/* 上フェード */}
      <div style={fadeTop} />
      {/* 下フェード */}
      <div style={fadeBottom} />

      <div ref={ref} style={scrollArea}>
        <div style={{ paddingTop: 88, paddingBottom: 88 }}>
          {list.map((t, i) => {
            const active = value === t;

            return (
              <div
                key={t}
                onClick={() => onChange(t)}
                style={{
                  ...item,
                  transform: active ? "scale(1.08)" : "scale(0.92)",
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

/* =======================
   iOSっぽい外観
======================= */

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
  scrollSnapType: "y mandatory",
  WebkitOverflowScrolling: "touch", // ←iOS慣性
};

const item: CSSProperties = {
  height: 44,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  scrollSnapAlign: "center",
  fontSize: 18,
  transition: "0.15s",
};

const centerLine: CSSProperties = {
  position: "absolute",
  top: "50%",
  left: 0,
  right: 0,
  height: 44,
  transform: "translateY(-50%)",
  borderTop: "1px solid rgba(0,0,0,0.08)",
  borderBottom: "1px solid rgba(0,0,0,0.08)",
  pointerEvents: "none",
};

const fadeTop: CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 60,
  background:
    "linear-gradient(to bottom, var(--card), rgba(255,255,255,0))",
  pointerEvents: "none",
};

const fadeBottom: CSSProperties = {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  height: 60,
  background:
    "linear-gradient(to top, var(--card), rgba(255,255,255,0))",
  pointerEvents: "none",
};