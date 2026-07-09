import { db } from "@/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";

const deleteLogsByUid = async (uid: string) => {

  const logsSnap = await getDocs(
    collection(
      db,
      "weeklyLogs",
      uid,
      "logs"
    )
  );

  await Promise.all(
    logsSnap.docs.map((logDoc) =>
      deleteDoc(logDoc.ref)
    )
  );
};

const deleteUser = async (uid: string) => {
  await Promise.all([
    deleteDoc(doc(db, "students", uid)),
    deleteDoc(doc(db, "users", uid)),
  ]);
};

export const deleteStudent = async (uid: string) => {
  const cleanUid = uid.trim();

  await deleteLogsByUid(cleanUid);
  await deleteUser(cleanUid);
};

export const bulkDeleteStudents = async (
  uids: string[]
) => {
  await Promise.all(
    uids.map((uid) => deleteStudent(uid))
  );
};

export const studentService = {
  deleteStudent,
  bulkDeleteStudents,
};