// app/lib/date.ts

export const formatDateForQuery = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
};

export const formatDateForDisplay = (date: Date) => {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

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