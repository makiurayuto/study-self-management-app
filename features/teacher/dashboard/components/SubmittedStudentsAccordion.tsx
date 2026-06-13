"use client";

import { useState } from "react";
import Row from "@/app/components/shared/Row";
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
    <>
      {logs.map((log) => {
        const isOpen = openUid === log.uid;

        return (
          <div
            key={log.uid + log.date}
            style={cardStyle}
          >
            <div
              style={headerStyle}
              onClick={() => toggle(log.uid)}
            >
              <strong>
                {studentMap[log.uid] || "不明"}
              </strong>

              <span>
                {isOpen ? "▲" : "▼"}
              </span>
            </div>

            {isOpen && (
              <div style={contentStyle}>
                <Row
                  label="勉強時間"
                  value={
                    log.studyTime
                      ? `${(log.studyTime / 60).toFixed(1)}h`
                      : "-"
                  }
                />

                <Row
                  label="スマホ時間"
                  value={
                    log.phoneTime
                      ? `${(log.phoneTime / 60).toFixed(1)}h`
                      : "-"
                  }
                />

                <Row
                  label="就寝時間"
                  value={log.sleepTime || "-"}
                />

                <Row
                  label="満足度"
                  value={log.satisfaction || "-"}
                />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #ddd",
  borderRadius: 12,
  padding: 14,
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  cursor: "pointer",
};

const contentStyle: React.CSSProperties = {
  marginTop: 10,
  display: "flex",
  flexDirection: "column",
  gap: 8,
};