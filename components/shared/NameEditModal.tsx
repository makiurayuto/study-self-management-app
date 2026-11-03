"use client";

import { useState } from "react";
import Button from "@/components/shared/Button";
import Modal from "@/components/shared/Modal";
import { colors, textInputStyle } from "@/components/shared/styles";

type Props = {
  open: boolean;
  currentName: string;
  onClose: () => void;
  onSave: (name: string) => Promise<void>;
};

export default function NameEditModal({ open, currentName, onClose, onSave }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="名前変更">
      {/* 開くたびに入力を初期化するため key を付けて作り直す */}
      {open && (
        <NameEditForm
          key={currentName}
          currentName={currentName}
          onClose={onClose}
          onSave={onSave}
        />
      )}
    </Modal>
  );
}

function NameEditForm({
  currentName,
  onClose,
  onSave,
}: Omit<Props, "open">) {
  const [name, setName] = useState(currentName);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const trimmed = name.trim();
  const canSave = !!trimmed && trimmed !== currentName && !saving;

  const handleSave = async () => {
    if (!canSave) return;

    setSaving(true);
    setError("");

    try {
      await onSave(trimmed);
      onClose();
    } catch (e) {
      console.error("名前変更失敗", e);
      setError("変更に失敗しました。もう一度お試しください");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <input
        value={name}
        autoFocus
        maxLength={50}
        onChange={(e) => setName(e.target.value)}
        placeholder="新しい名前（本名）"
        aria-label="新しい名前"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.nativeEvent.isComposing) handleSave();
        }}
        style={textInputStyle}
      />

      {error && (
        <div style={{ color: colors.danger, fontSize: 14 }}>{error}</div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Button variant="secondary" colorVariant="gray" size="md" onClick={onClose}>
          キャンセル
        </Button>

        <Button variant="primary" size="md" onClick={handleSave} disabled={!canSave}>
          {saving ? "保存中…" : "保存"}
        </Button>
      </div>
    </div>
  );
}
