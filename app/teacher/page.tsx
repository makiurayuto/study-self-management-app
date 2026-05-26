"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { auth, db } from "@/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";


// =========================
// 型
// =========================

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

// =========================
// コンポーネント
// =========================

export default function TeacherPage() {

  const [students, setStudents] = useState<Student[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);

  const [loading, setLoading] = useState(true);

  // =========================
  // 生徒UID → 名前Map
  // =========================

  const studentMap = useMemo(() => {
    return Object.fromEntries(
      students.map((s) => [s.uid, s.name])
    );
  }, [students]);

  const normalizeDate = (value: string) => {
    if (!value) return "";

    return value
        .replaceAll("/", "-")
        .split("T")[0];
    };

  // =========================
  // データ取得
  // =========================

  const fetchData = useCallback(async () => {
    try {
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
          uid: data.uid,
          date: data.date,
          studyTime: data.studyTime ?? null,
          phoneTime: data.phoneTime ?? null,
          sleepTime: data.sleepTime ?? "",
          satisfaction: data.satisfaction ?? "",
        });
      });

      logList.sort((a, b) => b.date.localeCompare(a.date));

      setLogs(logList);

    } catch (e) {
      console.error("データ取得エラー", e);
      alert("データ取得に失敗しました");

    } finally {
      setLoading(false);
    }
  }, []);

    // -------------------------
    // ログアウト関数
    // -------------------------

    const router = useRouter();

    const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
    };

  // =========================
  // 認証 + 権限チェック
  // =========================

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      if (!u) {
        router.push("/");
        return;
      }

      const snap = await getDoc(doc(db, "users", u.uid));

      if (!snap.exists() || snap.data()?.role !== "teacher") {
        router.push("/");
        return;
      }

      await fetchData();
    });

    return () => unsub();
  }, [router, fetchData]);

  // =========================
  // ローディング
  // =========================

  if (loading) {
    return (
      <div
        style={{
          padding: 40,
          textAlign: "center",
          fontSize: 18,
        }}
      >
        読み込み中...
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 1200,
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      {/* タイトル */}
    <div style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    }}>
    <h1>👨‍🏫 先生ダッシュボード</h1>

    <button onClick={handleLogout} style={buttonStyle}>
        ログアウト
    </button>

        <button
          onClick={fetchData}
          style={buttonStyle}
        >
          更新
        </button>
      </div>

      {/* 生徒数 */}
      <div style={cardStyle}>
        <a
        href="/teacher/students"
        target="_blank"
        rel="noopener noreferrer"
        style={{
            display: "inline-block",
            padding: "12px 18px",
            borderRadius: 10,
            background: "#111827",
            color: "#ffffff",
            textDecoration: "none",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            transition: "0.2s",
        }}
        >
        生徒一覧
        </a>

        <p>生徒数：{students.length}人</p>
      </div>

      {/* ログ一覧 */}
      <div style={cardStyle}>
        <h2>今日の記録</h2>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: 700,
            }}
          >
            <thead>
              <tr>
                <th style={thStyle}>名前</th>
                <th style={thStyle}>勉強時間</th>
                <th style={thStyle}>スマホ時間</th>
                <th style={thStyle}>就寝時間</th>
                <th style={thStyle}>満足度</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log, i) => (
                <tr key={log.uid + log.date}>
                <td style={tdStyle}>
                        {studentMap[log.uid] || "不明"}
                </td>

                  <td style={tdStyle}>
                    {log.studyTime ?? ""}
                  </td>

                  <td style={tdStyle}>
                    {log.phoneTime ?? ""}
                  </td>

                  <td style={tdStyle}>
                    {log.sleepTime || ""}
                  </td>

                  <td style={tdStyle}>
                    {log.satisfaction || ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// =========================
// styles
// =========================

const cardStyle = {
  background: "#fff",
  border: "1px solid #ddd",
  borderRadius: 12,
  padding: 20,
  marginBottom: 24,
};

const buttonStyle = {
  padding: "10px 16px",
  borderRadius: 8,
  border: "none",
  background: "#111827",
  color: "white",
  cursor: "pointer",
};

const thStyle = {
  border: "1px solid #ccc",
  padding: 12,
  background: "#f3f4f6",
  textAlign: "left" as const,
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: 12,
};