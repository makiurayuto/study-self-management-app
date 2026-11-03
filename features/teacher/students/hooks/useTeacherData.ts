"use client";

import { useEffect, useMemo, useState } from "react";
import type { AppUser } from "@/lib/auth/AuthContext";
import { getWeekDates } from "@/lib/date";
import { fetchLogsInRange } from "@/lib/logService";
import { useStudentLogs } from "@/features/student/hooks/useStudentLogs";
import { useTeacherStudents } from "./useTeacherStudents";
import { useTeacherWeekLogs } from "./useTeacherWeekLogs";

type Props = {
  user: AppUser | null;
  authLoading: boolean;
  selectedUid: string | null;
  weekOffset: number;
};

export function useTeacherData({
  user,
  authLoading,
  selectedUid,
  weekOffset,
}: Props) {
  // ========================
  // students取得
  // ========================
  const {
    students,
    hiddenStudents,
    loading,
    fetchData,
  } = useTeacherStudents(user, authLoading);

  // ========================
  // 選択中の生徒のログ（CSV出力にも使うので全期間）
  // ========================
  const {
    logs,
    loading: logsLoading,
  } = useStudentLogs(selectedUid ?? undefined);

  // ========================
  // week logs
  // ========================
  const { week, filteredLogs } =
    useTeacherWeekLogs({
      logs,
      selectedUid,
      weekOffset,
    });

  // ========================
  // 今週の記録日数（一覧のバッジ用）
  // ========================
  const weekCounts = useWeekCounts(user?.uid);

  // ========================
  // student map（UI用）
  // ========================
  const studentMap = useMemo(() => {
    return Object.fromEntries(
      [...students, ...hiddenStudents].map((s) => [
        s.uid,
        s.name,
      ])
    );
  }, [students, hiddenStudents]);

  return {
    // data
    students,
    logs,
    weekCounts,

    // ui
    studentMap,
    week,
    filteredLogs,

    // state
    loading: loading || authLoading,
    logsLoading,

    // actions
    fetchData,
  };
}

// 今週の各生徒の記録日数
function useWeekCounts(uid: string | undefined) {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!uid) return;

    const week = getWeekDates(0);

    fetchLogsInRange(week[0].date, week[6].date)
      .then((logs) => {
        const next: Record<string, number> = {};

        for (const log of logs) {
          next[log.uid] = (next[log.uid] ?? 0) + 1;
        }

        setCounts(next);
      })
      .catch((e) => console.error("今週のログ読込失敗", e));
  }, [uid]);

  return counts;
}
