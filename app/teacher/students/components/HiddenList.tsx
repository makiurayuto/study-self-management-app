"use client";

import Button from "@/app/components/shared/Button";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "@/firebase";


type Student = {
  uid: string;
  name: string;
};

type Props = {
  hiddenStudents: Student[];
  setSelectedUid: (uid: string | null) => void;
  fetchData: () => void;
};

export default function HiddenList({
  hiddenStudents,
  setSelectedUid,
  fetchData,
}: Props) {
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
                await updateDoc(doc(db, "users", s.uid), {
                    isHidden: false,
                });

                fetchData();
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