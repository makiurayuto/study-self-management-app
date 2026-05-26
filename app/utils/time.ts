// app/utils/time.ts

// ==============================
// 時間 → 分
// "02:30" → 150
// ==============================
export const timeToMinutes = (time: string) => {
  if (!time) return 0;

  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

// ==============================
// 分 → 時間
// 150 → "02:30"
// ==============================
export const minutesToTime = (min: number) => {
  const total = ((min % 1440) + 1440) % 1440;

  const h = String(Math.floor(total / 60)).padStart(2, "0");
  const m = String(total % 60).padStart(2, "0");

  return `${h}:${m}`;
};

// ==============================
// 時間 ± 分（今回のメイン）
// "02:30" + 15 → "02:45"
// ==============================
export const addMinutes = (time: string, diff: number) => {
  if (!time) time = "00:00";

  const [h, m] = time.split(":").map(Number);

  let total = h * 60 + m + diff;

  // 0〜1440でループ（24時間循環）
  total = ((total % 1440) + 1440) % 1440;

  const hh = Math.floor(total / 60);
  const mm = total % 60;

  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
};