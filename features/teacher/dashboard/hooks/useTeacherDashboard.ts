import { useState } from "react";

export function useTeacherDashboard() {
  const [currentDate, setCurrentDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d;
  });

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

  return {
    currentDate,
    setCurrentDate,
    onPrevDay,
    onNextDay,
    onYesterday,
  };
}