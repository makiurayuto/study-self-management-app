"use client";

import { useEffect, useMemo, useState } from "react";
import { getWeekDates } from "@/app/lib/date";
import { useTeacherStudents } from "./useTeacherStudents";
import { useTeacherWeekLogs } from "./useTeacherWeekLogs";
import { useTeacherActions } from "./useTeacherActions";

type User = {
  role?: string;
} | null;

type Props = {
  user: User;
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
  // actions
  // ========================
  const { hideStudent, unhideStudent } =
    useTeacherActions(fetchData);

  // ========================
  // week logs
  // ========================
  const { week, filteredLogs, start, end } =
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

  // ========================
  // loading合成
  // ========================
  const isLoading = loading || authLoading;

  return {
    // data
    students,
    hiddenStudents,
    logs,

    // ui
    studentMap,
    week,
    filteredLogs,
    start,
    end,

    // state
    loading: isLoading,

    // actions
    fetchData,
    hideStudent,
    unhideStudent,
  };
}