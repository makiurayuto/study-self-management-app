import { db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";

export function useTeacherActions(fetchData: () => Promise<void>) {
  const hideStudent = async (uid: string) => {
    await updateDoc(doc(db, "users", uid), {
      isHidden: true,
    });

    await fetchData();
  };

  const unhideStudent = async (uid: string) => {
    await updateDoc(doc(db, "users", uid), {
      isHidden: false,
    });

    await fetchData();
  };

  return {
    hideStudent,
    unhideStudent,
  };
}