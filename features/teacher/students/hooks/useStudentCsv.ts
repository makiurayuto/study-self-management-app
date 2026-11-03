import { useCallback } from "react";
import type { StudentDailyLog } from "@/types/student-log";

type Params = {
  logs: StudentDailyLog[];
  selectedUid: string | null;
  studentMap: Record<string, string>;
};

// "YYYY-MM-DD" → "MM/DD"
const formatMD = (date: string) => {
  const [, mm, dd] = date.split("T")[0].split("-");
  return `${mm}/${dd}`;
};

// カンマ・改行・ダブルクォートを含む値をエスケープ
const escapeCell = (value: string) =>
  /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;

export function useStudentCsv({
  logs,
  selectedUid,
  studentMap,
}: Params) {
  // 出力できなかった場合はエラーメッセージを返す
  const exportCsv = useCallback(
    (fromDate: string, toDate: string): string | null => {
      if (!selectedUid) return "生徒が選択されていません";
      if (!fromDate || !toDate) return "期間を選択してください";
      if (fromDate > toDate) return "開始日は終了日より前にしてください";

      const studentName = studentMap[selectedUid];

      const csvLogs = logs
        .filter(
          (log) =>
            log.uid === selectedUid &&
            log.date >= fromDate &&
            log.date <= toDate
        )
        .sort((a, b) => a.date.localeCompare(b.date));

      if (csvLogs.length === 0) return "この期間の記録はありません";

      // =====================
      // CSV本体
      // =====================
      const rows = [
        [`生徒名: ${studentName}`],
        [`期間: ${formatMD(fromDate)} 〜 ${formatMD(toDate)}`],
        [],
        ["日付", "勉強時間(分)", "スマホ時間(分)", "就寝時間", "満足度"],
        ...csvLogs.map((log) => [
          formatMD(log.date),
          String(log.studyTime ?? ""),
          String(log.phoneTime ?? ""),
          log.sleepTime ?? "",
          log.satisfaction ?? "",
        ]),
      ];

      const csv = rows.map((r) => r.map(escapeCell).join(",")).join("\n");

      // Excel対応（BOM付き）
      const bom = "﻿";
      const blob = new Blob([bom + csv], {
        type: "text/csv;charset=utf-8;",
      });

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${studentName}_study_logs_${fromDate}_to_${toDate}.csv`;
      a.click();

      URL.revokeObjectURL(url);
      return null;
    },
    [logs, selectedUid, studentMap]
  );

  return { exportCsv };
}
