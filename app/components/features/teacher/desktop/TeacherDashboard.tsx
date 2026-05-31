"use client";

import Button from "@/app/components/shared/Button";
import DateNavigator from "@/app/components/shared/DateNavigator";
import SectionTitle from "@/app/components/shared/SectionTitle";
import Card from "@/app/components/shared/Card";

type Student = {
  uid: string;
  name: string;
};

type Log = {
  uid: string;
  date: string;
  studyTime: number | null;
  phoneTime: number | null;
  sleepTime: string;
  satisfaction: string;
};

type Props = {
  currentDateLabel: string;

  visibleLogs: Log[];
  missingStudents: Student[];

  studentMap: Record<string, string>;

  loading: boolean;

  onPrevDay: () => void;
  onNextDay: () => void;
  onYesterday: () => void;
};

export default function TeacherDashboard({
  currentDateLabel,
  visibleLogs,
  missingStudents,
  studentMap,
  loading,
  onPrevDay,
  onNextDay,
  onYesterday,
}: Props) {
  return (
    <>
      {/* ログ一覧 */}
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

      {/* 未提出者 */}
      <Card>
        <SectionTitle>
          🚨 未提出者
        </SectionTitle>

        {missingStudents.length === 0 ? (
          <p style={{ color: "green" }}>
            全員提出済み 🎉
          </p>
        ) : (
          <ul style={{ paddingLeft: 20 }}>
            {missingStudents.map((s) => (
              <li
                key={s.uid}
                style={{ color: "#ef4444" }}
              >
                {s.name}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <SectionTitle>
          ✅ 提出済み
        </SectionTitle>
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
      </Card>
    </>
  );
}

const cardStyle = {
  background: "#fff",
  border: "1px solid #ddd",
  borderRadius: 12,
  padding: 20,
  marginBottom: 24,
};

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
const sectionTitleStyle = {
  fontSize: 18,
  fontWeight: 700,
  marginBottom: 8,
};