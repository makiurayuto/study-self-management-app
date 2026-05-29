"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import Button from "@/app/components/shared/Button";

type Log = {
  uid: string;
  date: string;
  studyTime: number | null;
  phoneTime: number | null;
  sleepTime: string;
  satisfaction: string;
};

export default function StudentPage() {
  const { uid } = useParams() as { uid: string };

  const [logs, setLogs] = useState<Log[]>([]);
  const [name, setName] = useState("");
  const [weekOffset, setWeekOffset] = useState(0);

  // =====================
  // 日付正規化（超重要）
  // =====================
    const normalizeDate = (value: string) => {
    if (!value) return "";

    return value.replaceAll("/", "-").split("T")[0];
    };

  // =====================
  // 名前取得
  // =====================
  const fetchName = async () => {
    const snap = await getDoc(doc(db, "users", uid));
    if (snap.exists()) {
      setName(snap.data().name || "名前なし");
    }
  };

  // =====================
  // ログ取得
  // =====================
  const fetchLogs = async () => {
    const q = query(
      collection(db, "weeklyLogs"),
      where("uid", "==", uid)
    );

    const snap = await getDocs(q);

    const list: Log[] = [];

    snap.forEach((d) => {
      list.push(d.data() as Log);
    });

    list.sort((a, b) =>
      normalizeDate(b.date).localeCompare(
        normalizeDate(a.date)
      )
    );

    setLogs(list);
  };

  // =====================
  // 週生成
  // =====================
  const getWeekDates = (offset = 0) => {
    const today = new Date();
    const day = today.getDay();

    const monday = new Date(today);
    monday.setDate(
      today.getDate() - (day === 0 ? 6 : day - 1)
    );

    monday.setDate(monday.getDate() + offset * 7);

    const week = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);

        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");

        const iso = `${yyyy}-${mm}-${dd}`;

      week.push({
        date: iso,
        dayName: ["日", "月", "火", "水", "木", "金", "土"][d.getDay()],
        displayDate: `${d.getMonth() + 1}/${d.getDate()}`,
      });
    }

    return week;
  };

  const weekDates = getWeekDates(weekOffset);

  // =====================
  // 初回読み込み
  // =====================
  useEffect(() => {
    if (!uid) return;
    fetchName();
    fetchLogs();
  }, [uid]);

  // =====================
  // UI
  // =====================
  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h1>生徒詳細</h1>

      <h2>👤 {name}</h2>

      {/* 週移動 */}
      <div
        style={{
          marginBottom: 10,
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="primary"
          size="md"
          onClick={() => setWeekOffset((p) => p - 1)}>
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
          onClick={() => setWeekOffset((p) => p + 1)}>
          次の週 →
        </Button>
      </div>

      {/* テーブル */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 12,
        }}
      >
        <thead>
          <tr>
            <th>日付</th>
            <th>曜日</th>
            <th>勉強</th>
            <th>スマホ</th>
            <th>睡眠</th>
            <th>満足度</th>
          </tr>
        </thead>

        <tbody>
          {weekDates.map((day) => {
            const log = logs.find(
            (l) =>
                normalizeDate(l.date) ===
                normalizeDate(day.date)
            );

            return (
              <tr key={day.date}>
                <td>{day.displayDate}</td>
                <td>{day.dayName}</td>

                {/* ✔️ ここが重要（未提出を確実表示） */}
                {log ? (
                  <>
                    <td>
                      {log.studyTime
                        ? `${(log.studyTime / 60).toFixed(1)}h`
                        : ""}
                    </td>
                    <td>
                      {log.phoneTime
                        ? `${(log.phoneTime / 60).toFixed(1)}h`
                        : ""}
                    </td>
                    <td>{log.sleepTime ?? ""}</td>
                    <td>{log.satisfaction ?? ""}</td>
                  </>
                ) : (
                  <td
                    colSpan={4}
                    style={{
                      textAlign: "center",
                      color: "#ef4444",
                      fontWeight: "bold",
                      background: "#fef2f2",
                    }}
                  >
                    ❌ 未提出
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}