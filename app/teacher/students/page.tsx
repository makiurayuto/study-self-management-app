"use client";
import { useEffect, useMemo, useState } from "react";
import { db } from "@/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import Button from "@/app/components/shared/Button";
import { getWeekDates, formatDateForDisplay } from "@/app/lib/date";
import { useTeacherStudents } from "@/app/teacher/students/hooks/useTeacherStudents";
import Sidebar from "@/app/teacher/students/components/Sidebar";
import StudentDetail from "@/app/teacher/students/components/StudentDetail";
import WeekHeader from "@/app/teacher/students/components/WeekHeader";
import LogTable from "@/app/teacher/students/components/LogTable";

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

console.log("StudentDetail file:", StudentDetail);


  // 👇選択中の生徒
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const [viewMode, setViewMode] =
    useState<"students" | "hidden">("students");

  const {
    students,
    hiddenStudents,
    logs,
    loading,
    fetchData,
  } = useTeacherStudents(user, authLoading);

  const [weekOffset, setWeekOffset] = useState(0);

  const handleChangeMode = (mode: "students" | "hidden") => {
    setViewMode(mode);
    setSelectedUid(null);
  };

  const getWeekLabel = (offset: number) => {
    if (offset === 0) return "今週";
    if (offset === -1) return "先週";
    if (offset === 1) return "来週";
    return `${offset > 0 ? "+" : ""}${offset}週`;
  };

  const formatDate = (d: Date) =>
  `${d.getMonth() + 1}/${d.getDate()}`;

  const formatDateDisplay = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  const week = getWeekDates(weekOffset);

  const start = week[0].date;
  const end = week[6].date;

  const normalize = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const filteredLogs = logs.filter((l) => {
    const logDate = l.date.split("T")[0]; // ←強制正規化

    return (
      l.uid === selectedUid &&
      week.some((w) => w.date === logDate)
    );
  });

  const studentMap = useMemo(() => {
    return Object.fromEntries(
      [...students, ...hiddenStudents].map((s) => [s.uid, s.name])
    );
  }, [students, hiddenStudents]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/");
      return;
    }

    if (!user || user.role !== "teacher") {
      router.push("/");
      return;
    }

    fetchData();
  }, [user, authLoading]);

  useEffect(() => {
    console.log(selectedUid);
    console.log(studentMap);
  }, [selectedUid, studentMap]);

  if (authLoading || loading) {
    return <div style={{ padding: 20 }}>読み込み中...</div>;
  }

  const isHiddenStudent = hiddenStudents.some(
    (s) => s.uid === selectedUid
  );

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
          setHidden={async (uid) => {
            await updateDoc(doc(db, "users", uid), {
              isHidden: true,
            });

            setSelectedUid(null);
            setViewMode("hidden");
            fetchData();
          }}
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
