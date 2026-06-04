"use client";

import WeekHeader from "./WeekHeader";
import LogTable from "./LogTable";
import Button from "@/app/components/shared/Button";
import { downloadCsv } from "@/app/lib/csv/exportCsv";
import { createStudentCsv } from "@/app/lib/csv/createStudentCsv";
import { useState } from "react";

type Props = {
  selectedUid: string | null;
  studentMap: Record<string, string>;
  weekOffset: number;
  setWeekOffset: React.Dispatch<React.SetStateAction<number>>;
  week: { date: string }[];
  filteredLogs: any[];
  logs: any[];
  setHidden: (uid: string) => Promise<void>;
};

type Log = {
  uid: string;
  date: string;
  studyTime: number | null;
  phoneTime: number | null;
  sleepTime: string;
  satisfaction: string;
};

export default function StudentDetail({
  selectedUid,
  studentMap,
  weekOffset,
  setWeekOffset,
  week,
  filteredLogs,
  logs,
  setHidden,
}: Props) {
  const getThisWeekRange = () => {
    const now = new Date();
    const day = now.getDay();

    const monday = new Date(now);
    monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const format = (d: Date) => d.toISOString().split("T")[0];

    return {
      from: format(monday),
      to: format(sunday),
    };
  };

  const [showCsvModal, setShowCsvModal] = useState(false);

  const [fromDate, setFromDate] = useState(getThisWeekRange().from);
  const [toDate, setToDate] = useState(getThisWeekRange().to);

  const isInvalidRange =
  fromDate && toDate && new Date(fromDate) > new Date(toDate);

  if (!selectedUid) {
    return <p>👈 生徒を選択してください</p>;
  }

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20 }}>
          📊{" "}
          <span style={{ color: "#2563eb", fontWeight: 700 }}>
            {studentMap[selectedUid] ?? "不明な生徒"}
          </span>
          <span style={{ color: "#666" }}> の学習ログ</span>
        </h2>
      </div>

      <hr style={{ margin: "12px 0", borderColor: "#e5e7eb" }} />

      <WeekHeader
        weekOffset={weekOffset}
        setWeekOffset={setWeekOffset}
        week={week}
      />

      <LogTable
        filteredLogs={filteredLogs}
      />

      <div style={{ height: 24 }} />
        <Button
          variant="secondary"
          onClick={() => setShowCsvModal(true)}
        >
          CSV出力
        </Button>

      <div style={{ height: 24 }} />

        <Button
          variant="secondary"
          colorVariant="danger"
          onClick={() => setHidden(selectedUid)}
        >
          非表示にする
        </Button>

      {showCsvModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 8,
              minWidth: 320,
            }}
          >
            <h3>CSV出力</h3>

            <div style={{ marginTop: 16 }}>
              <label>開始日</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div style={{ marginTop: 16 }}>
              <label>終了日</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
                marginTop: 24,
              }}
            >
              <Button
                variant="secondary"
                onClick={() => setShowCsvModal(false)}
              >
                キャンセル
              </Button>

              <Button
                onClick={() => {
                  if (!fromDate || !toDate) {
                    alert("期間を選択してください");
                    return;
                  }

                  if (new Date(fromDate) > new Date(toDate)) {
                    alert("開始日は終了日より前にしてください");
                    return;
                  }

                  const csvLogs = logs.filter((log: Log) => {
                    const logDate = new Date(log.date);

                    return (
                      log.uid === selectedUid &&
                      logDate >= new Date(fromDate) &&
                      logDate <= new Date(toDate)
                    );
                  });

                  const rows = [
                    ["日付", "勉強時間", "スマホ", "睡眠", "満足度"],
                    ...csvLogs.map((log: Log) => [
                      log.date.split("T")[0],
                      String(log.studyTime ?? ""),
                      String(log.phoneTime ?? ""),
                      log.sleepTime ?? "",
                      log.satisfaction ?? "",
                    ]),
                  ];

                  downloadCsv(
                    `${studentMap[selectedUid]}_study_logs.csv`,
                    rows
                  );

                  setShowCsvModal(false);
                }}
              >
                出力
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}