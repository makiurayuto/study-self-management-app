"use client";
import { formatHours } from "@/lib/time";
import type { StudentDailyLog } from "@/types/student-log";

type Props = {
  visibleLogs: StudentDailyLog[];
  studentMap: Record<string, string>;
};

export default function SubmittedStudentsTable({
  visibleLogs,
  studentMap,
}: Props) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={thStyle}>名前</th>
            <th style={thStyle}>勉強時間</th>
            <th style={thStyle}>スマホ時間</th>
            <th style={thStyle}>就寝時間</th>
            <th style={thStyle}>満足度</th>
          </tr>
        </thead>

        <tbody>
          {visibleLogs.map((log) => (
            <tr key={log.uid + log.date}>
              <td style={{ ...tdStyle, fontWeight: 600 }}>
                {studentMap[log.uid] || "不明"}
              </td>
              <td style={tdStyle}>{formatHours(log.studyTime)}</td>
              <td style={tdStyle}>{formatHours(log.phoneTime)}</td>
              <td style={tdStyle}>{log.sleepTime}</td>
              <td style={{ ...tdStyle, fontSize: 18 }}>{log.satisfaction}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  borderBottom: "2px solid var(--border)",
  padding: "10px 12px",
  textAlign: "left",
  fontSize: 13,
  opacity: 0.7,
};

const tdStyle: React.CSSProperties = {
  borderBottom: "1px solid var(--border)",
  padding: "12px",
};
