// "YYYY-MM-DD"
export const formatDateForQuery = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
};

// "MM/DD"
export const formatDateForDisplay = (date: Date | string) => {
  const d = typeof date === "string" ? new Date(date) : date;

  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");

  return `${mm}/${dd}`;
};

const DAY_NAMES = ["日", "月", "火", "水", "木", "金", "土"];

export type WeekDate = {
  date: string; // YYYY-MM-DD
  dayName: string; // 曜日
  displayDate: string; // "3日"
};

// =====================
// 週生成（月曜始まり）
// =====================
export function getWeekDates(offset = 0): WeekDate[] {
  const today = new Date();

  const day = today.getDay();
  const diff = today.getDate() - (day === 0 ? 6 : day - 1);

  const monday = new Date(today);
  monday.setDate(diff + offset * 7);
  monday.setHours(0, 0, 0, 0);

  const week: WeekDate[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);

    week.push({
      date: formatDateForQuery(d),
      dayName: DAY_NAMES[d.getDay()],
      displayDate: d.getDate() + "日",
    });
  }

  return week;
}

// 今日の "YYYY-MM-DD"（ローカル時刻）
export const getToday = () => formatDateForQuery(new Date());

// "YYYY-MM-DD" → ローカル時刻の Date
export const parseDate = (date: string) => {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const addDays = (date: string, diff: number) => {
  const d = parseDate(date);
  d.setDate(d.getDate() + diff);
  return formatDateForQuery(d);
};

const getMonday = (date: Date) => {
  const monday = new Date(date);
  const day = monday.getDay();
  monday.setDate(monday.getDate() - (day === 0 ? 6 : day - 1));
  monday.setHours(0, 0, 0, 0);
  return monday;
};

// 今週を 0 としたときの、date を含む週の offset
export const getWeekOffset = (date: string) => {
  const diff =
    getMonday(parseDate(date)).getTime() - getMonday(new Date()).getTime();

  return Math.round(diff / (7 * 24 * 60 * 60 * 1000));
};

// "11/3(月)"
export const formatDateWithDay = (date: string) => {
  const d = parseDate(date);
  return `${d.getMonth() + 1}/${d.getDate()}(${DAY_NAMES[d.getDay()]})`;
};
