"use client";

type Props = {
  uid: string;
  status: string;

  openedMenuId: string | null;

  onOpenChange: (uid: string | null) => void;

  onDetail: (uid: string) => void;
  onRename: (uid: string) => void;
  onHide: (uid: string) => void;
  onGraduate: (uid: string) => void;
  onRestore: (uid: string) => void;

  onDelete: (uid: string) => void;
};

export default function StudentMenu({
  uid,
  status,
  openedMenuId,
  onOpenChange,
  onDetail,
  onRename,
  onHide,
  onGraduate,
  onRestore,

  onDelete,
}: Props) {

  const isOpen = openedMenuId === uid;

  return (
    <div style={{ position: "relative" }}>
      
      {/* 3点ボタン */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onOpenChange(isOpen ? null : uid);
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

      {/* メニュー */}
      {isOpen && (
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
          {/*
          生徒詳細画面(url)に飛ぶ機能
          <MenuItem onClick={() => onDetail(uid)}>
            詳細
          </MenuItem>
          */}

          <MenuItem onClick={() => onRename(uid)}>
            名前変更
          </MenuItem>

          {status === "active" && (
            <>
              <MenuItem onClick={() => onHide(uid)}>
                非表示
              </MenuItem>
              <MenuItem onClick={() => onGraduate(uid)}>
                退塾
              </MenuItem>
            </>
          )}

          {status === "hidden" && (
            <>
              <MenuItem onClick={() => onRestore(uid)}>
                復帰
              </MenuItem>
              <MenuItem onClick={() => onGraduate(uid)}>
                退塾
              </MenuItem>
            </>
          )}

          {status === "graduated" && (
            <>
              <MenuItem onClick={() => onRestore(uid)}>
                復帰
              </MenuItem>

              <MenuItem onClick={() => onDelete(uid)}>
                完全削除
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
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <div
      onClick={() => {
        console.log("Menu clicked");
        onClick();
      }}
      style={{
        padding: "10px 12px",
        cursor: "pointer",
        fontSize: 13,
      }}
    >
      {children}
    </div>
  );
}