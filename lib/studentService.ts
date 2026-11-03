import { db } from "@/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import type { Student, StudentStatus } from "@/types/student";
import { deleteStudentLogs } from "@/lib/logService";

export { updateStudentName } from "@/lib/user/updateStudentName";

// 全生徒取得
export const fetchStudents = async (): Promise<Student[]> => {
  const snapshot = await getDocs(collection(db, "students"));

  return snapshot.docs.map((d) => {
    const data = d.data();

    return {
      uid: d.id,
      name: data.name || "名前なし",
      status: data.status ?? "active",
      schoolId: data.schoolId ?? null,
      hiddenAt: data.hiddenAt ?? null,
      graduatedAt: data.graduatedAt ?? null,
    };
  });
};

// 単体更新
export const updateStudentStatus = async (
  uid: string,
  status: StudentStatus
) => {
  const ref = doc(db, "students", uid);

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

// 削除（ログ → students / users）
export const deleteStudent = async (uid: string) => {
  const cleanUid = uid.trim();

  await deleteStudentLogs(cleanUid);
  await Promise.all([
    deleteDoc(doc(db, "students", cleanUid)),
    deleteDoc(doc(db, "users", cleanUid)),
  ]);
};

export const bulkDeleteStudents = async (uids: string[]) => {
  await Promise.all(uids.map(deleteStudent));
};
