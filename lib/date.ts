// app/lib/date.ts

export const formatDateForQuery = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
};

export const formatDateForDisplay = (date: Date | string) => {
  const d = typeof date === "string" ? new Date(date) : date;

  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");

  return `${mm}/${dd}`;
};

export const getWeekRange = (weekOffset: number) => {
  const now = new Date();

  const start = new Date(now);
  start.setDate(start.getDate() - start.getDay() + 1 + weekOffset * 7);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return { start, end };
};

  // =====================
  // 週生成
  // =====================
export function getWeekDates(offset = 0) {
  const today = new Date();

  const day = today.getDay();
  const diff = today.getDate() - (day === 0 ? 6 : day - 1);

  const monday = new Date(today);
  monday.setDate(diff + offset * 7);
  monday.setHours(0, 0, 0, 0);

  const week = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");

    week.push({
      date: `${yyyy}-${mm}-${dd}`,
    });
  }

  return week;
}