"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export type Log = {
  uid: string;
  date: string;
  studyTime: number | null;
  phoneTime: number | null;
  sleepTime: string;
  satisfaction: string;
};


export function useStudentDetail(uid: string) {
  const [name, setName] = useState("");
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;

    const fetchData = async () => {
      setLoading(true);

      try {
        const userSnap = await getDoc(doc(db, "users", uid));

        if (userSnap.exists()) {
          setName(userSnap.data().name || "名前なし");
        }

        const q = query(
          collection(db, "weeklyLogs"),
          where("uid", "==", uid)
        );

        const logSnap = await getDocs(q);

        const list: Log[] = [];

        logSnap.forEach((d) => {
          list.push(d.data() as Log);
        });

        setLogs(list);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uid]);

  return {
    name,
    logs,
    loading,
  };
}