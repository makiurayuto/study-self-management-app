"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  uid: string;
  status: "active" | "hidden" | "graduated";

  onDetail: (uid: string) => void;
  onRename: (uid: string) => void;
  onHide: (uid: string) => void;
  onGraduate: (uid: string) => void;
  onRestore: (uid: string) => void;

  onOpenChange?: (open: boolean) => void;
};

export default function StudentMenu({
  uid,
  status,
  onDetail,
  onRename,
  onHide,
  onGraduate,
  onRestore,
  onOpenChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
        onOpenChange?.(false);
        }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
        document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={{ position: "relative" }} ref={menuRef}>
      {/* ⋯ボタン */}
      <button
        onClick={() => {
            const next = !open;
            setOpen(next);
            onOpenChange?.(next);
        }}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontSize: 18,
          padding: 4,
        }}
      >
        ⋯
      </button>

      {/* ドロップダウン */}
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 30,
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
            width: 140,
            zIndex: 10,
          }}
        >
            <MenuItem onClick={() => onDetail(uid)}>
            詳細
            </MenuItem>

            <MenuItem onClick={() => onRename(uid)}>
            名前変更
            </MenuItem>

            {status === "active" && (
            <>
                <MenuItem onClick={() => onHide(uid)}>
                非表示
                </MenuItem>

                <MenuItem onClick={() => onGraduate(uid)}>
                卒業
                </MenuItem>
            </>
            )}

            {status === "hidden" && (
            <>
                <MenuItem onClick={() => onRestore(uid)}>
                復帰
                </MenuItem>

                <MenuItem onClick={() => onGraduate(uid)}>
                卒業
                </MenuItem>
            </>
            )}

            {status === "graduated" && (
            <MenuItem onClick={() => onRestore(uid)}>
                復帰
            </MenuItem>
            )}
        </div>
      )}
    </div>
  );
}

function MenuItem({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <div
      onClick={() => {
        onClick();
      }}
      style={{
        padding: "10px 12px",
        cursor: "pointer",
        fontSize: 13,
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "#f3f4f6")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = "transparent")
      }
    >
      {children}
    </div>
  );
}