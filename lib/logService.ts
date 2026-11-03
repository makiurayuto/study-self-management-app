import { db } from "@/firebase";
import {
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
  type QueryConstraint,
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

// =====================
// 先生用：全生徒のログを日付で横断取得（collectionGroup "logs"）
// 生徒数・日数が増えても、必要な日付の分だけ読み込む
// =====================
const queryLogs = async (
  ...constraints: QueryConstraint[]
): Promise<StudentDailyLog[]> => {
  const snapshot = await getDocs(
    query(collectionGroup(db, "logs"), ...constraints)
  );

  return snapshot.docs.map((d) => toStudentDailyLog(d.data()));
};

// 指定日の全生徒のログ
export const fetchLogsByDate = (date: string) =>
  queryLogs(where("date", "==", date));

// 期間内（from〜to を含む）の全生徒のログ
export const fetchLogsInRange = (from: string, to: string) =>
  queryLogs(where("date", ">=", from), where("date", "<=", to));

export const saveStudentLog = async (log: StudentDailyLog) => {
  await setDoc(logDoc(log.uid, log.date), log);
};

export const deleteStudentLogs = async (uid: string) => {
  const snapshot = await getDocs(logsCollection(uid));

  await Promise.all(
    snapshot.docs.map((d) => deleteDoc(d.ref))
  );
};
