import { useState } from "react";
import { addDays, getToday } from "@/lib/date";

// 表示する日付（"YYYY-MM-DD"）。初期値は昨日
export function useTeacherDashboard() {
  const today = getToday();
  const yesterday = addDays(today, -1);

  const [date, setDate] = useState(yesterday);

  return {
    date,
    isToday: date === today,
    isYesterday: date === yesterday,
    onPrevDay: () => setDate((d) => addDays(d, -1)),
    onNextDay: () => setDate((d) => (d < today ? addDays(d, 1) : d)),
    onYesterday: () => setDate(yesterday),
    onToday: () => setDate(today),
  };
}
