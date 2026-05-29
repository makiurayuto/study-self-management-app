"use client";

import { useEffect, useMemo, useState,useRef , useCallback } from "react";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import Button from "@/app/components/shared/Button";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";


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
  
  const [hiddenStudents, setHiddenStudents] = useState<Student[]>([]);


  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const isFetching = useRef(false);

  const normalizeDate = (value: string) => {
    if (!value) return "";

    return value
        .replaceAll("/", "-")
        .split("T")[0];
    };

  // =========================
  // データ取得
  // =========================

  const fetchData = useCallback(async (targetDate: string) => {
    setLoading(true);

    try {
      const userSnap = await getDocs(
        query(collection(db, "users"), where("role", "==", "student"))
      );

      const studentList: Student[] = [];
      const hiddenList: Student[] = [];

      userSnap.forEach((d) => {
        const data = d.data();

        const student = {
          uid: d.id,
          name: data.name || "名前なし",
        };

        if (data.isHidden) hiddenList.push(student);
        else studentList.push(student);
      });

      setStudents(studentList);
      setHiddenStudents(hiddenList);

      const logSnap = await getDocs(
        query(collection(db, "weeklyLogs"), where("date", "==", targetDate))
      );

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

      setLogs(logList);

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const formatDateForQuery = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
  };

  const formatDateForDisplay = (date: Date) => {
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    return `${mm}/${dd}`;
  };

  const getYesterday = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d;
};

const [currentDate, setCurrentDate] = useState(getYesterday());
  
  
    // -------------------------
    // 非表示生徒フィルタ
    // -------------------------

  const visibleStudents = students;

  const allStudents = [...students, ...hiddenStudents];

  const studentMap = useMemo(() => {
    return Object.fromEntries(
      allStudents.map((s) => [s.uid, s.name])
    );
  }, [allStudents]);

  const submittedUids = useMemo(() => {
    return new Set(logs.map((l) => l.uid));
  }, [logs]);

  const missingStudents = useMemo(() => {
    return visibleStudents.filter(
      (s) => !submittedUids.has(s.uid)
    );
  }, [visibleStudents, submittedUids]);

  const visibleLogs = useMemo(() => {
    return logs.filter((log) =>
      visibleStudents.some((s) => s.uid === log.uid)
    );
  }, [logs, visibleStudents]);
  
    // -------------------------
    // ログアウト関数
    // -------------------------

    const router = useRouter();
    const { user, authLoading, logout } = useAuth();

    const handleLogout = async () => {
      await logout();
      router.push("/");
    };

  // =========================
  // 認証 + 権限チェック
  // =========================
  useEffect(() => {
    if (authLoading) return;

    if (!user || user.role !== "teacher") {
      router.push("/");
      return;
    }

    const date = formatDateForQuery(currentDate);
    fetchData(date);

  }, [user, authLoading, currentDate]);


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

      
      <Button
          variant="secondary"
          size="md"
          onClick={() => {
            const date = formatDateForQuery(currentDate);
            fetchData(date);
          }}
        >
          更新
      </Button>

      <Button variant="secondary" size="md" onClick={handleLogout}>
          ログアウト
      </Button>
      </div>

      {/* 生徒数 */}
      <div style={cardStyle}>
        <Button
          variant="primary"
          size="md"
          onClick={() => router.push("/teacher/students")}
        >
          生徒一覧
        </Button>

        <p>生徒数：{students.length}人</p>
      </div>

      {/* ログ一覧 */}
      <div style={cardStyle}>
        <h2>{formatDateForDisplay(currentDate)}の記録</h2>
        <div style={{ display: "flex", gap: 8,marginTop: 16, marginBottom: 16 }}>
          <Button
            variant="secondary"
            onClick={() => {
                const d = new Date(currentDate);
                d.setDate(d.getDate() - 1);
                setCurrentDate(d);
              }}
          >
            ← 前日
          </Button>

            <Button
              variant="secondary"
              onClick={() => {
                const d = new Date();
                d.setDate(d.getDate() - 1);
                setCurrentDate(d);
              }}
            >
              昨日
            </Button>

          <Button
            variant="secondary"
            onClick={() => {
              const d = new Date(currentDate);
              d.setDate(d.getDate() + 1);
              setCurrentDate(d);
            }}
          >
            次日 →
          </Button>
        </div>

        <div
          style={{
            opacity: loading ? 0.4 : 1,
            pointerEvents: loading ? "none" : "auto",
            transition: "0.2s",
          }}
        >
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
              {visibleLogs.map((log, i) => (
                <tr key={log.uid + log.date}>
                <td style={tdStyle}>
                        {studentMap[log.uid] || "不明"}
                </td>

                  <td style={tdStyle}>
                    {log.studyTime
                      ? `${(log.studyTime / 60).toFixed(1)}h`
                      : ""}
                  </td>

                  <td style={tdStyle}>
                    {log.phoneTime
                      ? `${(log.phoneTime / 60).toFixed(1)}h`
                      : ""}
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
                {/* 未提出者 */}
        <div style={cardStyle}>
          <h2>未提出者</h2>

          {missingStudents.length === 0 ? (
            <p style={{ color: "green" }}>全員提出済み 🎉</p>
          ) : (
            <ul style={{ paddingLeft: 20 }}>
              {missingStudents.map((s) => (
                <li key={s.uid} style={{ color: "#ef4444" }}>
                  {s.name}
                </li>
              ))}
            </ul>
          )}
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