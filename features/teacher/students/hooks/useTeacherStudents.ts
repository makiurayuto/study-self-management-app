"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import type { Student } from "@/types/student";
import { toStudentDailyLog } from "@/lib/mappers/studentLogMapper";
import type { StudentDailyLog } from "@/types/student-log";

export function useTeacherStudents(user: any, authLoading: boolean) {
  const [students, setStudents] = useState<Student[]>([]);
  const [hiddenStudents, setHiddenStudents] = useState<Student[]>([]);
  const [graduatedStudents, setGraduatedStudents] = useState<Student[]>([]);
  const [logs, setLogs] = useState<StudentDailyLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);

    const studentSnap = await getDocs(collection(db, "students"));
    const logSnap = await getDocs(collection(db, "weeklyLogs"));

    const studentList: Student[] = [];
    const hiddenList: Student[] = [];
    const graduatedList: Student[] = [];

    studentSnap.forEach((d) => {
      const data = d.data();

      const student: Student = {
        uid: d.id,
        name: data.name || "名前なし",

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

    const logList: StudentDailyLog[] = [];

    logSnap.forEach((d) => {
      const data = d.data();

      logList.push(toStudentDailyLog(data));
    });

    logList.sort((a, b) => b.date.localeCompare(a.date));
    
    graduatedList.sort((a, b) => {
      const aTime = a.graduatedAt?.toMillis() ?? 0;
      const bTime = b.graduatedAt?.toMillis() ?? 0;

      return bTime - aTime;
    });

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