"use client";

import Button from "@/components/shared/Button";

type Props = {
  name: string;
  onEditName: () => void;
  onLogout: () => void;
};

export default function StudentHeader({ name, onEditName, onLogout }: Props) {
  return (
    <header style={{ padding: "24px 4px 8px" }}>
      <h1
        style={{
          textAlign: "center",
          fontSize: 22,
          fontWeight: "bold",
          margin: "0 0 16px",
        }}
      >
        勉強時間自己管理アプリ
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
        }}
      >
        <p style={{ margin: 0, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          👤 {name}
        </p>

        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <Button variant="secondary" colorVariant="gray" size="sm" onClick={onEditName}>
            名前変更
          </Button>
          <Button variant="secondary" colorVariant="gray" size="sm" onClick={onLogout}>
            ログアウト
          </Button>
        </div>
      </div>
    </header>
  );
}
