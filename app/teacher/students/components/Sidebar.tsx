"use client";

import Button from "@/components/shared/Button";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "@/firebase";
import StudentList from "./StudentList";
import HiddenList from "./HiddenList";
import { useRouter } from "next/navigation";
import type { Student } from "@/types/student";

type Props = {
  students: Student[];
  hiddenStudents: Student[];
  viewMode: "students" | "hidden";
  setViewMode: React.Dispatch<React.SetStateAction<"students" | "hidden">>;
  selectedUid: string | null;
  setSelectedUid: React.Dispatch<React.SetStateAction<string | null>>;
  fetchData: () => Promise<void>;
};

export default function Sidebar({
  students,
  hiddenStudents,
  viewMode,
  setViewMode,
  selectedUid,
  setSelectedUid,
}: Props) {

  const router = useRouter();

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


      {/*
      {/* モード切替 
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

      {/* 生徒一覧 
      {viewMode === "students" && (
        <StudentList
          students={students}
          selectedUid={selectedUid}
          setSelectedUid={setSelectedUid}
        />
      )}

      {/* 非表示一覧 
      {viewMode === "hidden" && (
        <HiddenList
          hiddenStudents={hiddenStudents}
          setSelectedUid={setSelectedUid}
        />
      )}
      */}

        <StudentList
          students={students}
          selectedUid={selectedUid}
          setSelectedUid={setSelectedUid}
        />
    </div>
  );
}