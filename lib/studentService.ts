import { db } from "@/firebase";
import {
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import type { StudentStatus } from "@/types/student";

export const updateStudentName = async (
  uid: string,
  name: string
) => {
  const ref = doc(db, "users", uid)

  await updateDoc(ref, {
    name,
  });
};

// 単体更新
export const updateStudentStatus = async (
  uid: string,
  status: StudentStatus
) => {
  const ref = doc(db, "users", uid)

  if (status === "hidden") {
    return updateDoc(ref, {
      status,
      hiddenAt: serverTimestamp(),
    });
  }

  if (status === "graduated") {
    return updateDoc(ref, {
      status,
      graduatedAt: serverTimestamp(),
    });
  }

  return updateDoc(ref, { status });
};

// 一括更新
export const bulkUpdateStatus = async (
  uids: string[],
  status: StudentStatus
) => {
  await Promise.all(
    uids.map((uid) => updateStudentStatus(uid, status))
  );
};