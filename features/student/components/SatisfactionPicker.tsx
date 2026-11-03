"use client";

import { cardStyle, colors } from "@/components/shared/styles";

type Props = {
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
};

const OPTIONS = [
  { value: "◎", label: "とても良い" },
  { value: "○", label: "良い" },
  { value: "△", label: "いまいち" },
  { value: "×", label: "悪い" },
];

export default function SatisfactionPicker({ value, onChange, invalid = false }: Props) {
  return (
    <div
      style={{
        ...cardStyle,
        border: `1px solid ${invalid ? colors.danger : "var(--border)"}`,
      }}
    >
      <div style={{ fontWeight: "bold" }}>😊 満足度</div>

      <div
        role="radiogroup"
        aria-label="満足度"
        style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}
      >
        {OPTIONS.map((o) => {
          const selected = value === o.value;

          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(o.value)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                padding: "10px 0",
                borderRadius: 12,
                border: selected
                  ? `2px solid ${colors.primary}`
                  : "1px solid var(--border)",
                background: selected ? colors.primarySoft : "var(--card)",
                color: "var(--text)",
                cursor: "pointer",
                transform: selected ? "scale(1.05)" : "scale(1)",
                boxShadow: selected ? "0 4px 12px rgba(79,70,229,0.25)" : "none",
              }}
            >
              <span style={{ fontSize: 24, fontWeight: 600 }}>{o.value}</span>
              <span style={{ fontSize: 11, color: selected ? colors.primary : colors.muted }}>
                {o.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
