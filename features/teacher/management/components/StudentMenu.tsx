"use client";

import { useEffect, useRef } from "react";
import { colors } from "@/components/shared/styles";

type Props = {
  uid: string;
  status: string;

  openedMenuId: string | null;

  onOpenChange: (uid: string | null) => void;

  onRename: () => void;
  onHide: () => void;
  onGraduate: () => void;
  onRestore: () => void;

  onDelete: () => void;
};

export default function StudentMenu({
  uid,
  status,
  openedMenuId,
  onOpenChange,
  onRename,
  onHide,
  onGraduate,
  onRestore,

  onDelete,
}: Props) {

  const isOpen = openedMenuId === uid;
  const ref = useRef<HTMLDivElement>(null);

  // メニュー外クリック / Esc で閉じる
  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) onOpenChange(null);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(null);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onOpenChange]);

  // 項目を選んだらメニューを閉じてから実行
  const select = (action: () => void) => () => {
    onOpenChange(null);
    action();
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>

      {/* 3点ボタン */}
      <button
        type="button"
        aria-label="操作メニュー"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={(e) => {
          e.stopPropagation();
          onOpenChange(isOpen ? null : uid);
        }}
        style={{
          background: "transparent",
          border: "none",
          color: "var(--text)",
          cursor: "pointer",
          fontSize: 20,
          padding: "4px 10px",
          borderRadius: 8,
        }}
      >
        ⋯
      </button>

      {/* メニュー */}
      {isOpen && (
        <div
          role="menu"
          style={{
            position: "absolute",
            right: 0,
            top: 36,
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
            width: 150,
            zIndex: 10,
            overflow: "hidden",
            animation: "fade-in 0.1s ease",
          }}
        >
          <MenuItem onClick={select(onRename)}>
            ✏️ 名前変更
          </MenuItem>

          {status === "active" && (
            <>
              <MenuItem onClick={select(onHide)}>
                🙈 非表示
              </MenuItem>
              <MenuItem onClick={select(onGraduate)} danger>
                🎓 退塾
              </MenuItem>
            </>
          )}

          {status === "hidden" && (
            <>
              <MenuItem onClick={select(onRestore)}>
                ↩️ 復帰
              </MenuItem>
              <MenuItem onClick={select(onGraduate)} danger>
                🎓 退塾
              </MenuItem>
            </>
          )}

          {status === "graduated" && (
            <>
              <MenuItem onClick={select(onRestore)}>
                ↩️ 復帰
              </MenuItem>

              <MenuItem onClick={select(onDelete)} danger>
                🗑 完全削除
              </MenuItem>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function MenuItem({
  children,
  onClick,
  danger = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="menu-item"
      style={{
        display: "block",
        width: "100%",
        padding: "10px 14px",
        border: "none",
        borderRadius: 0,
        background: "transparent",
        color: danger ? colors.danger : "var(--text)",
        cursor: "pointer",
        fontSize: 14,
        fontWeight: 500,
        textAlign: "left",
      }}
    >
      {children}
    </button>
  );
}
