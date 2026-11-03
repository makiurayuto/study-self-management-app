"use client";

import { useState } from "react";
import Modal from "@/components/shared/Modal";
import { cardStyle, colors } from "@/components/shared/styles";
import SleepTimePicker from "@/features/sleep/components/SleepTimePicker";

type Props = {
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
};

export default function SleepTimeField({ value, onChange, invalid = false }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          ...cardStyle,
          border: `1px solid ${invalid ? colors.danger : "var(--border)"}`,
          color: "var(--text)",
          textAlign: "left",
          cursor: "pointer",
          width: "100%",
          fontSize: 16,
          fontWeight: "normal",
        }}
      >
        <div style={{ fontWeight: "bold" }}>🌙 就寝時間</div>
        <div
          style={{
            padding: 12,
            borderRadius: 10,
            border: "1px solid var(--border)",
            background: "var(--bg)",
            textAlign: "center",
            fontSize: 18,
            fontWeight: value ? 600 : "normal",
            color: value ? "var(--text)" : invalid ? colors.danger : colors.muted,
          }}
        >
          {value || "タップして選択"}
        </div>
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="🌙 就寝時間"
        variant="sheet"
      >
        <SleepTimePicker
          value={value}
          onConfirm={(v) => {
            onChange(v);
            setOpen(false);
          }}
          onCancel={() => setOpen(false)}
        />
      </Modal>
    </>
  );
}
