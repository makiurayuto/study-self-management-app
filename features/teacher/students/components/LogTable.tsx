"use client";
import { colors } from "@/components/shared/styles";
import { getToday, type WeekDate } from "@/lib/date";
import { formatHours } from "@/lib/time";
import type { StudentDailyLog } from "@/types/student-log";

type Props = {
  week: WeekDate[];
  filteredLogs: StudentDailyLog[];
};

// 1週間分（未記録の日も含めて）表示
export default function LogTable({
  week,
  filteredLogs,
}: Props) {
  const today = getToday();

  const recorded = filteredLogs.length;
  const studyTotal = filteredLogs.reduce((sum, l) => sum + (l.studyTime ?? 0), 0);
  const phoneTotal = filteredLogs.reduce((sum, l) => sum + (l.phoneTime ?? 0), 0);

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>日付</th>
            <th style={thStyle}>勉強</th>
            <th style={thStyle}>スマホ</th>
            <th style={thStyle}>就寝</th>
            <th style={thStyle}>満足度</th>
          </tr>
        </thead>

        <tbody>
          {week.map((day) => {
            const log = filteredLogs.find((l) => l.date.split("T")[0] === day.date);
            const isFuture = day.date > today;

            return (
              <tr key={day.date} style={{ opacity: isFuture ? 0.4 : 1 }}>
                <td style={{ ...tdStyle, fontWeight: day.date === today ? 700 : "normal" }}>
                  {day.displayDate}
                  <span
                    style={{
                      color:
                        day.dayName === "日" ? colors.danger
                        : day.dayName === "土" ? "#3b82f6"
                        : "inherit",
                    }}
                  >
                    ({day.dayName})
                  </span>
                </td>

                {log ? (
                  <>
                    <td style={tdStyle}>{formatHours(log.studyTime)}</td>
                    <td style={tdStyle}>{formatHours(log.phoneTime)}</td>
                    <td style={tdStyle}>{log.sleepTime}</td>
                    <td style={{ ...tdStyle, fontSize: 18 }}>{log.satisfaction}</td>
                  </>
                ) : (
                  <td colSpan={4} style={{ ...tdStyle, color: isFuture ? colors.muted : colors.danger, fontSize: 13 }}>
                    {isFuture ? "" : "未提出"}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>

        <tfoot>
          <tr>
            <td style={footStyle}>週計（{recorded}日）</td>
            <td style={footStyle}>{recorded ? formatHours(studyTotal) : "-"}</td>
            <td style={footStyle}>
              {recorded ? `平均 ${formatHours(Math.round(phoneTotal / recorded))}` : "-"}
            </td>
            <td style={footStyle} colSpan={2} />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  borderBottom: "2px solid var(--border)",
  padding: "10px",
  textAlign: "left",
  fontSize: 13,
  opacity: 0.7,
};

const tdStyle: React.CSSProperties = {
  borderBottom: "1px solid var(--border)",
  padding: "10px",
};

const footStyle: React.CSSProperties = {
  padding: "10px",
  fontWeight: 700,
  fontSize: 14,
};
