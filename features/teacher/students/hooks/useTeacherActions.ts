import { db } from "@/firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

export function useTeacherActions(fetchData: () => void) {
  // 非表示
  const hideStudent = async (uid: string) => {
    await updateDoc(doc(db, "users", uid), {
      status: "hidden",
      hiddenAt: serverTimestamp(),
    });

    fetchData();
  };

  // 再表示
  const unhideStudent = async (uid: string) => {
    await updateDoc(doc(db, "users", uid), {
      status: "active",
      hiddenAt: null,
    });

    fetchData();
  };

  return { hideStudent, unhideStudent };
}