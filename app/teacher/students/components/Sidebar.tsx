"use client";

import Button from "@/app/components/shared/Button";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "@/firebase";
import StudentList from "./StudentList";
import HiddenList from "./HiddenList";

type Student = {
  uid: string;
  name: string;
};

type Props = {
  students: Student[];
  hiddenStudents: Student[];
  viewMode: "students" | "hidden";
  setViewMode: (mode: "students" | "hidden") => void;
  selectedUid: string | null;
  setSelectedUid: (uid: string | null) => void;
  fetchData: () => void;
};

export default function Sidebar({
  students,
  hiddenStudents,
  viewMode,
  setViewMode,
  selectedUid,
  setSelectedUid,
  fetchData,
}: Props) {
  return (
    <div
      style={{
        width: "30%",
        borderRight: "1px solid #ddd",
        overflowY: "auto",
      }}
    >
      <h2 style={{ padding: 16 }}>👤 生徒一覧</h2>

      {/* モード切替 */}
      <div style={{ padding: "0 16px", display: "flex", gap: 8 }}>
        <button
          onClick={() => setViewMode("students")}
          style={{
            flex: 1,
            padding: 8,
            background: viewMode === "students" ? "#dbeafe" : "#f3f4f6",
          }}
        >
          👤 生徒
        </button>

        <button
          onClick={() => setViewMode("hidden")}
          style={{
            flex: 1,
            padding: 8,
            background: viewMode === "hidden" ? "#fee2e2" : "#f3f4f6",
          }}
        >
          🚫 非表示
        </button>
      </div>

      <hr />

      {/* 生徒一覧 */}
      {viewMode === "students" && (
        <StudentList
          students={students}
          selectedUid={selectedUid}
          setSelectedUid={setSelectedUid}
        />
      )}

      {/* 非表示一覧 */}
      {viewMode === "hidden" && (
        <HiddenList
          hiddenStudents={hiddenStudents}
          setSelectedUid={setSelectedUid}
          fetchData={fetchData}
        />
      )}
    </div>
  );
}