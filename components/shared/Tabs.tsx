"use client";

type Props<T extends string> = {
  tabs: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
};

// セグメント型のタブ
export default function Tabs<T extends string>({ tabs, value, onChange }: Props<T>) {
  return (
    <div
      role="tablist"
      style={{
        display: "flex",
        gap: 6,
        padding: 6,
        background: "var(--border)",
        borderRadius: 12,
      }}
    >
      {tabs.map((tab) => {
        const selected = tab.value === value;

        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.value)}
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: 10,
              border: "none",
              fontSize: 14,
              fontWeight: selected ? 700 : 500,
              background: selected ? "var(--card)" : "transparent",
              color: "var(--text)",
              opacity: selected ? 1 : 0.6,
              boxShadow: selected ? "0 2px 10px rgba(0,0,0,0.08)" : "none",
              cursor: "pointer",
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
