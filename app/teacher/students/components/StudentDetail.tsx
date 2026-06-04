"use client";

import WeekHeader from "./WeekHeader";
import LogTable from "./LogTable";
import Button from "@/app/components/shared/Button";
import { downloadCsv } from "@/app/lib/csv/exportCsv";
import { createStudentCsv } from "@/app/lib/csv/createStudentCsv";
import { useState } from "react";
import { useStudentCsv } from "../hooks/useStudentCsv";

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

  const [showCsvModal, setShowCsvModal] = useState(false);

  const getThisWeekStart = () => {
    const now = new Date();
    const day = now.getDay(); // 0=日

    const monday = new Date(now);
    monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));

    return monday.toISOString().split("T")[0];
  };
  const [fromDate, setFromDate] = useState(getThisWeekStart());
  
  const getToday = () => {
    return new Date().toISOString().split("T")[0];
  };
  const [toDate, setToDate] = useState(getToday());

  const { exportCsv } = useStudentCsv({
    logs,
    selectedUid,
    studentMap,
  });

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
          colorVariant="success"
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
            <h3>期間を入力してください</h3>

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
                colorVariant="success"
                onClick={() => setShowCsvModal(false)}
              >
                キャンセル
              </Button>

              <Button
                colorVariant="success"
                onClick={() => {
                  exportCsv(fromDate, toDate);
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