import { describe, expect, it } from "vitest";
import { formatDuration, formatHours, minutesToTime, timeToMinutes } from "./time";

describe("time", () => {
  it("timeToMinutes", () => {
    expect(timeToMinutes("02:30")).toBe(150);
    expect(timeToMinutes("00:00")).toBe(0);
    expect(timeToMinutes("")).toBe(0);
  });

  it("minutesToTime", () => {
    expect(minutesToTime(150)).toBe("02:30");
    expect(minutesToTime(0)).toBe("00:00");
    expect(minutesToTime(1439)).toBe("23:59");
  });

  it("timeToMinutes と minutesToTime は往復できる", () => {
    for (let m = 0; m < 1440; m++) {
      expect(timeToMinutes(minutesToTime(m))).toBe(m);
    }
  });

  it("formatDuration", () => {
    expect(formatDuration(0)).toBe("0分");
    expect(formatDuration(45)).toBe("45分");
    expect(formatDuration(120)).toBe("2時間");
    expect(formatDuration(150)).toBe("2時間30分");
  });

  it("formatHours", () => {
    expect(formatHours(90)).toBe("1.5h");
    expect(formatHours(0)).toBe("0.0h");
    expect(formatHours(null)).toBe("");
  });
});
