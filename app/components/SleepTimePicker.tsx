"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

const ITEM_HEIGHT = 40;

export default function SleepTimePicker({
  value,
  onChange,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // 仮選択（スクロール中表示用）
  const [tempValue, setTempValue] = useState(
    value || "22:00"
  );

  // 00:00〜23:45（15分刻み）
  const base = useMemo(() => {
    return Array.from({ length: 96 }).map((_, i) => {
      const h = String(Math.floor(i / 4)).padStart(2, "0");
      const m = String((i % 4) * 15).padStart(2, "0");
      return `${h}:${m}`;
    });
  }, []);

  // 無限ループ用
  const list = useMemo(() => {
    return [...base, ...base, ...base];
  }, [base]);

  // 初期位置
  useEffect(() => {
    if (!ref.current) return;

    const index = base.findIndex(
      (t) => t === (value || "22:00")
    );

    const startIndex = index === -1 ? 0 : index;

    requestAnimationFrame(() => {
      if (!ref.current) return;

      ref.current.scrollTop =
        (base.length + startIndex) * ITEM_HEIGHT;
    });
  }, [base, value]);

  // スクロール時
  const handleScroll = () => {
    if (!ref.current) return;

    const el = ref.current;

    // 現在位置
    const rawIndex = el.scrollTop / ITEM_HEIGHT;
    const index = Math.round(rawIndex);

    const baseLen = base.length;

    // 0〜95に変換
    const normalizedIndex =
      ((index % baseLen) + baseLen) % baseLen;

    // 真ん中ゾーン
    const centerIndex = baseLen + normalizedIndex;

    // 端に行きすぎたら中央へ戻す
    const shouldFix =
      index < baseLen || index >= baseLen * 2;

    if (shouldFix) {
      requestAnimationFrame(() => {
        if (!ref.current) return;

        ref.current.scrollTop =
          centerIndex * ITEM_HEIGHT;
      });
    }

    // 仮表示だけ更新
    const selected = base[normalizedIndex];

    if (selected) {
      setTempValue(selected);
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
          const isActive = t === tempValue;

          return (
            <div
              key={i}
              onClick={() => {
                setTempValue(t);
                onChange(t);
              }}
              style={{
                height: ITEM_HEIGHT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                fontWeight: isActive
                  ? "bold"
                  : "normal",
                color: isActive
                  ? "#4f46e5"
                  : "var(--text)",
                transition: "0.15s",
                cursor: "pointer",
              }}
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