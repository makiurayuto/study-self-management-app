import { formatDateForDisplay } from "@/lib/date";
import type { StudentDailyLog } from "@/types/student-log";

export function createStudentCsv(logs: StudentDailyLog[]) {
  return [
    ["日付", "勉強時間(分)", "スマホ時間(分)", "睡眠時間", "満足度"],
    ...logs.map((log) => [
      formatDateForDisplay(log.date),
      String(log.studyTime ?? ""),
      String(log.phoneTime ?? ""),
      log.sleepTime ?? "",
      log.satisfaction ?? "",
    ]),
  ];
}