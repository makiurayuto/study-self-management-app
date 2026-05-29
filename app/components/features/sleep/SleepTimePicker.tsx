"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onClose: () => void; // ← 追加
};

const ITEM_HEIGHT = 40;

export default function SleepTimePicker({
  value,
  onChange,
  onClose,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const [tempValue, setTempValue] = useState(value || "22:00");

  const base = useMemo(() => {
    return Array.from({ length: 96 }).map((_, i) => {
      const h = String(Math.floor(i / 4)).padStart(2, "0");
      const m = String((i % 4) * 15).padStart(2, "0");
      return `${h}:${m}`;
    });
  }, []);

  const list = useMemo(() => [...base, ...base, ...base], [base]);

  // 初期位置
  useEffect(() => {
    if (!ref.current) return;

    const index = base.findIndex(t => t === (value || "22:00"));
    const startIndex = index === -1 ? 0 : index;

    requestAnimationFrame(() => {
      if (!ref.current) return;

      ref.current.scrollTop =
        (base.length + startIndex) * ITEM_HEIGHT;
    });
  }, [base, value]);

  // スクロール（選ばない！移動だけ）
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = () => {
    if (!ref.current) return;

    const el = ref.current;

    // スクロール中は何もしない
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const rawIndex = el.scrollTop / ITEM_HEIGHT;
      const index = Math.round(rawIndex);

      const baseLen = base.length;

      const normalizedIndex =
        ((index % baseLen) + baseLen) % baseLen;

      const centerIndex = baseLen + normalizedIndex;

      // ここでだけ補正する
      el.scrollTop = centerIndex * ITEM_HEIGHT;

      // 仮選択更新
      setTempValue(base[normalizedIndex]);
    }, 80);
};

  // タップで確定
  const handleSelect = (t: string) => {
    setTempValue(t);   // 表示用
    onChange(t);       // 確定
    onClose();         // 閉じる
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
      <div
        ref={ref}
        onScroll={handleScroll}
        style={{
          height: "100%",
          overflowY: "scroll",
          paddingTop: ITEM_HEIGHT * 2,
          paddingBottom: ITEM_HEIGHT * 2,
        }}
      >
        {list.map((t, i) => {
          const isActive = t === tempValue;

          return (
            <div
              key={i}
              onClick={() => handleSelect(t)}
              style={{
                height: ITEM_HEIGHT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: isActive ? "bold" : "normal",
                color: isActive ? "#4f46e5" : "var(--text)",
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
          pointerEvents: "none",
        }}
      />
    </div>
  );
}