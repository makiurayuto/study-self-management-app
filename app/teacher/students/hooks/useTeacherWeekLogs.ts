import { getWeekDates } from "@/app/lib/date";

export function useTeacherWeekLogs({
  logs,
  selectedUid,
  weekOffset,
}: {
  logs: any[];
  selectedUid: string | null;
  weekOffset: number;
}) {
  const week = getWeekDates(weekOffset);

  const normalizeDate = (d: string) => d.split("T")[0];

  const weeklyLogs = logs.filter((l) => {
    return (
      l.uid === selectedUid &&
      week.some((w) => w.date === normalizeDate(l.date))
    );
  });

  const dedupedLogs = Array.from(
    new Map(
      weeklyLogs.map((log) => {
        const key = normalizeDate(log.date);
        return [key, log];
      })
    ).values()
  );

  return {
    week,
    filteredLogs: dedupedLogs,
  };
}