import { db } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";


export async function createStudentProfile(
  uid: string,
  name: string
) {

  // ログイン情報
  await setDoc(
    doc(db, "users", uid),
    {
      name,
      role: "student",
      schoolId: null,
    }
  );


  // 生徒情報
  await setDoc(
    doc(db, "students", uid),
    {
      name,
      status: "active",
      schoolId: null,
      hiddenAt: null,
      graduatedAt: null,
    }
  );

}