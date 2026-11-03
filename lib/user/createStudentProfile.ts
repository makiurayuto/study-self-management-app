import { db } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";


export async function createStudentProfile(
  uid: string,
  name: string
) {
  console.log("create users start", uid);

  await setDoc(doc(db, "users", uid), {
    name,
    role: "student",
    schoolId: null,
  });

  console.log("create users done");
  console.log("create students start", uid);

  await setDoc(doc(db, "students", uid), {
    name,
    status: "active",
    schoolId: null,
    hiddenAt: null,
    graduatedAt: null,
  });

  console.log("create students done");
}