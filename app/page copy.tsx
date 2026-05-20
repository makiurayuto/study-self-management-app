"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

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

  const [logs, setLogs] = useState<any[]>([]);

  //  週管理（追加）
  const [weekOffset, setWeekOffset] = useState(0);

  // ログイン
  const login = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    const user = result.user;
    setUser(user);

    // 🔥 usersに存在しない場合は作る
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      await setDoc(ref, {
        name: user.displayName,
        role: "student",
      });
    }
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
        date,
        studyTime: Number(studyTime),
        phoneTime: Number(phoneTime),
        sleepTime,
        satisfaction,
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
    if (user) fetchLogs(user.uid);
  }, [user]);

  //  今週生成（過去週対応）
  const getWeekDates = (offset = 0) => {
    const today = new Date();

    const day = today.getDay();

    const monday = new Date(today);
    monday.setDate(
      today.getDate() - (day === 0 ? 6 : day - 1)
    );

    // 週移動
    monday.setDate(monday.getDate() + offset * 7);

    const week = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);

      week.push({
        date: d.toISOString().split("T")[0],
        dayName: ["日", "月", "火", "水", "木", "金", "土"][d.getDay()],
        displayDate: d.getDate() + "日",
      });
    }

    return week;
  };

  const weekDates = getWeekDates(weekOffset);
  const weekMonth = (() => {
    const months = weekDates.map(
      (d) => new Date(d.date).getMonth() + 1
    );

    const freq: Record<number, number> = {};

    for (const m of months) {
      freq[m] = (freq[m] || 0) + 1;
    }

    const sorted = Object.entries(freq).sort(
      (a, b) => Number(b[1]) - Number(a[1])
    );

    return `${sorted[0][0]}月`;
  })();

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 16,
        fontFamily: "sans-serif",
      }}
    >
      <h1>勉強時間自己管理表</h1>

      {/* ログイン */}
      {user ? (
        <div>
          <p>ログイン中：{user.displayName}</p>
          <button onClick={logout} style={buttonStyle}>
            ログアウト
          </button>
        </div>
      ) : (
        <button onClick={login} style={buttonStyle}>
          Googleでログイン
        </button>
      )}

      <hr style={{ margin: 24 }} />

      {/* 入力 */}
      {user && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <h2>記録入力</h2>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={inputStyle}
          />

          <input
            type="number"
            placeholder="勉強時間"
            value={studyTime}
            onChange={(e) => setStudyTime(e.target.value)}
            style={inputStyle}
          />

          <input
            type="number"
            placeholder="スマホ時間"
            value={phoneTime}
            onChange={(e) => setPhoneTime(e.target.value)}
            style={inputStyle}
          />

          <input
            placeholder="就寝時間"
            value={sleepTime}
            onChange={(e) => setSleepTime(e.target.value)}
            style={inputStyle}
          />

          {/* 満足度*/}
          <div>
            <p>満足度</p>

            <div style={{ display: "flex", gap: 10 }}>
              {["○", "△", "×"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSatisfaction(s)}
                  style={{
                    fontSize: 24,
                    padding: "10px 16px",
                    borderRadius: 8,
                    border:
                      satisfaction === s
                        ? "2px solid black"
                        : "1px solid #ccc",
                    background:
                      satisfaction === s ? "#f0f0f0" : "white",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            <p>選択中：{satisfaction}</p>
          </div>

          <button onClick={saveData} style={buttonStyle}>
            保存
          </button>
        </div>
      )}

      <hr style={{ margin: 24 }} />

      {/* 週切り替え */}
      {user && (
        <div style={{ marginBottom: 10 }}>
          <button onClick={() => setWeekOffset(weekOffset - 1)}>
            ← 前の週
          </button>

          <button onClick={() => setWeekOffset(0)} style={{ margin: "0 10px" }}>
            今週
          </button>

          <button onClick={() => setWeekOffset(weekOffset + 1)}>
            次の週 →
          </button>
        </div>
      )}

      {/* 表 */}
      {user && (
        <div>
          <h2>1週間記録</h2>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 500,
                fontSize: 12,
              }}
            >
              <thead>
                <tr>
                  <th style={thStyle}>{weekMonth}</th>
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
                    (l) => l.date === day.date
                  );

                  return (
                    <tr key={day.date}>
                      <td style={tdStyle}>{day.displayDate}</td>
                      <td style={tdStyle}>{day.dayName}</td>
                      <td style={tdStyle}>{log?.studyTime || ""}</td>
                      <td style={tdStyle}>{log?.phoneTime || ""}</td>
                      <td style={tdStyle}>{log?.sleepTime || ""}</td>
                      <td style={tdStyle}>{log?.satisfaction || ""}</td>
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
  padding: 12,
  border: "1px solid #ccc",
  borderRadius: 8,
  width: "100%",
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
  background: "#f3f4f6",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: 12,
};