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
  selectedUid: string;
  fromDate: string;
  toDate: string;
  studentName: string;
};

export function exportStudentCsv({
  logs,
  selectedUid,
  fromDate,
  toDate,
  studentName,
}: Params) {
  const csvLogs = logs.filter((log) => {
    const logDate = new Date(log.date);

    return (
      log.uid === selectedUid &&
      logDate >= new Date(fromDate) &&
      logDate <= new Date(toDate)
    );
  });

  const rows = [
    ["日付", "勉強時間", "スマホ", "睡眠", "満足度"],
    ...csvLogs.map((log) => [
      log.date.split("T")[0],
      String(log.studyTime ?? ""),
      String(log.phoneTime ?? ""),
      log.sleepTime ?? "",
      log.satisfaction ?? "",
    ]),
  ];

  const csv = rows.map((r) => r.join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${studentName}_study_logs.csv`;
  a.click();

  URL.revokeObjectURL(url);
}