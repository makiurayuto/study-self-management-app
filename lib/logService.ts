import { db } from "@/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import type { StudentDailyLog } from "@/types/student-log";
import { toStudentDailyLog } from "@/lib/mappers/studentLogMapper";

// weeklyLogs/{uid}/logs/{YYYY-MM-DD}
const logsCollection = (uid: string) =>
  collection(db, "weeklyLogs", uid, "logs");

const logDoc = (uid: string, date: string) =>
  doc(db, "weeklyLogs", uid, "logs", date);

// 生徒1人の全ログ
export const fetchStudentLogs = async (
  uid: string
): Promise<StudentDailyLog[]> => {
  const snapshot = await getDocs(logsCollection(uid));

  return snapshot.docs.map((d) =>
    toStudentDailyLog({ uid, date: d.id, ...d.data() })
  );
};

// 複数生徒の全ログ
export const fetchLogsForStudents = async (
  uids: string[]
): Promise<StudentDailyLog[]> => {
  const results = await Promise.all(uids.map(fetchStudentLogs));
  return results.flat();
};

// 1日分のログ
export const fetchStudentLog = async (
  uid: string,
  date: string
): Promise<StudentDailyLog | null> => {
  const snap = await getDoc(logDoc(uid, date));

  if (!snap.exists()) return null;

  return toStudentDailyLog({ uid, date, ...snap.data() });
};

export const saveStudentLog = async (log: StudentDailyLog) => {
  await setDoc(logDoc(log.uid, log.date), log);
};

export const deleteStudentLogs = async (uid: string) => {
  const snapshot = await getDocs(logsCollection(uid));

  await Promise.all(
    snapshot.docs.map((d) => deleteDoc(d.ref))
  );
};
