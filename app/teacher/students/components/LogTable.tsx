"use client";
import { formatDateForDisplay } from "@/app/lib/date";

type Log = {
  uid: string;
  date: string;
  studyTime: number | null;
  phoneTime: number | null;
  sleepTime: string;
  satisfaction: string;
};

type Props = {
  filteredLogs: Log[];
};

export default function LogTable({
  filteredLogs,
}: Props) {
  return (
    <div style={{ overflowX: "auto", marginTop: 20 }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>日付</th>
            <th style={thStyle}>勉強</th>
            <th style={thStyle}>スマホ</th>
            <th style={thStyle}>睡眠</th>
            <th style={thStyle}>満足度</th>
          </tr>
        </thead>

        <tbody>
          {filteredLogs.map((log, i) => (
            <tr key={i}>
              <td style={tdStyle}>{formatDateForDisplay(log.date)}</td>

              <td style={tdStyle}>
                {log.studyTime ? (log.studyTime / 60).toFixed(1) + "h" : ""}
              </td>

              <td style={tdStyle}>
                {log.phoneTime ? (log.phoneTime / 60).toFixed(1) + "h" : ""}
              </td>

              <td style={tdStyle}>{log.sleepTime}</td>
              <td style={tdStyle}>{log.satisfaction}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  border: "1px solid #ccc",
  padding: 10,
  background: "#f3f4f6",
  textAlign: "left" as const,
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: 10,
};