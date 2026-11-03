"use client";

import { useCallback, useEffect, useState } from "react";
import type { Student } from "@/types/student";
import type { StudentDailyLog } from "@/types/student-log";
import type { AppUser } from "@/lib/auth/AuthContext";
import { fetchStudents } from "@/lib/studentService";
import { fetchLogsForStudents } from "@/lib/logService";

type TeacherStudentsData = {
  students: Student[];
  hiddenStudents: Student[];
  graduatedStudents: Student[];
  logs: StudentDailyLog[];
};

// 生徒を status ごとに分け、在籍生徒のログを取得
const loadTeacherStudents = async (): Promise<TeacherStudentsData> => {
  const allStudents = await fetchStudents();

  const students = allStudents.filter((s) => s.status === "active");
  const hiddenStudents = allStudents.filter((s) => s.status === "hidden");
  const graduatedStudents = allStudents.filter((s) => s.status === "graduated");

  const logs = await fetchLogsForStudents(
    students.map((s) => s.uid)
  );

  logs.sort((a, b) => b.date.localeCompare(a.date));

  graduatedStudents.sort((a, b) => {
    const aTime = a.graduatedAt?.toMillis() ?? 0;
    const bTime = b.graduatedAt?.toMillis() ?? 0;

    return bTime - aTime;
  });

  return { students, hiddenStudents, graduatedStudents, logs };
};

export function useTeacherStudents(user: AppUser | null, authLoading: boolean) {
  const [students, setStudents] = useState<Student[]>([]);
  const [hiddenStudents, setHiddenStudents] = useState<Student[]>([]);
  const [graduatedStudents, setGraduatedStudents] = useState<Student[]>([]);
  const [logs, setLogs] = useState<StudentDailyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const applyData = useCallback((data: TeacherStudentsData) => {
    setStudents(data.students);
    setHiddenStudents(data.hiddenStudents);
    setGraduatedStudents(data.graduatedStudents);
    setLogs(data.logs);

    setError(false);
    setLoading(false);
  }, []);

  const handleError = useCallback((e: unknown) => {
    console.error("生徒データ読込失敗", e);
    setError(true);
    setLoading(false);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      applyData(await loadTeacherStudents());
    } catch (e) {
      handleError(e);
    }
  }, [applyData, handleError]);

  // 名前変更などで user が更新されても再取得しないよう uid に依存
  const uid = user?.uid;

  useEffect(() => {
    if (!uid || authLoading) return;
    loadTeacherStudents().then(applyData).catch(handleError);
  }, [uid, authLoading, applyData, handleError]);

  return {
    students,
    hiddenStudents,
    graduatedStudents,
    logs,
    loading,
    error,
    fetchData,
  };
}
