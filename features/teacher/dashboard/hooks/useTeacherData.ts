"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Student } from "@/types/student";
import type { StudentDailyLog } from "@/types/student-log";
import { fetchStudents } from "@/lib/studentService";
import { fetchLogsForStudents } from "@/lib/logService";

// 非表示以外の生徒と、targetDate のログを取得
const loadDashboardData = async (targetDate: string) => {
  const allStudents = await fetchStudents();
  const students = allStudents.filter((s) => s.status !== "hidden");

  const allLogs = await fetchLogsForStudents(
    students.map((s) => s.uid)
  );

  return {
    students,
    logs: allLogs.filter((log) => log.date === targetDate),
  };
};

export function useTeacherData(targetDate: string) {
  const [students, setStudents] = useState<Student[]>([]);
  const [logs, setLogs] = useState<StudentDailyLog[]>([]);
  // 最後に読み込みが完了した日付（targetDate と異なる間は読み込み中）
  const [loadedDate, setLoadedDate] = useState<string | null>(null);

  const loading = loadedDate !== targetDate;

  const applyData = useCallback(
    (data: { students: Student[]; logs: StudentDailyLog[] }) => {
      setStudents(data.students);
      setLogs(data.logs);
      setLoadedDate(targetDate);
    },
    [targetDate]
  );

  const fetchData = useCallback(async () => {
    applyData(await loadDashboardData(targetDate));
  }, [targetDate, applyData]);

  useEffect(() => {
    loadDashboardData(targetDate).then(applyData);
  }, [targetDate, applyData]);

  // =========================
  // 派生データ
  // =========================

  const visibleStudents = useMemo(() => {
    return students.filter((s) => s.status === "active");
  }, [students]);

  const studentMap = useMemo(() => {
    return Object.fromEntries(
      students.map((s) => [s.uid, s.name])
    );
  }, [students]);

  const submittedUids = useMemo(() => {
    return new Set(logs.map((l) => l.uid));
  }, [logs]);

  const missingStudents = useMemo(() => {
    return visibleStudents.filter((s) => !submittedUids.has(s.uid));
  }, [visibleStudents, submittedUids]);

  const visibleLogs = useMemo(() => {
    return logs.filter((log) =>
      visibleStudents.some((s) => s.uid === log.uid)
    );
  }, [logs, visibleStudents]);

  return {
    loading,
    studentMap,
    missingStudents,
    visibleLogs,
    refresh: fetchData,
  };
}
