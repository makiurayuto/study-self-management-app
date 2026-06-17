import { db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";

export const updateStudentName = async (
  uid: string,
  name: string
) => {
  await Promise.all([
    updateDoc(doc(db, "users", uid), {
      name,
    }),
    updateDoc(doc(db, "students", uid), {
      name,
    }),
  ]);
};