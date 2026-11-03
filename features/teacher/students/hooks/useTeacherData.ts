"use client";

import { useMemo } from "react";
import type { AppUser } from "@/lib/auth/AuthContext";
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
  // students / logs取得
  // ========================
  const {
    students,
    hiddenStudents,
    logs,
    loading,
    fetchData,
  } = useTeacherStudents(user, authLoading);

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

    // ui
    studentMap,
    week,
    filteredLogs,

    // state
    loading: loading || authLoading,

    // actions
    fetchData,
  };
}
