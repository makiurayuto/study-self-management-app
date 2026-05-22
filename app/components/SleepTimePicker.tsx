"use client";

import { useRef } from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

const times = Array.from({ length: 96 }).map((_, i) => {
  const h = String(Math.floor(i / 4)).padStart(2, "0");
  const m = String((i % 4) * 15).padStart(2, "0");
  return `${h}:${m}`;
});

export default function SleepTimePicker({ value, onChange }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      style={{
        height: 200,
        overflowY: "scroll",
        border: "1px solid #ddd",
        borderRadius: 12,
        textAlign: "center",
      }}
      onScroll={(e) => {
        const el = e.currentTarget;
        const index = Math.round(el.scrollTop / 40);
        onChange(times[index] ?? value);
      }}
    >
      {times.map((t) => (
        <div
          key={t}
          style={{
            height: 40,
            lineHeight: "40px",
            fontSize: 18,
          }}
        >
          {t}
        </div>
      ))}
    </div>
  );
}