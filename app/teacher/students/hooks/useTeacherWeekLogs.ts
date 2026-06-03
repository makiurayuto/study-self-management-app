import { useMemo } from "react";
import { getWeekDates } from "@/app/lib/date";

type Log = {
  uid: string;
  date: string;
  studyTime: number | null;
  phoneTime: number | null;
  sleepTime: string;
  satisfaction: string;
};

type Props = {
  logs: Log[];
  selectedUid: string | null;
  weekOffset: number;
};

export function useTeacherWeekLogs({
  logs,
  selectedUid,
  weekOffset,
}: Props) {
  // 週生成
  const week = useMemo(() => {
    return getWeekDates(weekOffset);
  }, [weekOffset]);

  // 日付範囲（必要なら残す）
  const start = week[0].date;
  const end = week[6].date;

  // 正規化（今は未使用でもOK、将来用）
  const normalize = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());

  // フィルタ済みログ
  const filteredLogs = useMemo(() => {
    if (!selectedUid) return [];

    return logs.filter((l) => {
      const logDate = l.date.split("T")[0];

      return (
        l.uid === selectedUid &&
        week.some((w) => w.date === logDate)
      );
    });
  }, [logs, selectedUid, week]);

  return {
    week,
    filteredLogs,
    start,
    end,
  };
}