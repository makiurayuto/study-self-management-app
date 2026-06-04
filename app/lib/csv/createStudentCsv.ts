import { formatDateForDisplay } from "@/app/lib/date";

type Log = {
  date: string;
  studyTime: number | null;
  phoneTime: number | null;
  sleepTime: string;
  satisfaction: string;
};

export function createStudentCsv(logs: Log[]) {
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