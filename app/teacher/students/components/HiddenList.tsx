"use client";

import Button from "@/components/shared/Button";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "@/firebase";
import type { Student } from "@/types/student";

type Props = {
  hiddenStudents: Student[];
  setSelectedUid: (uid: string | null) => void;
};

export default function HiddenList({
  hiddenStudents,
  setSelectedUid,
}: Props) {
  const handleUnhide = async (uid: string) => {
    await updateDoc(doc(db, "users", uid), {
      isHidden: false,
    });

    // 👉 ここは親に任せる（後でuseEffect or fetchData）
  };

  return (
    <>
      {hiddenStudents.map((s) => (
        <div
          key={s.uid}
          onClick={() => setSelectedUid(s.uid)}
          style={{
            padding: "12px 16px",
            cursor: "pointer",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            gap: 20,
          }}
        >
          <span>{s.name}</span>

          <div style={{ marginLeft: "auto" }}>
            <Button
              variant="secondary"
              onClick={async () => {
                await handleUnhide(s.uid);
              }}
            >
              再表示
            </Button>
          </div>
        </div>
      ))}
    </>
  );
}