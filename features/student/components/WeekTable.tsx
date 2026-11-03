"use client";

import { useRef } from "react";
import Button from "@/components/shared/Button";
import { cardStyle, colors } from "@/components/shared/styles";
import { getToday, getWeekDates, parseDate } from "@/lib/date";
import { formatHours } from "@/lib/time";
import type { StudentDailyLog } from "@/types/student-log";

type Props = {
  logs: StudentDailyLog[];
  weekOffset: number;
  setWeekOffset: React.Dispatch<React.SetStateAction<number>>;
  selectedDate: string;
  onSelectDate: (date: string) => void;
};

const SWIPE_THRESHOLD = 50;

export default function WeekTable({
  logs,
  weekOffset,
  setWeekOffset,
  selectedDate,
  onSelectDate,
}: Props) {
  const today = getToday();
  const week = getWeekDates(weekOffset);

  const rows = week.map((day) => ({
    ...day,
    log: logs.find((l) => l.date === day.date) ?? null,
    isToday: day.date === today,
    isFuture: day.date > today,
  }));

  // =====================
  // 週の集計
  // =====================
  const recorded = rows.flatMap((r) => (r.log ? [r.log] : []));
  const studyTotal = recorded.reduce((sum, l) => sum + (l.studyTime ?? 0), 0);
  const phoneTotal = recorded.reduce((sum, l) => sum + (l.phoneTime ?? 0), 0);

  // =====================
  // スワイプで週切替
  // =====================
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;

    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;

    if (dx > SWIPE_THRESHOLD) setWeekOffset((p) => p - 1);
    if (dx < -SWIPE_THRESHOLD && weekOffset < 0) setWeekOffset((p) => p + 1);
  };

  const first = parseDate(week[0].date);
  const last = parseDate(week[6].date);
  const rangeLabel = `${first.getMonth() + 1}/${first.getDate()} 〜 ${last.getMonth() + 1}/${last.getDate()}`;

  return (
    <div style={{ ...cardStyle, padding: 12 }}>
      {/* ヘッダー */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: "bold" }}>📊 1週間の記録</div>
        <div style={{ fontSize: 13, color: colors.muted }}>
          {weekOffset === 0 ? "今週" : weekOffset === -1 ? "先週" : `${-weekOffset}週前`}
          ・{rangeLabel}
        </div>
      </div>

      {/* 表 */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ overflowX: "auto", userSelect: "none" }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
          <thead>
            <tr>
              <th style={thStyle}>日付</th>
              <th style={thStyle}>勉強</th>
              <th style={thStyle}>スマホ</th>
              <th style={thStyle}>就寝</th>
              <th style={thStyle}>満足</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r) => {
              const isSelected = r.date === selectedDate;
              const dayColor =
                r.dayName === "日" ? colors.danger : r.dayName === "土" ? "#3b82f6" : "inherit";

              return (
                <tr
                  key={r.date}
                  onClick={() => !r.isFuture && onSelectDate(r.date)}
                  aria-selected={isSelected}
                  style={{
                    cursor: r.isFuture ? "default" : "pointer",
                    opacity: r.isFuture ? 0.4 : 1,
                    background: isSelected ? colors.primarySoft : "transparent",
                    outline: isSelected ? `2px solid ${colors.primary}` : "none",
                    outlineOffset: -2,
                  }}
                >
                  <td style={{ ...tdStyle, fontWeight: r.isToday ? 700 : "normal" }}>
                    {r.displayDate}
                    <span style={{ color: dayColor }}>({r.dayName})</span>
                    {r.isToday && (
                      <div style={{ fontSize: 10, color: colors.primary }}>今日</div>
                    )}
                  </td>

                  {r.log ? (
                    <>
                      <td style={tdStyle}>{formatHours(r.log.studyTime)}</td>
                      <td style={tdStyle}>{formatHours(r.log.phoneTime)}</td>
                      <td style={tdStyle}>{r.log.sleepTime}</td>
                      <td style={tdStyle}>{r.log.satisfaction}</td>
                    </>
                  ) : (
                    <td
                      colSpan={4}
                      style={{ ...tdStyle, color: colors.muted, fontSize: 13 }}
                    >
                      {r.isFuture ? "" : "未記録（タップして入力）"}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 集計 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 8,
          textAlign: "center",
          fontSize: 12,
          color: colors.muted,
        }}
      >
        <Summary label="記録日数" value={`${recorded.length}日`} />
        <Summary
          label="勉強 合計"
          value={recorded.length ? formatHours(studyTotal) : "-"}
        />
        <Summary
          label="スマホ 平均"
          value={recorded.length ? formatHours(Math.round(phoneTotal / recorded.length)) : "-"}
        />
      </div>

      {/* 週切替 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        <Button variant="secondary" size="md" onClick={() => setWeekOffset((p) => p - 1)}>
          ◀ 前の週
        </Button>
        <Button
          variant="secondary"
          size="md"
          disabled={weekOffset === 0}
          onClick={() => setWeekOffset(0)}
        >
          今週
        </Button>
        <Button
          variant="secondary"
          size="md"
          disabled={weekOffset >= 0}
          onClick={() => setWeekOffset((p) => p + 1)}
        >
          次の週 ▶
        </Button>
      </div>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        padding: "8px 4px",
        borderRadius: 10,
        background: "var(--bg)",
      }}
    >
      <div>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>{value}</div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  borderBottom: "1px solid var(--border)",
  padding: "8px 4px",
  color: colors.muted,
  textAlign: "center",
  fontSize: 12,
  fontWeight: 600,
};

const tdStyle: React.CSSProperties = {
  borderBottom: "1px solid var(--border)",
  padding: "10px 4px",
  textAlign: "center",
};
