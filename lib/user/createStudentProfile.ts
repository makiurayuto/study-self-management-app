import { db } from "@/firebase";
import { doc, writeBatch } from "firebase/firestore";

// users（ログイン情報）と students（生徒情報）を同時に作成する。
// 片方だけ作成された中途半端な状態にならないよう batch でまとめて書き込む
export async function createStudentProfile(
  uid: string,
  name: string
) {
  const batch = writeBatch(db);

  batch.set(doc(db, "users", uid), {
    name,
    role: "student",
    schoolId: null,
  });

  batch.set(doc(db, "students", uid), {
    name,
    status: "active",
    schoolId: null,
    hiddenAt: null,
    graduatedAt: null,
  });

  await batch.commit();
}
