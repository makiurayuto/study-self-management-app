"use client";

import { useState } from "react";
import StudentList from "./StudentList";
import { textInputStyle } from "@/components/shared/styles";
import type { Student } from "@/types/student";

type Props = {
  students: Student[];
  selectedUid: string | null;
  setSelectedUid: (uid: string) => void;
  weekCounts: Record<string, number>;
};

export default function Sidebar({
  students,
  selectedUid,
  setSelectedUid,
  weekCounts,
}: Props) {
  const [query, setQuery] = useState("");

  const filtered = students
    .filter((s) => s.name.includes(query.trim()))
    .sort((a, b) => a.name.localeCompare(b.name, "ja"));

  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ padding: 12, borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>
          👤 生徒一覧（{students.length}人）
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="名前で検索"
          aria-label="名前で検索"
          style={{ ...textInputStyle, padding: 10, fontSize: 14 }}
        />
      </div>

      <div style={{ overflowY: "auto", maxHeight: "70vh" }}>
        <StudentList
          students={filtered}
          selectedUid={selectedUid}
          setSelectedUid={setSelectedUid}
          weekCounts={weekCounts}
        />
      </div>
    </div>
  );
}
