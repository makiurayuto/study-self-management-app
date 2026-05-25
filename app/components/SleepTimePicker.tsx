"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

const ITEM_HEIGHT = 40;

export default function SleepTimePicker({ value, onChange }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 00:00〜23:45（15分刻み）
  const base = useMemo(() => {
    return Array.from({ length: 96 }).map((_, i) => {
      const h = String(Math.floor(i / 4)).padStart(2, "0");
      const m = String((i % 4) * 15).padStart(2, "0");
      return `${h}:${m}`;
    });
  }, []);

  // 3倍にする（無限ループ用）
  const list = useMemo(() => {
    return [...base, ...base, ...base];
  }, [base]);

  // 中央スタート位置
  useEffect(() => {
    if (!ref.current) return;

    const index = base.findIndex((t) => t === (value || "20:00"));
    const startIndex = index === -1 ? 0 : index;

    requestAnimationFrame(() => {
      ref.current!.scrollTop =
        (base.length + startIndex) * ITEM_HEIGHT;
    });
  }, [value]);

  // スクロール停止検知
  const handleScroll = () => {
    if (!ref.current) return;

    const el = ref.current;

    // 現在のインデックス
    const rawIndex = el.scrollTop / ITEM_HEIGHT;
    const index = Math.round(rawIndex);

    const baseLen = base.length;

    // 0〜baseLen-1 に正規化
    const normalizedIndex =
      ((index % baseLen) + baseLen) % baseLen;

    // 中央ゾーン
    const centerIndex = baseLen + normalizedIndex;

    // スクロール補正（やりすぎ防止）
    const shouldFix =
      index < baseLen || index >= baseLen * 2;

    if (shouldFix) {
      requestAnimationFrame(() => {
        if (!ref.current) return;
        ref.current.scrollTop = centerIndex * ITEM_HEIGHT;
      });
    }

    // 選択値（安定版）
    const selected = base[normalizedIndex];

    // 連続発火防止（同じ値なら更新しない）
    if (selected && selected !== value) {
      onChange(selected);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        height: 240,
        overflow: "hidden",
        borderRadius: 16,
        background: "var(--card)",
      }}
    >
      {/* スクロール領域 */}
      <div
        ref={ref}
        onScroll={handleScroll}
        style={{
          height: "100%",
          overflowY: "scroll",
          scrollBehavior: "auto",
          WebkitOverflowScrolling: "touch",
          paddingTop: ITEM_HEIGHT * 2,
          paddingBottom: ITEM_HEIGHT * 2,
        }}
      >
        {list.map((t, i) => {
          const isActive = t === value;

          return (
            <div
              key={i}
              style={{
                height: ITEM_HEIGHT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                fontWeight: isActive ? "bold" : "normal",
                color: isActive ? "#4f46e5" : "var(--text)",
                transition: "0.15s",
              }}
              onClick={() => onChange(t)}
            >
              {t}
            </div>
          );
        })}
      </div>

      {/* 中央ライン */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: ITEM_HEIGHT,
          transform: "translateY(-50%)",
          borderTop: "1px solid #ddd",
          borderBottom: "1px solid #ddd",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}