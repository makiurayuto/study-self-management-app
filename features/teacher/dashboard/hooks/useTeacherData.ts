"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Student } from "@/types/student";
import type { StudentDailyLog } from "@/types/student-log";
import { fetchStudents } from "@/lib/studentService";
import { fetchLogsByDate } from "@/lib/logService";

// 非表示以外の生徒と、targetDate のログを取得
const loadDashboardData = async (targetDate: string) => {
  const [allStudents, logs] = await Promise.all([
    fetchStudents(),
    fetchLogsByDate(targetDate),
  ]);

  return {
    students: allStudents.filter((s) => s.status !== "hidden"),
    logs,
  };
};

const byName = (a: { name: string }, b: { name: string }) =>
  a.name.localeCompare(b.name, "ja");

export function useTeacherData(targetDate: string) {
  const [students, setStudents] = useState<Student[]>([]);
  const [logs, setLogs] = useState<StudentDailyLog[]>([]);
  // 最後に読み込みが完了した日付（targetDate と異なる間は読み込み中）
  const [loadedDate, setLoadedDate] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const loading = loadedDate !== targetDate;
  const initialLoading = loadedDate === null;

  const applyData = useCallback(
    (data: { students: Student[]; logs: StudentDailyLog[] }) => {
      setStudents(data.students);
      setLogs(data.logs);
      setLoadedDate(targetDate);
      setError(false);
    },
    [targetDate]
  );

  const handleError = useCallback(
    (e: unknown) => {
      console.error("ダッシュボード読込失敗", e);
      setError(true);
      setLoadedDate(targetDate);
    },
    [targetDate]
  );

  const fetchData = useCallback(async () => {
    try {
      applyData(await loadDashboardData(targetDate));
    } catch (e) {
      handleError(e);
    }
  }, [targetDate, applyData, handleError]);

  useEffect(() => {
    loadDashboardData(targetDate).then(applyData).catch(handleError);
  }, [targetDate, applyData, handleError]);

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
    return visibleStudents
      .filter((s) => !submittedUids.has(s.uid))
      .sort(byName);
  }, [visibleStudents, submittedUids]);

  const visibleLogs = useMemo(() => {
    const visibleUids = new Set(visibleStudents.map((s) => s.uid));

    return logs
      .filter((log) => visibleUids.has(log.uid))
      .sort((a, b) =>
        (studentMap[a.uid] ?? "").localeCompare(studentMap[b.uid] ?? "", "ja")
      );
  }, [logs, visibleStudents, studentMap]);

  return {
    loading,
    initialLoading,
    error,
    studentMap,
    missingStudents,
    visibleLogs,
    totalCount: visibleStudents.length,
    refresh: fetchData,
  };
}
