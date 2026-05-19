"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/firebase";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  // 入力
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [studyTime, setStudyTime] = useState("");
  const [phoneTime, setPhoneTime] = useState("");
  const [sleepTime, setSleepTime] = useState("");
  const [satisfaction, setSatisfaction] = useState("");

  // データ一覧
  const [logs, setLogs] = useState<any[]>([]);

  // Googleログイン
  const login = async () => {
    const provider = new GoogleAuthProvider();

    const result = await signInWithPopup(auth, provider);

    setUser(result.user);
  };

  // ログアウト
  const logout = async () => {
    await signOut(auth);

    setUser(null);

    setLogs([]);
  };

  // 保存
  const saveData = async () => {
    if (!user) {
      alert("ログインしてください");
      return;
    }

    try {
      await addDoc(collection(db, "weeklyLogs"), {
        uid: user.uid,

        date: date,

        studyTime: Number(studyTime),

        phoneTime: Number(phoneTime),

        sleepTime: sleepTime,

        satisfaction: Number(satisfaction),
      });

      alert("保存しました！");

      setStudyTime("");
      setPhoneTime("");
      setSleepTime("");
      setSatisfaction("");

      fetchLogs(user.uid);

    } catch (error) {
      console.error(error);

      alert("保存に失敗しました");
    }
  };

  // Firestore取得
  const fetchLogs = async (uid: string) => {
    try {
      const q = query(
        collection(db, "weeklyLogs"),
        where("uid", "==", uid)
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setLogs(data);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchLogs(user.uid);
    }
  }, [user]);

  // 今週の月〜日を生成
  const getWeekDates = () => {
    const today = new Date();

    const day = today.getDay();

    // 月曜開始に調整
    const monday = new Date(today);

    monday.setDate(
      today.getDate() - (day === 0 ? 6 : day - 1)
    );

    const week = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);

      d.setDate(monday.getDate() + i);

      week.push({
        date: d.toISOString().split("T")[0],

        dayName: ["日", "月", "火", "水", "木", "金", "土"][
          d.getDay()
        ],

        displayDate: d.getDate() + "日",
      });
    }

    return week;
  };

  const weekDates = getWeekDates();

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 16,
        fontFamily: "sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: 28,
          marginBottom: 20,
        }}
      >
        1週間生活管理表
      </h1>

      {/* ログイン */}
      {user ? (
        <div
          style={{
            marginBottom: 20,
          }}
        >
          <p>
            ログイン中：{user.displayName}
          </p>

          <button
            onClick={logout}
            style={buttonStyle}
          >
            ログアウト
          </button>
        </div>
      ) : (
        <button
          onClick={login}
          style={buttonStyle}
        >
          Googleでログイン
        </button>
      )}

      <hr style={{ margin: "24px 0" }} />

      {/* 入力 */}
      {user && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <h2>記録入力</h2>

          <div>
            <p>日付</p>

            <input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
              style={inputStyle}
            />
          </div>

          <div>
            <p>勉強時間</p>

            <input
              type="number"
              placeholder="例：10"
              value={studyTime}
              onChange={(e) =>
                setStudyTime(e.target.value)
              }
              style={inputStyle}
            />
          </div>

          <div>
            <p>スマホ時間</p>

            <input
              type="number"
              placeholder="例：2"
              value={phoneTime}
              onChange={(e) =>
                setPhoneTime(e.target.value)
              }
              style={inputStyle}
            />
          </div>

          <div>
            <p>就寝時間</p>

            <input
              placeholder="例：23:30"
              value={sleepTime}
              onChange={(e) =>
                setSleepTime(e.target.value)
              }
              style={inputStyle}
            />
          </div>

          <div>
            <p>満足度（1〜5）</p>

            <input
              type="number"
              placeholder="1〜5"
              value={satisfaction}
              onChange={(e) =>
                setSatisfaction(e.target.value)
              }
              style={inputStyle}
            />
          </div>

          <button
            onClick={saveData}
            style={buttonStyle}
          >
            保存
          </button>
        </div>
      )}

      <hr style={{ margin: "24px 0" }} />

      {/* 表 */}
      {user && (
        <div>
          <h2>1週間記録</h2>

          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 700,
              }}
            >
              <thead>
                <tr>
                  <th style={thStyle}>日付</th>

                  <th style={thStyle}>曜日</th>

                  <th style={thStyle}>勉強</th>

                  <th style={thStyle}>スマホ</th>

                  <th style={thStyle}>就寝</th>

                  <th style={thStyle}>満足度</th>
                </tr>
              </thead>

              <tbody>
                {weekDates.map((day) => {

                  const log = logs.find(
                    (log) => log.date === day.date
                  );

                  return (
                    <tr key={day.date}>
                      <td style={tdStyle}>
                        {day.displayDate}
                      </td>

                      <td style={tdStyle}>
                        {day.dayName}
                      </td>

                      <td style={tdStyle}>
                        {log?.studyTime || ""}
                      </td>

                      <td style={tdStyle}>
                        {log?.phoneTime || ""}
                      </td>

                      <td style={tdStyle}>
                        {log?.sleepTime || ""}
                      </td>

                      <td style={tdStyle}>
                        {log?.satisfaction || ""}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: 12,
  borderRadius: 8,
  border: "1px solid #ccc",
};

const buttonStyle = {
  padding: "12px 16px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
};

const thStyle = {
  border: "1px solid #ccc",
  padding: 12,
  backgroundColor: "#f3f4f6",
  textAlign: "center" as const,
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: 12,
  textAlign: "center" as const,
};