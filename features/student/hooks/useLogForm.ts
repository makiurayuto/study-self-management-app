"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { StudentDailyLog } from "@/types/student-log";
import { minutesToTime, timeToMinutes } from "@/lib/time";

export type LogFormValues = {
  studyTime: string; // "HH:MM"
  phoneTime: string; // "HH:MM"
  sleepTime: string; // "HH:MM"
  satisfaction: string;
};

export type LogFormField = keyof LogFormValues;

export const FIELD_LABELS: Record<LogFormField, string> = {
  studyTime: "勉強時間",
  phoneTime: "スマホ時間",
  sleepTime: "就寝時間",
  satisfaction: "満足度",
};

const FIELDS = Object.keys(FIELD_LABELS) as LogFormField[];

export type Feedback = {
  type: "success" | "error";
  text: string;
} | null;

const toValues = (log: StudentDailyLog | null): LogFormValues => ({
  studyTime: log?.studyTime != null ? minutesToTime(log.studyTime) : "",
  phoneTime: log?.phoneTime != null ? minutesToTime(log.phoneTime) : "",
  sleepTime: log?.sleepTime ?? "",
  satisfaction: log?.satisfaction ?? "",
});

type Params = {
  uid: string | undefined;
  date: string;
  savedLog: StudentDailyLog | null;
  loading: boolean;
  saveLog: (log: StudentDailyLog) => Promise<void>;
};

export function useLogForm({ uid, date, savedLog, loading, saveLog }: Params) {
  const [values, setValues] = useState<LogFormValues>(() => toValues(savedLog));
  const [saving, setSaving] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  // 日付が変わった / 読み込みが終わったら保存済みの内容を反映
  const formKey = `${date}:${loading}`;
  const [currentKey, setCurrentKey] = useState(formKey);

  if (currentKey !== formKey) {
    setCurrentKey(formKey);
    setValues(toValues(savedLog));
    setShowErrors(false);
    setFeedback(null);
  }

  const savedValues = toValues(savedLog);
  const isDirty = FIELDS.some((f) => values[f] !== savedValues[f]);
  const missingFields = FIELDS.filter((f) => !values[f]);

  const setField = useCallback((field: LogFormField, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setFeedback(null);
  }, []);

  // 成功メッセージは少し経ったら消す
  const feedbackTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    };
  }, []);

  const submit = async () => {
    if (!uid || saving) return;

    if (missingFields.length > 0) {
      setShowErrors(true);
      setFeedback({
        type: "error",
        text: `${missingFields.map((f) => FIELD_LABELS[f]).join("・")}が未入力です`,
      });
      return;
    }

    setSaving(true);
    setFeedback(null);

    try {
      await saveLog({
        uid,
        date,
        studyTime: timeToMinutes(values.studyTime),
        phoneTime: timeToMinutes(values.phoneTime),
        sleepTime: values.sleepTime,
        satisfaction: values.satisfaction,
      });

      setShowErrors(false);
      setFeedback({ type: "success", text: "✅ 保存しました" });

      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
      feedbackTimer.current = setTimeout(() => setFeedback(null), 2500);
    } catch (e) {
      console.error("保存失敗", e);
      setFeedback({
        type: "error",
        text: "保存に失敗しました。通信状況を確認してもう一度お試しください",
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    values,
    setField,
    isDirty,
    isSaved: !!savedLog,
    missingFields: showErrors ? missingFields : [],
    saving,
    feedback,
    submit,
  };
}
