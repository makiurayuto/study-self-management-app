"use client";

import StudentList from "./StudentList";
import type { Student } from "@/types/student";

type Props = {
  students: Student[];
  selectedUid: string | null;
  setSelectedUid: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function Sidebar({
  students,
  selectedUid,
  setSelectedUid,
}: Props) {
  return (
    <div
      style={{
        width: "30%",
        borderRight: "1px solid #ddd",
        overflowY: "auto",
      }}
    >
      <h2 style={{ textAlign: "center", padding: 16, fontWeight: 700, }}>👤 生徒一覧</h2>

      <hr style={{ border: "none", borderTop: "1px solid #e5e7eb" }} />

      <StudentList
        students={students}
        selectedUid={selectedUid}
        setSelectedUid={setSelectedUid}
      />
    </div>
  );
}
