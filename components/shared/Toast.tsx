"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { colors } from "@/components/shared/styles";

export type ToastMessage = {
  type: "success" | "error";
  text: string;
};

// 画面下に一定時間だけ出す通知
export function useToast(duration = 2500) {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback(
    (message: ToastMessage) => {
      if (timer.current) clearTimeout(timer.current);

      setToast(message);
      timer.current = setTimeout(() => setToast(null), duration);
    },
    [duration]
  );

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return { toast, showToast };
}

export default function Toast({ toast }: { toast: ToastMessage | null }) {
  if (!toast) return null;

  return (
    <div
      role="status"
      style={{
        position: "fixed",
        left: "50%",
        bottom: 24,
        transform: "translateX(-50%)",
        zIndex: 2000,
        padding: "12px 18px",
        borderRadius: 12,
        background: toast.type === "success" ? colors.success : colors.danger,
        color: "white",
        fontWeight: 600,
        fontSize: 14,
        boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
        animation: "fade-in 0.15s ease",
        maxWidth: "90vw",
      }}
    >
      {toast.text}
    </div>
  );
}
