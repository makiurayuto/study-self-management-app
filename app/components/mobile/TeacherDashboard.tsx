"use client";

import { useState } from "react";

type Log = {
  uid: string;
  date: string;
  studyTime: number | null;
  phoneTime: number | null;
  sleepTime: string;
  satisfaction: string;
};

type Student = {
  uid: string;
  name: string;
};

type Props = {
  logs: Log[];
  missingStudents: Student[];
  studentMap: Record<string, string>;
};

type Item =
  | {
      type: "log";
      uid: string;
      data: Log;
    }
  | {
      type: "missing";
      uid: string;
      name: string;
    };

export default function MobileTeacherDashboard({
  logs,
  missingStudents,
  studentMap,
}: Props) {
  const [openUid, setOpenUid] = useState<string | null>(null);

  const toggle = (uid: string) => {
    setOpenUid((prev) => (prev === uid ? null : uid));
  };

  // =========================
  // 統合リスト作成
  // =========================

  const items: Item[] = [
    ...logs.map((log) => ({
      type: "log" as const,
      uid: log.uid,
      data: log,
    })),
    ...missingStudents.map((s) => ({
      type: "missing" as const,
      uid: s.uid,
      name: s.name,
    })),
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {items.map((item) => {
        const isOpen = openUid === item.uid;

        // =========================
        // 未提出者UI
        // =========================

        if (item.type === "missing") {
          return (
            <div key={item.uid} style={missingCard}>
              <div
                style={headerStyleMissing}
                onClick={() => toggle(item.uid)}
              >
                <strong>❌ {item.name}</strong>
                <span>{isOpen ? "▲" : "▼"}</span>
              </div>

              {isOpen && (
                <div style={contentStyle}>
                  <div style={{ color: "#ef4444" }}>
                    未提出です
                  </div>
                </div>
              )}
            </div>
          );
        }

        // =========================
        // 提出済みUI
        // =========================

        const log = item.data;

        return (
          <div key={log.uid + log.date} style={cardStyle}>
            <div
              style={headerStyle}
              onClick={() => toggle(log.uid)}
            >
              <strong>
                ✅ {studentMap[log.uid] || "不明"}
              </strong>

              <span>{isOpen ? "▲" : "▼"}</span>
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
    </div>
  );
}

// =========================
// Row
// =========================

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div style={rowStyle}>
      <span style={{ color: "#666" }}>{label}</span>
      <span>{value}</span>
    </div>
  );
}

// =========================
// styles
// =========================

const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #ddd",
  borderRadius: 12,
  padding: 14,
};

const missingCard: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #fecaca",
  borderRadius: 12,
  padding: 14,
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  cursor: "pointer",
};

const headerStyleMissing: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  cursor: "pointer",
  color: "#ef4444",
};

const contentStyle: React.CSSProperties = {
  marginTop: 10,
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: 14,
};