import type { DocumentData } from "firebase/firestore";
import type { StudentDailyLog } from "@/types/student-log";

export const toStudentDailyLog = (
  data: DocumentData
): StudentDailyLog => {
  return {
    uid: data.uid,
    date: data.date,
    studyTime: data.studyTime ?? null,
    phoneTime: data.phoneTime ?? null,
    sleepTime: data.sleepTime ?? "",
    satisfaction: data.satisfaction ?? "",
  };
};
