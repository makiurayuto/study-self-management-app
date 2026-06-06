"use client";

import type { CSSProperties } from "react";
const colors = {
    default: {
      primary: "#4f46e5",
      secondary: "#4f46e5",
    },

    danger: {
      primary: "#ef4444",
      secondary: "#ef4444",
    },

    success: {
      primary: "#16a34a",
      secondary: "#16a34a",
    },
  };
type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "glass";
  colorVariant?: "default" | "danger" | "success";
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
};

export default function Button({
  children,
  onClick,
  variant = "primary",
  colorVariant = "default",
  disabled = false,
  size = "md",
  className,
}: Props) {

  const base: CSSProperties = {
    padding: "12px 18px",
    borderRadius: 14,
    fontWeight: 600,
    fontSize: 14,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.15s ease",
    userSelect: "none",
    transform: disabled ? "none" : "translateY(0)",
    opacity: disabled ? 0.5 : 1,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const selectedColor = colors[colorVariant].primary;

  const primary: CSSProperties = {
    background: selectedColor,
    color: "white",
    boxShadow: `0 8px 20px ${selectedColor}40`,
  };

  const secondary: CSSProperties = {
  background: "transparent",
  color: selectedColor,
  border: `1px solid ${selectedColor}`,
};

  const glass: CSSProperties = {
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    color: "#111",
    border: "1px solid rgba(255,255,255,0.3)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
  };

  const sizeStyle = {
    sm: {
      padding: "6px 10px",
      fontSize: 12,
      borderRadius: 10,
    },
    md: {
      padding: "12px 18px",
      fontSize: 14,
      borderRadius: 14,
    },
    lg: {
      padding: "14px 22px",
      fontSize: 16,
      borderRadius: 16,
    },
  }[size ?? "md"];
  

  const getStyle = () => {
    if (variant === "primary") return primary;
    if (variant === "secondary") return secondary;
    return glass;
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={["btn", className].filter(Boolean).join(" ")}
      style={{
        ...base,
        ...sizeStyle,
        ...getStyle(),
      }}
    >
      {children}
    </button>
  );
}