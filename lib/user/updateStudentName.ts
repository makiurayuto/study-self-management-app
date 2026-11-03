import { db } from "@/firebase";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

// students と users の name を同期して更新
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

  if (userSnap.exists()) {
    await updateDoc(userRef, {
      name,
    });
  }
};
