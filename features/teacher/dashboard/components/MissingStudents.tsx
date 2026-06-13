"use client";

import Card from "@/app/components/shared/Card";
import SectionTitle from "@/app/components/shared/SectionTitle";

type Student = {
  uid: string;
  name: string;
};

type Props = {
  students: Student[];
};

export default function MissingStudents({
  students,
}: Props) {
  return (
    <Card>
      <SectionTitle>
        🚨 未提出者
      </SectionTitle>

      {students.length === 0 ? (
        <p style={{ color: "green" }}>
          全員提出済み 🎉
        </p>
      ) : (
        <ul style={{ paddingLeft: 20 }}>
          {students.map((student) => (
            <li
              key={student.uid}
              style={{ color: "#ef4444" }}
            >
              {student.name}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}