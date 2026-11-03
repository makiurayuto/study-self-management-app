"use client";

import { useState } from "react";
import Button from "@/components/shared/Button";
import Modal from "@/components/shared/Modal";
import { colors } from "@/components/shared/styles";

export type ConfirmOptions = {
  title: string;
  message: React.ReactNode;
  note?: React.ReactNode;
  confirmLabel: string;
  danger?: boolean;
  onConfirm: () => Promise<void> | void;
};

type Props = {
  options: ConfirmOptions | null;
  onClose: () => void;
};

// window.confirm の代わりの確認ダイアログ
export default function ConfirmDialog({ options, onClose }: Props) {
  const [busy, setBusy] = useState(false);

  const handleConfirm = async () => {
    if (!options) return;

    setBusy(true);
    try {
      await options.onConfirm();
    } finally {
      setBusy(false);
      onClose();
    }
  };

  return (
    <Modal
      open={options !== null}
      onClose={() => !busy && onClose()}
      title={options?.title}
    >
      {options && (
        <>
          <div style={{ marginBottom: 8 }}>{options.message}</div>

          {options.note && (
            <div style={{ fontSize: 13, color: colors.muted }}>{options.note}</div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
            <Button variant="secondary" colorVariant="gray" onClick={onClose} disabled={busy}>
              キャンセル
            </Button>
            <Button
              variant="primary"
              colorVariant={options.danger ? "danger" : "default"}
              onClick={handleConfirm}
              disabled={busy}
            >
              {busy ? "処理中…" : options.confirmLabel}
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}
