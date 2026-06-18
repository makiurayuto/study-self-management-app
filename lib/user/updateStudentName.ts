import { db } from "@/firebase";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

export const updateStudentName = async (
  uid: string,
  name: string
) => {
  const studentRef = doc(db, "students", uid);
  const userRef = doc(db, "users", uid);

  await updateDoc(studentRef, {
    name,
  });

  const userSnap = await getDoc(userRef);
console.log("exists", userSnap.exists());
  if (userSnap.exists()) {
    await updateDoc(userRef, {
      name,
    });
  }
};