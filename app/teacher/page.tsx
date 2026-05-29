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
import DesktopTeacherDashboard from "@/app/components/desktop/TeacherDashboard";
import MobileTeacherDashboard from "@/app/components/mobile/TeacherDashboard";
import StudentTable from "@/app/components/desktop/StudentTable";


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
  const isMobile = window.innerWidth < 768;

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
      {/* ヘッダー */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h1>👨‍🏫 先生ダッシュボード</h1>

        <div style={{ display: "flex", gap: 8 }}>
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

          <Button
            variant="secondary"
            size="md"
            onClick={handleLogout}
          >
            ログアウト
          </Button>
        </div>
      </div>

      {/* 生徒一覧 */}
      <div style={cardStyle}>
        <Button
          variant="primary"
          size="md"
          onClick={() =>
            router.push("/teacher/students")
          }
        >
          生徒一覧
        </Button>

        <p>生徒数：{students.length}人</p>
      </div>

      {isMobile ? (
  <MobileTeacherDashboard
    logs={visibleLogs}
    studentMap={studentMap}
  />
) : (
  <StudentTable
    visibleLogs={visibleLogs}
    studentMap={studentMap}
  />
)}
{/* Desktop UI（ここが分離済み） */}
      <DesktopTeacherDashboard
        currentDateLabel={formatDateForDisplay(currentDate)}
        visibleLogs={visibleLogs}
        missingStudents={missingStudents}
        studentMap={studentMap}
        loading={loading}
        onPrevDay={() => {
          const d = new Date(currentDate);
          d.setDate(d.getDate() - 1);
          setCurrentDate(d);
        }}
        onNextDay={() => {
          const d = new Date(currentDate);
          d.setDate(d.getDate() + 1);
          setCurrentDate(d);
        }}
        onYesterday={() => {
          const d = new Date();
          d.setDate(d.getDate() - 1);
          setCurrentDate(d);
        }}
      />
    </div>
  );
}

// =========================
// style
// =========================

const cardStyle = {
  background: "#fff",
  border: "1px solid #ddd",
  borderRadius: 12,
  padding: 20,
  marginBottom: 24,
};