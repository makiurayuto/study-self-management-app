"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/shared/Button";
import Modal from "@/components/shared/Modal";
import Skeleton from "@/components/shared/Skeleton";
import { colors } from "@/components/shared/styles";
import { useAuth } from "@/lib/auth/AuthContext";
import { updateStudentName } from "@/lib/user/updateStudentName";
import { getToday, getWeekOffset } from "@/lib/date";
import { useStudentLogs } from "./hooks/useStudentLogs";
import { useLogForm } from "./hooks/useLogForm";
import StudentHeader from "./components/StudentHeader";
import NameEditModal from "@/components/shared/NameEditModal";
import DateSelector from "./components/DateSelector";
import LogForm from "./components/LogForm";
import WeekTable from "./components/WeekTable";

export default function StudentPage() {
  const { user, authLoading, logout } = useAuth();
  const router = useRouter();

  const { logs, loading, loadError, saveLog } = useStudentLogs(user?.uid);

  const [date, setDate] = useState(getToday);
  const [weekOffset, setWeekOffset] = useState(0);
  const [showNameEdit, setShowNameEdit] = useState(false);
  // 未保存の変更がある状態で移動しようとした日付
  const [pendingDate, setPendingDate] = useState<string | null>(null);

  const savedLog = logs.find((l) => l.date === date) ?? null;

  const form = useLogForm({
    uid: user?.uid,
    date,
    savedLog,
    loading,
    saveLog,
  });

  // 未ログイン / 名前未登録はトップへ（振り分けは / が行う）
  useEffect(() => {
    if (authLoading) return;
    if (!user || !user.name) router.replace("/");
  }, [user, authLoading, router]);

  const moveToDate = (next: string) => {
    setDate(next);
    setWeekOffset(getWeekOffset(next));
  };

  const handleDateChange = (next: string) => {
    if (next === date) return;

    if (form.isDirty) {
      setPendingDate(next);
      return;
    }

    moveToDate(next);
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  if (authLoading || !user?.name) {
    return (
      <div style={pageStyle}>
        <PageSkeleton />
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <StudentHeader
        name={user.name}
        onEditName={() => setShowNameEdit(true)}
        onLogout={handleLogout}
      />

      <NameEditModal
        open={showNameEdit}
        currentName={user.name}
        onClose={() => setShowNameEdit(false)}
        onSave={(name) => updateStudentName(user.uid, name)}
      />

      {loadError && (
        <div
          role="alert"
          style={{
            margin: "8px 0",
            padding: "10px 12px",
            borderRadius: 10,
            background: `${colors.danger}15`,
            color: colors.danger,
            fontSize: 14,
          }}
        >
          記録の読み込みに失敗しました。ページを再読み込みしてください。
        </div>
      )}

      <main style={{ display: "flex", flexDirection: "column", gap: 16, padding: "8px 0 80px" }}>
        <DateSelector date={date} onChange={handleDateChange} />

        {loading ? (
          <>
            <Skeleton height={180} radius={16} />
            <Skeleton height={180} radius={16} />
            <Skeleton height={100} radius={16} />
          </>
        ) : (
          <LogForm form={form} />
        )}

        <WeekTable
          logs={logs}
          weekOffset={weekOffset}
          setWeekOffset={setWeekOffset}
          selectedDate={date}
          onSelectDate={handleDateChange}
        />
      </main>

      {/* 未保存の変更の確認 */}
      <Modal
        open={pendingDate !== null}
        onClose={() => setPendingDate(null)}
        title="保存していない変更があります"
      >
        <p style={{ margin: "0 0 16px", fontSize: 14 }}>
          変更を破棄して日付を移動しますか？
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Button variant="secondary" colorVariant="gray" onClick={() => setPendingDate(null)}>
            戻る
          </Button>
          <Button
            variant="primary"
            colorVariant="danger"
            onClick={() => {
              if (pendingDate) moveToDate(pendingDate);
              setPendingDate(null);
            }}
          >
            破棄して移動
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 24 }}>
      <Skeleton height={28} width="60%" />
      <Skeleton height={20} width="40%" />
      <Skeleton height={110} radius={16} />
      <Skeleton height={180} radius={16} />
      <Skeleton height={180} radius={16} />
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "var(--bg)",
  color: "var(--text)",
  padding: "0 16px",
  maxWidth: 560,
  margin: "0 auto",
  boxSizing: "border-box",
  width: "100%",
};
