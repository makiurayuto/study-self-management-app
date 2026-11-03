"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Button from "@/components/shared/Button";

type Props = {
  value: string;
  onConfirm: (v: string) => void;
  onCancel: () => void;
};

const ITEM_HEIGHT = 40;
const VIEW_HEIGHT = 240;
// 先頭・末尾の余白（1項目目と最終項目も中央に来るように）
const PADDING = (VIEW_HEIGHT - ITEM_HEIGHT) / 2;
const DEFAULT_TIME = "22:00";

export default function SleepTimePicker({
  value,
  onConfirm,
  onCancel,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [tempValue, setTempValue] = useState(value || DEFAULT_TIME);

  // 15分刻み 00:00〜23:45
  const base = useMemo(() => {
    return Array.from({ length: 96 }).map((_, i) => {
      const h = String(Math.floor(i / 4)).padStart(2, "0");
      const m = String((i % 4) * 15).padStart(2, "0");
      return `${h}:${m}`;
    });
  }, []);

  // 無限スクロール風に3周分並べ、常に真ん中の周を表示する
  const list = useMemo(() => [...base, ...base, ...base], [base]);

  const scrollToIndex = (index: number, smooth = false) => {
    ref.current?.scrollTo({
      top: (base.length + index) * ITEM_HEIGHT,
      behavior: smooth ? "smooth" : "auto",
    });
  };

  // 初期位置
  useEffect(() => {
    const index = base.indexOf(value || DEFAULT_TIME);

    requestAnimationFrame(() => {
      scrollToIndex(index === -1 ? 0 : index);
    });
    // 開いたときだけ合わせる
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // スクロールが止まったら中央の項目を仮選択
  const handleScroll = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const el = ref.current;
      if (!el) return;

      const baseLen = base.length;
      const index = Math.round(el.scrollTop / ITEM_HEIGHT);
      const normalizedIndex = ((index % baseLen) + baseLen) % baseLen;

      // 真ん中の周へ戻す
      el.scrollTop = (baseLen + normalizedIndex) * ITEM_HEIGHT;

      setTempValue(base[normalizedIndex]);
    }, 80);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          position: "relative",
          height: VIEW_HEIGHT,
          overflow: "hidden",
          borderRadius: 16,
          background: "var(--bg)",
        }}
      >
        {/* 中央の選択帯 */}
        <div
          style={{
            position: "absolute",
            top: PADDING,
            left: 12,
            right: 12,
            height: ITEM_HEIGHT,
            borderRadius: 10,
            background: "rgba(79,70,229,0.12)",
            pointerEvents: "none",
          }}
        />

        <div
          ref={ref}
          onScroll={handleScroll}
          style={{
            position: "relative",
            height: "100%",
            overflowY: "scroll",
            scrollSnapType: "y mandatory",
            paddingTop: PADDING,
            paddingBottom: PADDING,
            boxSizing: "border-box",
          }}
        >
          {list.map((t, i) => {
            const isActive = t === tempValue;

            return (
              <div
                key={i}
                onClick={() => {
                  setTempValue(t);
                  scrollToIndex(base.indexOf(t), true);
                }}
                style={{
                  height: ITEM_HEIGHT,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  scrollSnapAlign: "center",
                  cursor: "pointer",
                  fontSize: isActive ? 20 : 16,
                  fontWeight: isActive ? "bold" : "normal",
                  color: isActive ? "#4f46e5" : "var(--text)",
                  opacity: isActive ? 1 : 0.5,
                  transition: "all 0.1s ease",
                }}
              >
                {t}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 8 }}>
        <Button variant="secondary" colorVariant="gray" onClick={onCancel}>
          キャンセル
        </Button>
        <Button variant="primary" onClick={() => onConfirm(tempValue)}>
          {tempValue} に決定
        </Button>
      </div>
    </div>
  );
}
