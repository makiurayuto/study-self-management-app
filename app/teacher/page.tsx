"use client";

import { useEffect, useState } from "react";
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

import { useTeacherData }
from "@/app/components/features/teacher/hooks/useTeacherData";

import DesktopTeacherDashboard from "@/app/components/features/teacher/desktop/TeacherDashboard";
import MobileTeacherDashboard from "@/app/components/features/teacher/mobile/TeacherDashboard";
import { formatDateForDisplay } from "@/app/lib/date";
import { formatDateForQuery } from "@/app/lib/date";


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

  const [currentDate, setCurrentDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d;
  });

  const [isMobile, setIsMobile] = useState<boolean>(getIsMobile());

  const router = useRouter();
  const { user, authLoading, logout } = useAuth();

  const {
    logs,
    loading,
    studentMap,
    missingStudents,
    visibleLogs,
  } = useTeacherData(formatDateForQuery(currentDate));
  

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
    width: "100%",
    padding: "20px 24px",
    boxSizing: "border-box",
  }}
>
      {/* ヘッダー */}
      <div style={{ marginBottom: 12 }}>
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
            onClick={() => {
              setCurrentDate(new Date(currentDate));
            }}
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

        <p style={{ marginTop: 12 }}>生徒数：{studentMap ? Object.keys(studentMap).length : 0}人</p>
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
          visibleLogs={visibleLogs}
          missingStudents={missingStudents}
          studentMap={studentMap}
          loading={loading}
          onPrevDay={onPrevDay}
          onNextDay={onNextDay}
          onYesterday={onYesterday}
        />
      )}
    </div>
  );
}