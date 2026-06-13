"use client";
import type { StudentDailyLog } from "@/types/student-log";

type Props = {
  visibleLogs: StudentDailyLog[];
  studentMap: Record<string, string>;
  loading: boolean;
};

export default function SubmittedStudentsTable({
  visibleLogs,
  studentMap,
  loading,
}: Props) {
  return (
    <div
      style={{
        opacity: loading ? 0.4 : 1,
        pointerEvents: loading ? "none" : "auto",
        transition: "0.2s",
      }}
    >
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
              <td style={tdStyle}>
                {studentMap[log.uid] || "不明"}
              </td>

              <td style={tdStyle}>
                {log.studyTime
                  ? `${(log.studyTime / 60).toFixed(1)}h`
                  : ""}
              </td>

              <td style={tdStyle}>
                {log.phoneTime
                  ? `${(log.phoneTime / 60).toFixed(1)}h`
                  : ""}
              </td>

              <td style={tdStyle}>
                {log.sleepTime || ""}
              </td>

              <td style={tdStyle}>
                {log.satisfaction || ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  border: "1px solid #ccc",
  padding: 12,
  background: "#f3f4f6",
  textAlign: "left" as const,
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: 12,
};