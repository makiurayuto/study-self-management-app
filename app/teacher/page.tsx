"use client";

import { useEffect, useMemo, useState, useRef, useCallback } from "react";
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

import {
  buildTeacherSummary,
  createStudentMap,
  getMissingStudents,
} from "@/app/lib/log";

import DesktopTeacherDashboard from "@/app/components/features/teacher/desktop/TeacherDashboard";
import MobileTeacherDashboard from "@/app/components/features/teacher/mobile/TeacherDashboard";
import { formatDateForDisplay } from "@/app/lib/date";


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
// utils
// =========================

const getIsMobile = () =>
  typeof window !== "undefined" ? window.innerWidth < 768 : false;

// =========================
// コンポーネント
// =========================

export default function TeacherPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [hiddenStudents, setHiddenStudents] = useState<Student[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentDate, setCurrentDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d;
  });

  const [isMobile, setIsMobile] = useState<boolean>(getIsMobile());

  const router = useRouter();
  const { user, authLoading, logout } = useAuth();

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

  // =========================
  // 日付処理
  // =========================

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

  // =========================
  // データ整形
  // =========================

  const visibleStudents = students;
  const allStudents = [...students, ...hiddenStudents];

  const studentMap = useMemo(
    () => createStudentMap(allStudents),
    [allStudents]
  );

  const missingStudents = useMemo(
    () => getMissingStudents(visibleStudents, logs),
    [visibleStudents, logs]
  );

  const summary = useMemo(
    () => buildTeacherSummary(visibleStudents, logs),
    [visibleStudents, logs]
  );

  const visibleLogs = useMemo(() => {
    return logs.filter((log) =>
      visibleStudents.some((s) => s.uid === log.uid)
    );
  }, [logs, visibleStudents]);

  const currentDateLabel = formatDateForDisplay(currentDate);

  const changeDay = (diff: number) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + diff);
    setCurrentDate(d);
  };

  const onPrevDay = () => changeDay(-1);
  const onNextDay = () => changeDay(1);

  const onYesterday = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    setCurrentDate(d);
  };

  // =========================
  // モバイル判定
  // =========================

  useEffect(() => {
    const check = () => setIsMobile(getIsMobile());

    check();
    window.addEventListener("resize", check);

    return () => window.removeEventListener("resize", check);
  }, []);

  // =========================
  // 認証 + データ取得
  // =========================

  useEffect(() => {
    if (authLoading) return;

    if (!user || user.role !== "teacher") {
      router.push("/");
      return;
    }

    const date = formatDateForQuery(currentDate);
    fetchData(date);
  }, [user, authLoading, currentDate, fetchData]);

  // =========================
  // logout
  // =========================

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  // =========================
  // UI
  // =========================

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: 20,
        fontFamily: "sans-serif",
      }}
    >
      {/* ヘッダー */}
      <div style={{ marginBottom: 24 }}>
        {/* タイトル：中央 */}
        <h1
          style={{
            textAlign: "center",
            marginBottom: 16,
            fontSize: "28px", // ← 追加
            fontWeight: "bold",
          }}
        >
          👨‍🏫 先生ダッシュボード
        </h1>

        {/* 右：ボタン群 */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              fetchData(formatDateForQuery(currentDate))
            }
          >
            更新
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleLogout}
          >
            ログアウト
          </Button>
        </div>
      </div>

      {/* 生徒一覧 */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 20,
          marginBottom: 12,
        }}
      >
        <Button
          variant="primary"
          size="md"
          onClick={() => router.push("/teacher/students")}
        >
          生徒一覧
        </Button>

        <p style={{ marginTop: 12 }}>生徒数：{students.length}人</p>
      </div>

      {/* UI切替 */}
      {isMobile ? (
        <MobileTeacherDashboard
          logs={visibleLogs}
          missingStudents={missingStudents}
          studentMap={studentMap}

          currentDateLabel={currentDateLabel}
          onPrevDay={onPrevDay}
          onNextDay={onNextDay}
          onYesterday={onYesterday}
        />
      ) : (
        <DesktopTeacherDashboard
          currentDateLabel={formatDateForDisplay(currentDate)}
          visibleLogs={summary.submittedLogs}
          missingStudents={summary.missingStudents}
          studentMap={summary.studentMap}
          loading={loading}
          onPrevDay={onPrevDay}
          onNextDay={onNextDay}
          onYesterday={onYesterday}
        />
      )}
    </div>
  );
}