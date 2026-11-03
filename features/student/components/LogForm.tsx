"use client";

import Button from "@/components/shared/Button";
import { colors } from "@/components/shared/styles";
import TimeControl from "@/features/time/components/TimeControl";
import SleepTimeField from "./SleepTimeField";
import SatisfactionPicker from "./SatisfactionPicker";
import type { useLogForm } from "../hooks/useLogForm";

type Props = {
  form: ReturnType<typeof useLogForm>;
};

export default function LogForm({ form }: Props) {
  const {
    values,
    setField,
    isDirty,
    isSaved,
    missingFields,
    saving,
    feedback,
    submit,
  } = form;

  const isMissing = (f: (typeof missingFields)[number]) => missingFields.includes(f);

  const status = (() => {
    if (isDirty) return { text: "未保存の変更があります", color: "#d97706" };
    if (isSaved) return { text: "✓ 保存済み", color: colors.success };
    return { text: "未記録", color: colors.muted };
  })();

  return (
    <>
      <TimeControl
        label="📚 勉強時間"
        value={values.studyTime}
        setValue={(v) => setField("studyTime", v)}
        invalid={isMissing("studyTime")}
      />

      <TimeControl
        label="📱 スマホ時間"
        value={values.phoneTime}
        setValue={(v) => setField("phoneTime", v)}
        invalid={isMissing("phoneTime")}
      />

      <SleepTimeField
        value={values.sleepTime}
        onChange={(v) => setField("sleepTime", v)}
        invalid={isMissing("sleepTime")}
      />

      <SatisfactionPicker
        value={values.satisfaction}
        onChange={(v) => setField("satisfaction", v)}
        invalid={isMissing("satisfaction")}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {feedback && (
          <div
            role="status"
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              background: `${feedback.type === "success" ? colors.success : colors.danger}15`,
              color: feedback.type === "success" ? colors.success : colors.danger,
              fontWeight: 600,
              animation: "fade-in 0.15s ease",
            }}
          >
            {feedback.text}
          </div>
        )}

        <div style={{ textAlign: "center", fontSize: 13, color: status.color, fontWeight: 600 }}>
          {status.text}
        </div>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={submit}
          disabled={saving || (isSaved && !isDirty)}
        >
          {saving ? "保存中…" : isSaved ? "更新する" : "保存する"}
        </Button>
      </div>
    </>
  );
}
