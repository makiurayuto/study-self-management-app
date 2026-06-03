"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { getWeekDates, formatDateForDisplay } from "@/app/lib/date";
import Sidebar from "@/app/teacher/students/components/Sidebar";
import StudentDetail from "@/app/teacher/students/components/StudentDetail";
import { useTeacherGuard } from "@/app/teacher/students/hooks/useTeacherGuard";
import { useTeacherData } from "@/app/teacher/students/hooks/useTeacherData";

type Student = {
  uid: string;
  name: string;
};

type Log = {
  uid: string;
  date: string;
  studyTime: number | null;
  phoneTime: number | null;
  sleepTime: string;
  satisfaction: string;
};

export default function TeacherPage() {
  const { user, authLoading } = useAuth();
  const router = useRouter();

  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const [viewMode, setViewMode] =
    useState<"students" | "hidden">("students");

  const [weekOffset, setWeekOffset] = useState(0);

  const {
    students,
    hiddenStudents,
    studentMap,
    week,
    filteredLogs,
    loading,
    fetchData,
    hideStudent,
  } = useTeacherData({
    user,
    authLoading,
    selectedUid,
    weekOffset,
  });

  useTeacherGuard({
    user,
    authLoading,
    fetchData,
  });

  const getWeekLabel = (offset: number) => {
    if (offset === 0) return "今週";
    if (offset === -1) return "先週";
    if (offset === 1) return "来週";
    return `${offset > 0 ? "+" : ""}${offset}週`;
  };

  useEffect(() => {
    console.log(selectedUid);
    console.log(studentMap);
  }, [selectedUid, studentMap]);

  if (authLoading) {
    return <div>認証確認中...</div>;
  }

  if (!user || user.role !== "teacher") {
    return null;
  }

  if (loading) {
    return <div>データ読み込み中...</div>;
  }

  // =========================
  // UI
  // =========================
  return (
    <div style={{ display: "flex", height: "100vh" }}>

      <Sidebar
        students={students}
        hiddenStudents={hiddenStudents}
        viewMode={viewMode}
        setViewMode={setViewMode}
        selectedUid={selectedUid}
        setSelectedUid={setSelectedUid}
        fetchData={fetchData}
      />

      {/* ================= 右：詳細 ================= */}
      <div style={{ width: "70%", padding: 20 }}>

       <StudentDetail
          selectedUid={selectedUid}
          studentMap={studentMap}
          weekOffset={weekOffset}
          setWeekOffset={setWeekOffset}
          getWeekLabel={getWeekLabel}
          formatDateForDisplay={formatDateForDisplay}
          week={week}
          filteredLogs={filteredLogs}
          setHidden={hideStudent}
        />

      </div>
    </div>
  );
}

// =========================
// styles
// =========================

const thStyle = {
  border: "1px solid #ccc",
  padding: 10,
  background: "#f3f4f6",
  textAlign: "left" as const,
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: 10,
};
