import type { CSSProperties } from "react";

export const colors = {
  primary: "#4f46e5",
  primarySoft: "rgba(79,70,229,0.12)",
  success: "#16a34a",
  danger: "#ef4444",
  muted: "#9ca3af",
};

// 入力フォームなどのカード
export const cardStyle: CSSProperties = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 16,
  padding: 16,
  display: "flex",
  flexDirection: "column",
  gap: 10,
  boxSizing: "border-box",
};

export const textInputStyle: CSSProperties = {
  width: "100%",
  padding: 12,
  borderRadius: 10,
  border: "1px solid var(--border)",
  background: "var(--bg)",
  color: "var(--text)",
  fontSize: 16,
  boxSizing: "border-box",
};
