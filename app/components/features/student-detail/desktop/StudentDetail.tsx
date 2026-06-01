"use client";

import Button from "@/app/components/shared/Button";
import WeeklyTable from "../shared/WeeklyTable";
import { Log } from "../hooks/useStudentDetail";
import { Dispatch, SetStateAction } from "react";

type WeekDate = {
  date: string;
  dayName: string;
  displayDate: string;
};

type Props = {
  name: string;
  logs: Log[];
  weekDates: WeekDate[];
  setWeekOffset: Dispatch<SetStateAction<number>>;
};

export default function StudentDetail({
  name,
  logs,
  weekDates,
  setWeekOffset,
}: Props) {
  return (
    <div style={{ padding: 20 }}>
      <h1>生徒詳細</h1>

      <h2>👤 {name}</h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <Button
          variant="primary"
          size="md"
          onClick={() => setWeekOffset((p) => p - 1)}
        >
          ← 前の週
        </Button>

        <Button
          variant="primary"
          size="md"
          onClick={() => setWeekOffset(0)}
        >
          今週
        </Button>

        <Button
          variant="primary"
          size="md"
          onClick={() => setWeekOffset((p) => p + 1)}
        >
          次の週 →
        </Button>
      </div>

      <WeeklyTable logs={logs} weekDates={weekDates} />
    </div>
  );
}