"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import type { Student } from "@/app/types/student";

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
  const [graduatedStudents, setGraduatedStudents] = useState<Student[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);

    const userSnap = await getDocs(collection(db, "users"));
    const logSnap = await getDocs(collection(db, "weeklyLogs"));

    const studentList: Student[] = [];
    const hiddenList: Student[] = [];
    const graduatedList: Student[] = [];

    userSnap.forEach((d) => {
      const data = d.data();

      if (data.role !== "student") return;

      const student: Student = {
        uid: d.id,
        name: data.name || "名前なし",

        role: data.role ?? "student",

        status: data.status ?? "active",
        schoolId: data.schoolId ?? null,

        hiddenAt: data.hiddenAt ?? null,
        graduatedAt: data.graduatedAt ?? null,
      };

      const status = data.status ?? "active";

      if (status === "active") {
        studentList.push(student);
      } else if (status === "hidden") {
        hiddenList.push(student);
      } else if (status === "graduated") {
        graduatedList.push(student);
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
    setGraduatedStudents(graduatedList);
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
    graduatedStudents,
    logs,
    loading,
    fetchData,
  };
}