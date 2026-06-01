"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export type Student = {
  uid: string;
  name: string;
};

export type Log = {
  uid: string;
  date: string;
  studyTime: number | null;
  phoneTime: number | null;
  sleepTime: string;
  satisfaction: string;
};

export function useTeacherData(targetDate: string) {
  const [students, setStudents] = useState<Student[]>([]);
  const [hiddenStudents, setHiddenStudents] = useState<Student[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const userSnap = await getDocs(
        query(collection(db, "users"), where("role", "==", "student"))
      );

      const studentList: Student[] = [];
      const hiddenList: Student[] = [];

      userSnap.forEach((d) => {
        const data = d.data();

        const student = {
          uid: d.id,
          name: data.name || "名前なし",
        };

        if (data.isHidden) hiddenList.push(student);
        else studentList.push(student);
      });

      setStudents(studentList);
      setHiddenStudents(hiddenList);

      const logSnap = await getDocs(
        query(collection(db, "weeklyLogs"), where("date", "==", targetDate))
      );

      const logList: Log[] = [];

      logSnap.forEach((d) => {
        const data = d.data();

        logList.push({
          uid: data.uid,
          date: data.date,
          studyTime: data.studyTime ?? null,
          phoneTime: data.phoneTime ?? null,
          sleepTime: data.sleepTime ?? "",
          satisfaction: data.satisfaction ?? "",
        });
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

  const visibleStudents = students;

  const allStudents = useMemo(
    () => [...students, ...hiddenStudents],
    [students, hiddenStudents]
  );

  const studentMap = useMemo(() => {
    return Object.fromEntries(
        students.map((s) => [s.uid, s.name]) // ← hidden除外済み
    );
  }, [students]);

  const submittedUids = useMemo(() => {
    return new Set(logs.map((l) => l.uid));
  }, [logs]);

  const missingStudents = useMemo(() => {
    return visibleStudents.filter(
      (s) => !submittedUids.has(s.uid)
    );
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