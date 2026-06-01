"use client";

import { Log } from "../hooks/useStudentDetail";

type WeekDate = {
  date: string;
  dayName: string;
  displayDate: string;
};

type Props = {
  logs: Log[];
  weekDates: WeekDate[];
};

export default function WeeklyTable({
  logs,
  weekDates,
}: Props) {
  const normalizeDate = (value: string) => {
    if (!value) return "";
    return value.replaceAll("/", "-").split("T")[0];
  };

  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: 12,
      }}
    >
      <thead>
        <tr>
          <th>日付</th>
          <th>曜日</th>
          <th>勉強</th>
          <th>スマホ</th>
          <th>睡眠</th>
          <th>満足度</th>
        </tr>
      </thead>

      <tbody>
        {weekDates.map((day) => {
          const log = logs.find(
            (l) =>
              normalizeDate(l.date) ===
              normalizeDate(day.date)
          );

          return (
            <tr key={day.date}>
              <td>{day.displayDate}</td>
              <td>{day.dayName}</td>

              {log ? (
                <>
                  <td>
                    {log.studyTime
                      ? `${(
                          log.studyTime / 60
                        ).toFixed(1)}h`
                      : ""}
                  </td>

                  <td>
                    {log.phoneTime
                      ? `${(
                          log.phoneTime / 60
                        ).toFixed(1)}h`
                      : ""}
                  </td>

                  <td>{log.sleepTime}</td>
                  <td>{log.satisfaction}</td>
                </>
              ) : (
                <td
                  colSpan={4}
                  style={{
                    textAlign: "center",
                    color: "#ef4444",
                    fontWeight: "bold",
                  }}
                >
                  ❌ 未提出
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}