"use client";

import { useState } from "react";
import Button from "@/components/shared/Button";
import Modal from "@/components/shared/Modal";
import { colors, textInputStyle } from "@/components/shared/styles";
import { addDays, getToday, getWeekDates } from "@/lib/date";

type Props = {
  open: boolean;
  onClose: () => void;
  onExport: (fromDate: string, toDate: string) => string | null;
};

export default function CsvExportModal({ open, onClose, onExport }: Props) {
  return (
    <Modal open={open} onClose={onClose} title="CSV出力">
      {open && <CsvExportForm onClose={onClose} onExport={onExport} />}
    </Modal>
  );
}

function CsvExportForm({ onClose, onExport }: Omit<Props, "open">) {
  const today = getToday();

  const [fromDate, setFromDate] = useState(() => getWeekDates(0)[0].date);
  const [toDate, setToDate] = useState(today);
  const [error, setError] = useState("");

  const presets = [
    { label: "今週", from: getWeekDates(0)[0].date, to: today },
    { label: "先週", from: getWeekDates(-1)[0].date, to: getWeekDates(-1)[6].date },
    { label: "過去30日", from: addDays(today, -29), to: today },
  ];

  const handleExport = () => {
    const message = onExport(fromDate, toDate);

    if (message) {
      setError(message);
      return;
    }

    onClose();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {presets.map((p) => (
          <Button
            key={p.label}
            variant={fromDate === p.from && toDate === p.to ? "primary" : "secondary"}
            size="sm"
            onClick={() => {
              setFromDate(p.from);
              setToDate(p.to);
              setError("");
            }}
          >
            {p.label}
          </Button>
        ))}
      </div>

      <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
        開始日
        <input
          type="date"
          value={fromDate}
          max={toDate}
          onChange={(e) => {
            setFromDate(e.target.value);
            setError("");
          }}
          style={textInputStyle}
        />
      </label>

      <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
        終了日
        <input
          type="date"
          value={toDate}
          min={fromDate}
          max={today}
          onChange={(e) => {
            setToDate(e.target.value);
            setError("");
          }}
          style={textInputStyle}
        />
      </label>

      {error && <div style={{ color: colors.danger, fontSize: 14 }}>{error}</div>}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Button variant="secondary" colorVariant="gray" onClick={onClose}>
          キャンセル
        </Button>
        <Button colorVariant="success" onClick={handleExport}>
          ⬇ 出力
        </Button>
      </div>
    </div>
  );
}
