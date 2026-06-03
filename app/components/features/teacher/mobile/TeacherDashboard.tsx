"use client";

import { useState } from "react";
import DateNavigator from "@/app/components/shared/DateNavigator";
import SectionTitle from "@/app/components/shared/SectionTitle";
import Card from "@/app/components/shared/Card";
import Row from "@/app/components/shared/Row";

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

  currentDateLabel: string;
  onPrevDay: () => void;
  onNextDay: () => void;
  onYesterday: () => void;
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

  currentDateLabel,

  onPrevDay,
  onNextDay,
  onYesterday,
}: Props) {

  const submittedLogs = logs;
  const missing = missingStudents;
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
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>

      <Card>
        <SectionTitle>
          📅 日付ナビ
        </SectionTitle>
        <DateNavigator
          currentDateLabel={currentDateLabel}
          onPrevDay={onPrevDay}
          onNextDay={onNextDay}
          onYesterday={onYesterday}
        />
      </Card>
      {/* ================= 未提出（1回だけ） ================= */}

      <Card>
        <SectionTitle>
          🚨 未提出者
        </SectionTitle>

        {missing.length === 0 ? (
          <p style={{ color: "green" }}>
            全員提出済み 🎉
          </p>
        ) : (
          missing.map((s) => (
            <div
              key={s.uid}
              style={{ color: "#ef4444", padding: "4px 0" }}
            >
              ・ {s.name}
            </div>
          ))
        )}
      </Card>
      {/* ================= 提出済み ================= */}

      <Card>
        <SectionTitle>
          ✅ 提出済み
        </SectionTitle>

        {logs.map((log) => {
            const isOpen = openUid === log.uid;

            return (
              <div key={log.uid + log.date} style={cardStyle}>
                <div style={headerStyle} onClick={() => toggle(log.uid)}>
                  <strong>{studentMap[log.uid] || "不明"}</strong>
                  <span>{isOpen ? "▲" : "▼"}</span>
                </div>

                {isOpen && (
                  <div style={contentStyle}>
                    <Row label="勉強時間" value={log.studyTime ? `${(log.studyTime / 60).toFixed(1)}h` : "-"} />
                    <Row label="スマホ時間" value={log.phoneTime ? `${(log.phoneTime / 60).toFixed(1)}h` : "-"} />
                    <Row label="就寝時間" value={log.sleepTime || "-"} />
                    <Row label="満足度" value={log.satisfaction || "-"} />
                  </div>
                )}
              </div>
            );
          })}
      </Card>

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
