export const timeToMinutes = (time: string) => {
  if (!time) return 0;

  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

export const minutesToTime = (min: number) => {
  const total = ((min % 1440) + 1440) % 1440;

  const h = String(Math.floor(total / 60)).padStart(2, "0");
  const m = String(total % 60).padStart(2, "0");

  return `${h}:${m}`;
};

// 150 → "2時間30分"
export const formatDuration = (min: number) => {
  const h = Math.floor(min / 60);
  const m = min % 60;

  if (h === 0) return `${m}分`;
  if (m === 0) return `${h}時間`;
  return `${h}時間${m}分`;
};

// 150 → "2.5h"
export const formatHours = (min: number | null) => {
  if (min == null) return "";
  return `${(min / 60).toFixed(1)}h`;
};
