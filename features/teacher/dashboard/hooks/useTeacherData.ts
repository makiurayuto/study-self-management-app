"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import type { Student } from "@/types/student";
import type { StudentDailyLog } from "@/types/student-log";
import { toStudentDailyLog } from "@/lib/mappers/studentLogMapper";

export function useTeacherData(targetDate: string) {
  const [students, setStudents] = useState<Student[]>([]);
  const [hiddenStudents, setHiddenStudents] = useState<Student[]>([]);
  const [logs, setLogs] = useState<StudentDailyLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const studentSnap = await getDocs(
        collection(db, "students")
      );

      const studentList: Student[] = [];
      const hiddenList: Student[] = [];

      studentSnap.forEach((d) => {
        const data = d.data();

        const student: Student = {
          uid: d.id,
          name: data.name || "名前なし",
          role: "student",

          status: data.status ?? "active",
          schoolId: data.schoolId ?? null,
        };

        if (student.status === "hidden") hiddenList.push(student);
        else studentList.push(student);
      });

      setStudents(studentList);
      setHiddenStudents(hiddenList);

      const logSnap = await getDocs(
        query(collection(db, "weeklyLogs"), where("date", "==", targetDate))
      );

      const logList: StudentDailyLog[] = [];

      logSnap.forEach((d) => {
        const data = d.data();

        logList.push(toStudentDailyLog(data));
      });

      setLogs(logList);
    } finally {
      setLoading(false);
    }
  }, [targetDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // =========================
  // 派生データ（ここが重要）
  // =========================

  const visibleStudents = useMemo(() => {
    return students.filter((s) => s.status === "active");
  }, [students]);

  const allStudents = useMemo(
    () => [...students, ...hiddenStudents],
    [students, hiddenStudents]
  );

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
      .filter((s) => s.status === "active")
      .filter((s) => !submittedUids.has(s.uid));
  }, [visibleStudents, submittedUids]);

  const visibleLogs = useMemo(() => {
    return logs.filter((log) =>
      visibleStudents.some((s) => s.uid === log.uid)
    );
  }, [logs, visibleStudents]);

  return {
    logs,
    loading,
    studentMap,
    missingStudents,
    visibleLogs,
  };
}