"use client";

import { useCallback, useEffect, useState } from "react";
import type { Student } from "@/types/student";
import type { AppUser } from "@/lib/auth/AuthContext";
import { fetchStudents } from "@/lib/studentService";

type TeacherStudentsData = {
  students: Student[];
  hiddenStudents: Student[];
  graduatedStudents: Student[];
};

// 生徒を status ごとに分けて取得（ログは必要な画面で個別に取得する）
const loadTeacherStudents = async (): Promise<TeacherStudentsData> => {
  const allStudents = await fetchStudents();

  const students = allStudents.filter((s) => s.status === "active");
  const hiddenStudents = allStudents.filter((s) => s.status === "hidden");
  const graduatedStudents = allStudents.filter((s) => s.status === "graduated");

  graduatedStudents.sort((a, b) => {
    const aTime = a.graduatedAt?.toMillis() ?? 0;
    const bTime = b.graduatedAt?.toMillis() ?? 0;

    return bTime - aTime;
  });

  return { students, hiddenStudents, graduatedStudents };
};

export function useTeacherStudents(user: AppUser | null, authLoading: boolean) {
  const [students, setStudents] = useState<Student[]>([]);
  const [hiddenStudents, setHiddenStudents] = useState<Student[]>([]);
  const [graduatedStudents, setGraduatedStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const applyData = useCallback((data: TeacherStudentsData) => {
    setStudents(data.students);
    setHiddenStudents(data.hiddenStudents);
    setGraduatedStudents(data.graduatedStudents);

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
    loading,
    error,
    fetchData,
  };
}
