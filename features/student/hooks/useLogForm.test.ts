// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useLogForm } from "./useLogForm";
import type { StudentDailyLog } from "@/types/student-log";

const savedLog: StudentDailyLog = {
  uid: "alice",
  date: "2026-11-03",
  studyTime: 150,
  phoneTime: 60,
  sleepTime: "23:00",
  satisfaction: "○",
};

type Props = Parameters<typeof useLogForm>[0];

const setup = (props: Partial<Props> = {}) => {
  const saveLog = vi.fn<(log: StudentDailyLog) => Promise<void>>().mockResolvedValue();

  const initialProps: Props = {
    uid: "alice",
    date: "2026-11-03",
    savedLog: null,
    loading: false,
    saveLog,
    ...props,
  };

  const hook = renderHook((p: Props) => useLogForm(p), { initialProps });
  return { ...hook, saveLog, initialProps };
};

describe("useLogForm", () => {
  it("保存済みのログをフォームに反映する", () => {
    const { result } = setup({ savedLog });

    expect(result.current.values).toEqual({
      studyTime: "02:30",
      phoneTime: "01:00",
      sleepTime: "23:00",
      satisfaction: "○",
    });
    expect(result.current.isSaved).toBe(true);
    expect(result.current.isDirty).toBe(false);
  });

  it("編集すると未保存（dirty）になる", () => {
    const { result } = setup({ savedLog });

    act(() => result.current.setField("studyTime", "03:00"));

    expect(result.current.isDirty).toBe(true);
  });

  it("未入力があると保存せず、未入力の項目を返す", async () => {
    const { result, saveLog } = setup();

    act(() => result.current.setField("studyTime", "01:00"));
    await act(() => result.current.submit());

    expect(saveLog).not.toHaveBeenCalled();
    expect(result.current.missingFields).toEqual(["phoneTime", "sleepTime", "satisfaction"]);
    expect(result.current.feedback?.type).toBe("error");
  });

  it("0時間（00:00）は入力済みとして保存できる", async () => {
    const { result, saveLog } = setup();

    act(() => {
      result.current.setField("studyTime", "00:00");
      result.current.setField("phoneTime", "00:00");
      result.current.setField("sleepTime", "22:00");
      result.current.setField("satisfaction", "△");
    });
    await act(() => result.current.submit());

    expect(saveLog).toHaveBeenCalledWith({
      uid: "alice",
      date: "2026-11-03",
      studyTime: 0,
      phoneTime: 0,
      sleepTime: "22:00",
      satisfaction: "△",
    });
    expect(result.current.feedback?.type).toBe("success");
  });

  it("保存後も入力内容は残る", async () => {
    const { result } = setup({ savedLog });

    act(() => result.current.setField("studyTime", "04:00"));
    await act(() => result.current.submit());

    expect(result.current.values.studyTime).toBe("04:00");
  });

  it("保存に失敗したらエラーを表示する", async () => {
    const { result, saveLog } = setup({ savedLog });
    saveLog.mockRejectedValueOnce(new Error("permission-denied"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    act(() => result.current.setField("studyTime", "04:00"));
    await act(() => result.current.submit());

    expect(result.current.feedback?.type).toBe("error");
    expect(result.current.saving).toBe(false);
  });

  it("日付が変わるとその日の保存内容に切り替わる", () => {
    const { result, rerender, initialProps } = setup({ savedLog });

    act(() => result.current.setField("studyTime", "05:00"));
    rerender({ ...initialProps, date: "2026-11-04", savedLog: null });

    expect(result.current.values.studyTime).toBe("");
    expect(result.current.isSaved).toBe(false);
  });

  it("読み込み完了時に保存内容を反映する", () => {
    const { result, rerender, initialProps } = setup({ loading: true });

    expect(result.current.values.studyTime).toBe("");

    rerender({ ...initialProps, loading: false, savedLog });

    expect(result.current.values.studyTime).toBe("02:30");
  });
});
