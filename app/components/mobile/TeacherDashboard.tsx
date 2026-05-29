"use client";

import StudentAccordion from "./StudentAccordion";

// =========================
// 型
// =========================

type Log = {
  uid: string;
  date: string;
  studyTime: number | null;
  phoneTime: number | null;
  sleepTime: string;
  satisfaction: string;
};

type Props = {
  logs: Log[];
  studentMap: Record<string, string>;
};

// =========================
// Component
// =========================

export default function MobileTeacherDashboard({
  logs,
  studentMap,
}: Props) {
  return (
    <div style={containerStyle}>
      {logs.length === 0 ? (
        <p style={{ color: "#666" }}>データがありません</p>
      ) : (
        logs.map((log) => (
          <StudentAccordion
            key={log.uid + log.date}
            log={log}
            name={studentMap[log.uid] || "不明"}
          />
        ))
      )}
    </div>
  );
}

// =========================
// styles
// =========================

const containerStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: 12,
};