"use client";

import Card from "@/components/shared/Card";
import SectionTitle from "@/components/shared/SectionTitle";
import { colors } from "@/components/shared/styles";
import type { Student } from "@/types/student";

type Props = {
  students: Student[];
};

export default function MissingStudents({
  students,
}: Props) {
  return (
    <Card>
      <SectionTitle>
        🚨 未提出（{students.length}人）
      </SectionTitle>

      {students.length === 0 ? (
        <p style={{ margin: 0, color: colors.success, fontWeight: 600 }}>
          全員提出済み 🎉
        </p>
      ) : (
        <ul
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            margin: 0,
            padding: 0,
            listStyle: "none",
          }}
        >
          {students.map((student) => (
            <li
              key={student.uid}
              style={{
                padding: "6px 12px",
                borderRadius: 999,
                background: `${colors.danger}15`,
                color: colors.danger,
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {student.name}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
