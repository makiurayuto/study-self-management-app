import type { StudentDailyLog } from "@/types/student-log";
import type { Student } from "@/types/student";

export const getMissingStudents = (
  students: Student[],
  logs: StudentDailyLog[]
): Student[] => {
  const submitted = new Set(logs.map((l) => l.uid));
  return students.filter((s) => !submitted.has(s.uid));
};

export const createStudentMap = (students: Student[]) => {
  return Object.fromEntries(
    students.map((s) => [s.uid, s.name])
  );
};

export const filterLogsByDateRange = (
  logs: StudentDailyLog[],
  start: Date,
  end: Date
) => {
  return logs.filter((l) => {
    const d = new Date(l.date);
    return d >= start && d <= end;
  });
};

export const formatDateShort = (date: string | Date) => {
  const d = new Date(date);
  return `${d.getMonth() + 1}/${d.getDate()}`;
};

export const formatHours = (min: number | null) => {
  if (min === null || min === undefined) return "-";
  return `${(min / 60).toFixed(1)}h`;
};

export const buildTeacherSummary = (
  students: Student[],
  logs: StudentDailyLog[]
) => {
  return {
    missingStudents: getMissingStudents(students, logs),
    studentMap: createStudentMap(students),
    submittedLogs: logs,
    totalStudents: students.length,
    submittedCount: logs.length,
    missingCount: students.length - logs.length,
  };
};