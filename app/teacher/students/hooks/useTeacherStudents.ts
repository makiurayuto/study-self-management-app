"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";

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

export function useTeacherStudents(user: any, authLoading: boolean) {
  const [students, setStudents] = useState<Student[]>([]);
  const [hiddenStudents, setHiddenStudents] = useState<Student[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);

    const userSnap = await getDocs(collection(db, "users"));
    const logSnap = await getDocs(collection(db, "weeklyLogs"));

    const studentList: Student[] = [];
    const hiddenList: Student[] = [];

    userSnap.forEach((d) => {
      const data = d.data();

      if (data.role !== "student") return;

      const student = {
        uid: d.id,
        name: data.name || "名前なし",
      };

      if (data.isHidden) {
        hiddenList.push(student);
      } else {
        studentList.push(student);
      }
    });

    const logList: Log[] = [];

    logSnap.forEach((d) => {
      const data = d.data();

      logList.push({
        uid: data.uid ?? "",
        date: data.date ?? "",
        studyTime: data.studyTime ?? null,
        phoneTime: data.phoneTime ?? null,
        sleepTime: data.sleepTime ?? "",
        satisfaction: data.satisfaction ?? "",
      });
    });

    logList.sort((a, b) => b.date.localeCompare(a.date));

    setStudents(studentList);
    setHiddenStudents(hiddenList);
    setLogs(logList);

    setLoading(false);
  };

  useEffect(() => {
    if (!user || authLoading) return;
    fetchData();
  }, [user, authLoading]);

  return {
    students,
    hiddenStudents,
    logs,
    loading,
    fetchData,
  };
}