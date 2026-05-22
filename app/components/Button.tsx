"use client";

import type { CSSProperties } from "react";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "glass";
  color?: string;
  disabled?: boolean;
  className?: string;
};

export default function Button({
  children,
  onClick,
  variant = "primary",
  color = "#4f46e5",
  disabled = false,
}: Props) {
  const base: CSSProperties = {
    padding: "12px 18px",
    borderRadius: 14,
    fontWeight: 600,
    fontSize: 14,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.15s ease",
    userSelect: "none",
    transform: "translateY(0)",
    opacity: disabled ? 0.5 : 1,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const primary: CSSProperties = {
    background: color,
    color: "white",
    boxShadow: "0 6px 16px rgba(79,70,229,0.25)",
  };

  const secondary: CSSProperties = {
    background: "transparent",
    color: color,
    border: `1px solid ${color}`,
  };

  const glass: CSSProperties = {
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    color: "#111",
    border: "1px solid rgba(255,255,255,0.3)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  };

  const getStyle = () => {
    if (variant === "primary") return primary;
    if (variant === "secondary") return secondary;
    return glass;
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...base,
        ...getStyle(),
        transform: "scale(1)",
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "scale(0.96)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {children}
    </button>
  );
}