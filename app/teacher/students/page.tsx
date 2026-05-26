"use client";

import { useEffect, useMemo, useState } from "react";
import { db } from "@/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";


type Student = {
  uid: string;
  name: string;
};

type Log = {
  uid: string;
  date: string;
  studyTime: number | null;
  phoneTime: number | null;
  sleepTime: string;
  satisfaction: string;
};

export default function TeacherPage() {
  const { user, authLoading } = useAuth();
  const router = useRouter();

  const [students, setStudents] = useState<Student[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);

  // 👇選択中の生徒
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // uid → 名前マップ
  const studentMap = useMemo(() => {
    return Object.fromEntries(
      students.map((s) => [s.uid, s.name])
    );
  }, [students]);

  // =========================
  // データ取得
  // =========================
  const fetchData = async () => {
    setLoading(true);

    const userSnap = await getDocs(collection(db, "users"));
    const logSnap = await getDocs(collection(db, "weeklyLogs"));

    const studentList: Student[] = [];

    userSnap.forEach((d) => {
      const data = d.data();

      if (data.role === "student") {
        studentList.push({
          uid: d.id,
          name: data.name || "名前なし",
        });
      }
    });

    setStudents(studentList);

    const logList: Log[] = [];

    logSnap.forEach((d) => {
      const data = d.data();

      logList.push({
        uid: data.uid ?? "",
        date: data.date ?? "",
        studyTime: data.studyTime ?? null,
        phoneTime: data.phoneTime ?? null,
        sleepTime: data.sleepTime ?? "",
        satisfaction: data.satisfaction ?? "",
      });
    });

    logList.sort((a, b) => b.date.localeCompare(a.date));

    setLogs(logList);

    setLoading(false);
  };

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/");
      return;
    }

    if (!user || user.role !== "teacher") {
      router.push("/");
      return;
    }

    fetchData();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return <div style={{ padding: 20 }}>読み込み中...</div>;
  }

  // =========================
  // UI
  // =========================
  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* ================= 左：生徒一覧 ================= */}
      <div
        style={{
          width: "30%",
          borderRight: "1px solid #ddd",
          overflowY: "auto",
        }}
      >
        <h2 style={{ padding: 12 }}>👥 生徒一覧</h2>

        {students.map((s) => (
          <div
            key={s.uid}
            onClick={() => setSelectedUid(s.uid)}
            style={{
              padding: 12,
              cursor: "pointer",
              borderBottom: "1px solid #eee",
              background:
                selectedUid === s.uid
                  ? "#e5e7eb"
                  : "white",
            }}
          >
            👤 {s.name}
          </div>
        ))}
      </div>

      {/* ================= 右：詳細 ================= */}
      <div style={{ width: "70%", padding: 20 }}>

        {!selectedUid ? (
          <p>👈 生徒を選択してください</p>
        ) : (
          <>
            <h2>
              👤 {studentMap[selectedUid]}
            </h2>

            <div style={{ overflowX: "auto", marginTop: 20 }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr>
                    <th style={thStyle}>日付</th>
                    <th style={thStyle}>勉強</th>
                    <th style={thStyle}>スマホ</th>
                    <th style={thStyle}>睡眠</th>
                    <th style={thStyle}>満足度</th>
                  </tr>
                </thead>

                <tbody>
                  {logs
                    .filter((l) => l.uid === selectedUid)
                    .map((log, i) => (
                      <tr key={i}>
                        <td style={tdStyle}>{log.date}</td>
                        <td style={tdStyle}>{log.studyTime}</td>
                        <td style={tdStyle}>{log.phoneTime}</td>
                        <td style={tdStyle}>{log.sleepTime}</td>
                        <td style={tdStyle}>{log.satisfaction}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// =========================
// styles
// =========================

const thStyle = {
  border: "1px solid #ccc",
  padding: 10,
  background: "#f3f4f6",
  textAlign: "left" as const,
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: 10,
};