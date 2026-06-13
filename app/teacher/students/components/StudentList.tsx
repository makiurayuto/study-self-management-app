"use client";
import type { Student } from "@/types/student";

type Props = {
  students: Student[];
  selectedUid: string | null;
  setSelectedUid: (uid: string) => void;
};

export default function StudentList({
  students,
  selectedUid,
  setSelectedUid,
}: Props) {
  return (
    <>
      {students.map((s) => (
        <div
          key={s.uid}
          onClick={() => setSelectedUid(s.uid)}
          style={{
            padding: "12px 16px",
            cursor: "pointer",
            borderBottom: "1px solid #e5e7eb",
            background: selectedUid === s.uid ? "#f0f9ff" : "white",
          }}
        >
          {s.name}
        </div>
      ))}
    </>
  );
}