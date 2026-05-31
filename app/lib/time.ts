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

export const addMinutes = (time: string, diff: number) => {
  if (!time) time = "00:00";

  const [h, m] = time.split(":").map(Number);

  let total = h * 60 + m + diff;
  total = ((total % 1440) + 1440) % 1440;

  const hh = Math.floor(total / 60);
  const mm = total % 60;

  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
};