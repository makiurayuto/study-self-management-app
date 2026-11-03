"use client";
import { colors } from "@/components/shared/styles";
import type { Student } from "@/types/student";

type Props = {
  students: Student[];
  selectedUid: string | null;
  setSelectedUid: (uid: string) => void;
  weekCounts: Record<string, number>;
};

export default function StudentList({
  students,
  selectedUid,
  setSelectedUid,
  weekCounts,
}: Props) {
  if (students.length === 0) {
    return (
      <div style={{ padding: 16, color: colors.muted, fontSize: 14 }}>
        該当する生徒がいません
      </div>
    );
  }

  return (
    <>
      {students.map((s) => {
        const selected = selectedUid === s.uid;
        const count = weekCounts[s.uid] ?? 0;

        return (
          <button
            key={s.uid}
            type="button"
            onClick={() => setSelectedUid(s.uid)}
            aria-current={selected}
            className="list-item"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              padding: "12px 16px",
              border: "none",
              borderBottom: "1px solid var(--border)",
              borderRadius: 0,
              cursor: "pointer",
              textAlign: "left",
              fontSize: 15,
              fontWeight: selected ? 700 : 500,
              color: "var(--text)",
              background: selected ? colors.primarySoft : "transparent",
              boxShadow: selected ? `inset 4px 0 0 ${colors.primary}` : "none",
            }}
          >
            <span>{s.name}</span>
            <span
              title="今週の記録日数"
              style={{
                fontSize: 12,
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: 999,
                background: count === 0 ? `${colors.danger}15` : "var(--bg)",
                color: count === 0 ? colors.danger : "inherit",
              }}
            >
              今週 {count}日
            </span>
          </button>
        );
      })}
    </>
  );
}
