export type Log = {
  uid: string;
  date: string;
  studyTime: number | null;
  phoneTime: number | null;
  sleepTime: string;
  satisfaction: string;
};

export type Student = {
  uid: string;
  name: string;
};

export const getMissingStudents = (
  students: Student[],
  logs: Log[]
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
  logs: Log[],
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
  logs: Log[]
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