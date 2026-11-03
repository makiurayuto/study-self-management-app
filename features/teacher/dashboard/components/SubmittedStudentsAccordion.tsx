"use client";

import { useState } from "react";
import Row from "@/components/shared/Row";
import { formatHours } from "@/lib/time";
import type { StudentDailyLog } from "@/types/student-log";

type Props = {
  logs: StudentDailyLog[];
  studentMap: Record<string, string>;
};

export default function SubmittedStudentsAccordion({
  logs,
  studentMap,
}: Props) {
  const [openUid, setOpenUid] = useState<string | null>(null);

  const toggle = (uid: string) => {
    setOpenUid((prev) =>
      prev === uid ? null : uid
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {logs.map((log) => {
        const isOpen = openUid === log.uid;

        return (
          <div
            key={log.uid + log.date}
            style={cardStyle}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              className="list-item"
              style={headerStyle}
              onClick={() => toggle(log.uid)}
            >
              <strong>
                {studentMap[log.uid] || "不明"}
              </strong>

              <span style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 13, opacity: 0.8 }}>
                📚 {formatHours(log.studyTime) || "-"}
                <span style={{ fontSize: 16 }}>{log.satisfaction}</span>
                <span>{isOpen ? "▲" : "▼"}</span>
              </span>
            </button>

            {isOpen && (
              <div style={contentStyle}>
                <Row label="勉強時間" value={formatHours(log.studyTime) || "-"} />
                <Row label="スマホ時間" value={formatHours(log.phoneTime) || "-"} />
                <Row label="就寝時間" value={log.sleepTime || "-"} />
                <Row label="満足度" value={log.satisfaction || "-"} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  padding: 14,
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  padding: 0,
  border: "none",
  background: "transparent",
  color: "var(--text)",
  fontSize: 15,
  cursor: "pointer",
  textAlign: "left",
};

const contentStyle: React.CSSProperties = {
  marginTop: 10,
  display: "flex",
  flexDirection: "column",
  gap: 8,
};
