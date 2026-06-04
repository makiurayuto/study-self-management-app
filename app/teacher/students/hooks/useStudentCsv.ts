import { useCallback } from "react";

type Log = {
  uid: string;
  date: string;
  studyTime: number | null;
  phoneTime: number | null;
  sleepTime: string;
  satisfaction: string;
};

type Params = {
  logs: Log[];
  selectedUid: string | null;
  studentMap: Record<string, string>;
};

export function useStudentCsv({
  logs,
  selectedUid,
  studentMap,
}: Params) {
  const exportCsv = useCallback(
    (fromDate: string, toDate: string) => {
      if (!selectedUid) {
        alert("生徒が選択されていません");
        return;
      }

      if (!fromDate || !toDate) {
        alert("期間を選択してください");
        return;
      }

      if (new Date(fromDate) > new Date(toDate)) {
        alert("開始日は終了日より前にしてください");
        return;
      }

      const studentName = studentMap[selectedUid];

      const csvLogs = logs.filter((log) => {
        const logDate = new Date(log.date);

        return (
          log.uid === selectedUid &&
          logDate >= new Date(fromDate) &&
          logDate <= new Date(toDate)
        );
      });

      const formatMD = (date: string) => {
        const d = date.includes("T") ? date.split("T")[0] : date;
        const [, mm, dd] = d.split("-");
        return `${mm}/${dd}`;
      };

      // =====================
      // CSV本体
      // =====================
      const rows = [
        [`生徒名: ${studentName}`],
        [`期間: ${formatMD(fromDate)} 〜 ${formatMD(toDate)}`],
        [],
        ["日付", "勉強時間", "スマホ", "睡眠", "満足度"],
        ...csvLogs.map((log) => [
          formatMD(log.date),
          String(log.studyTime ?? ""),
          String(log.phoneTime ?? ""),
          log.sleepTime ?? "",
          log.satisfaction ?? "",
        ]),
      ];

      const csv = rows.map((r) => r.join(",")).join("\n");

      // =====================
      // Excel対応（BOM付き）
      // =====================
      const bom = "\uFEFF";
      const blob = new Blob([bom + csv], {
        type: "text/csv;charset=utf-8;",
      });

      const url = URL.createObjectURL(blob);

      // =====================
      // ファイル名（期間付き）
      // =====================
      const fileName = `${studentName}_${fromDate}_to_${toDate}.csv`;

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();

      URL.revokeObjectURL(url);
    },
    [logs, selectedUid, studentMap]
  );

  return { exportCsv };
}