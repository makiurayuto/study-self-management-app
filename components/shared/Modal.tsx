"use client";

import { useEffect } from "react";
import type { CSSProperties } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  // center: 中央ダイアログ / sheet: 画面下から出るシート
  variant?: "center" | "sheet";
  children: React.ReactNode;
};

export default function Modal({
  open,
  onClose,
  title,
  variant = "center",
  children,
}: Props) {
  // Esc で閉じる
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const isSheet = variant === "sheet";

  return (
    <div
      style={{
        ...overlayStyle,
        alignItems: isSheet ? "flex-end" : "center",
      }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        style={isSheet ? sheetStyle : centerStyle}
      >
        {title && (
          <div style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
            {title}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

const overlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  justifyContent: "center",
  zIndex: 1000,
};

const panelStyle: CSSProperties = {
  background: "var(--card)",
  color: "var(--text)",
  padding: 20,
  boxSizing: "border-box",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
};

const centerStyle: CSSProperties = {
  ...panelStyle,
  width: "90%",
  maxWidth: 360,
  borderRadius: 16,
  animation: "pop 0.15s ease",
};

const sheetStyle: CSSProperties = {
  ...panelStyle,
  width: "100%",
  maxWidth: 500,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  paddingBottom: "calc(20px + env(safe-area-inset-bottom))",
  animation: "slide-up 0.2s ease",
};
