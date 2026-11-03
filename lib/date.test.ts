import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  addDays,
  formatDateForQuery,
  formatDateWithDay,
  getToday,
  getWeekDates,
  getWeekOffset,
  parseDate,
} from "./date";

describe("date", () => {
  // 2026-11-04（水）を「今日」に固定
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 4, 10, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("getToday はローカル日付の YYYY-MM-DD", () => {
    expect(getToday()).toBe("2026-11-04");
  });

  it("formatDateForQuery はゼロ埋めする", () => {
    expect(formatDateForQuery(new Date(2026, 0, 5))).toBe("2026-01-05");
  });

  it("parseDate はローカル時刻で解釈する（UTC にずれない）", () => {
    const d = parseDate("2026-11-04");
    expect([d.getFullYear(), d.getMonth(), d.getDate()]).toEqual([2026, 10, 4]);
  });

  it("addDays は月・年をまたげる", () => {
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
    expect(addDays("2024-03-01", -1)).toBe("2024-02-29");
    expect(addDays("2025-12-31", 1)).toBe("2026-01-01");
  });

  it("getWeekDates は月曜始まりの7日間", () => {
    const week = getWeekDates(0);

    expect(week).toHaveLength(7);
    expect(week[0]).toEqual({ date: "2026-11-02", dayName: "月", displayDate: "2日" });
    expect(week[6]).toEqual({ date: "2026-11-08", dayName: "日", displayDate: "8日" });
  });

  it("日曜日は前の月曜からの週に含まれる", () => {
    vi.setSystemTime(new Date(2026, 10, 8, 10, 0));
    expect(getWeekDates(0)[0].date).toBe("2026-11-02");
  });

  it("getWeekDates の offset で前後の週", () => {
    expect(getWeekDates(-1)[0].date).toBe("2026-10-26");
    expect(getWeekDates(1)[0].date).toBe("2026-11-09");
  });

  it("getWeekOffset は getWeekDates の逆", () => {
    for (let offset = -10; offset <= 2; offset++) {
      for (const day of getWeekDates(offset)) {
        expect(getWeekOffset(day.date)).toBe(offset);
      }
    }
  });

  it("formatDateWithDay", () => {
    expect(formatDateWithDay("2026-11-04")).toBe("11/4(水)");
  });
});
