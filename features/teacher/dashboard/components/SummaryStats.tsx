"use client";

import { colors } from "@/components/shared/styles";
import { formatHours } from "@/lib/time";
import type { StudentDailyLog } from "@/types/student-log";

type Props = {
  logs: StudentDailyLog[];
  totalCount: number;
};

const average = (values: number[]) =>
  values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : null;

// 提出率・平均値のサマリー
export default function SummaryStats({ logs, totalCount }: Props) {
  const submitted = logs.length;
  const rate = totalCount ? Math.round((submitted / totalCount) * 100) : 0;

  const avgStudy = average(logs.flatMap((l) => (l.studyTime != null ? [l.studyTime] : [])));
  const avgPhone = average(logs.flatMap((l) => (l.phoneTime != null ? [l.phoneTime] : [])));

  const rateColor = rate >= 80 ? colors.success : rate >= 50 ? "#d97706" : colors.danger;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: 12,
        marginBottom: 12,
      }}
    >
      <Stat label="提出">
        <span style={{ color: rateColor }}>{submitted}</span>
        <span style={{ fontSize: 14, opacity: 0.6 }}> / {totalCount}人</span>
        <div style={{ marginTop: 6, height: 6, borderRadius: 3, background: "var(--border)" }}>
          <div
            style={{
              width: `${rate}%`,
              height: "100%",
              borderRadius: 3,
              background: rateColor,
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </Stat>

      <Stat label="提出率">
        <span style={{ color: rateColor }}>{rate}%</span>
      </Stat>

      <Stat label="平均 勉強時間">{avgStudy != null ? formatHours(avgStudy) : "-"}</Stat>

      <Stat label="平均 スマホ時間">{avgPhone != null ? formatHours(avgPhone) : "-"}</Stat>
    </div>
  );
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: "14px 16px",
      }}
    >
      <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700 }}>{children}</div>
    </div>
  );
}
