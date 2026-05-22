"use client";

import { useRouter } from "next/navigation";
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
  query,
  where,
  getDocs,
} from "firebase/firestore";

export default function Home() {
  type AppUser = {
  uid: string;
  name: string;
  role: "student" | "teacher";
  };

  const [user, setUser] = useState<AppUser | null>(null);

  const [step, setStep] = useState("loading");

  const router = useRouter();

  console.log("step:", step);
  console.log("user:", user);

  const [tempName, setTempName] = useState("");

  const [date, setDate] = useState(
    new Date().toLocaleDateString("sv-SE")
  );

  const [studyTime, setStudyTime] = useState("");
  const [phoneTime, setPhoneTime] = useState("");
  const [sleepTime, setSleepTime] = useState("00:00");
  const [satisfaction, setSatisfaction] = useState("");

  const [logs, setLogs] = useState<any[]>([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);

  // =====================
  // login
  // =====================
  const login = async () => {
    console.log("login clicked");

    const provider = new GoogleAuthProvider();

    // 🔥 重要：必ずアカウント選択させる
    provider.setCustomParameters({
      prompt: "select_account",
    });

    const result = await signInWithPopup(auth, provider);

    const u = result.user;

    const ref = doc(db, "users", u.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      setUser({
        uid: u.uid,
        name: "",
        role: "student",
      });
      setStep("name");
      return;
    }

    const data = snap.data();

    setUser({
      uid: u.uid,
      name: data.name,
      role: data.role,
    });

    setStep(data.role === "teacher" ? "teacher" : "app");
  };

  // =====================
  // logout
  // =====================
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setLogs([]);
  };

  const registerName = async () => {
    if (!user) return;

    await setDoc(doc(db, "users", user.uid), {
      name: tempName,
      role: "student",
    });

    setUser({
      uid: user.uid,
      name: tempName,
      role: "student",
    });

    setStep("app");
  };

  // =====================
  // 保存（修正済み）
  // =====================
  const saveData = async () => {
    if (!user) return alert("ログインしてください");

    try {
      await setDoc(
        doc(db, "weeklyLogs", `${user.uid}_${date}`),
        {
          uid: user.uid,
          date,
          studyTime: studyTime === "" ? null : Number(studyTime),
          phoneTime: phoneTime === "" ? null : Number(phoneTime),
          sleepTime,
          satisfaction,
        }
      );

      alert("保存しました！");

      setStudyTime("");
      setPhoneTime("");
      setSleepTime("");
      setSatisfaction("");

      await fetchLogs(user.uid); // ←1回だけ更新
    } catch (e) {
      console.error(e);
    }
  };

  // =====================
  // logs取得
  // =====================
  const fetchLogs = async (uid: string) => {
    const q = query(
      collection(db, "weeklyLogs"),
      where("uid", "==", uid)
    );

    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    setLogs(data);
  };

  // =====================
  // 日付変更関数
  // =====================
  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;

    setDate(newDate);

    if (!user) return;

    const ref = doc(
      db,
      "weeklyLogs",
      `${user.uid}_${newDate}`
    );

    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();

      setStudyTime(data.studyTime?.toString() ?? "");
      setPhoneTime(data.phoneTime?.toString() ?? "");
      setSleepTime(data.sleepTime ?? "");
      setSatisfaction(data.satisfaction ?? "");
    } else {
      setStudyTime("");
      setPhoneTime("");
      setSleepTime("");
      setSatisfaction("");
    }
  };

  // =====================
  // 1日読み込み（そのまま維持）
  // =====================
  const loadData = async (uid: string, d: string) => {
    const ref = doc(
      db,
      "weeklyLogs",
      `${uid}_${d}`
    );
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();
      setStudyTime(data.studyTime?.toString() ?? "");
      setPhoneTime(data.phoneTime?.toString() ?? "");
      setSleepTime(data.sleepTime ?? "");
      setSatisfaction(data.satisfaction ?? "");
    } else {
      setStudyTime("");
      setPhoneTime("");
      setSleepTime("");
      setSatisfaction("");
    }
  };

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {

      if (!u) {
        setUser(null);
        setStep("login");
        return;
      }

      const ref = doc(db, "users", u.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        setUser({ uid: u.uid, name: "", role: "student" });
        setStep("name");
        return;
      }

      const data = snap.data();

      setUser({
        uid: u.uid,
        name: data.name,
        role: data.role,
      });

      setStep(data.role === "teacher" ? "teacher" : "app");
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (user?.role === "teacher") {
      router.push("/teacher");
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchLogs(user.uid);
  }, [user]);

  // =====================
  // 週生成（そのまま）
  // =====================

  const getWeekDates = (offset = 0) => {
    const today = new Date();
    const day = today.getDay();

    const monday = new Date(today);
    monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));

    monday.setDate(monday.getDate() + offset * 7);

    const week = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);

      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");

      const formatted = `${yyyy}-${mm}-${dd}`;
      week.push({
        date: formatted,
        dayName: ["日", "月", "火", "水", "木", "金", "土"][d.getDay()],
        displayDate: d.getDate() + "日",
      });
    }

    return week;
  };

  // =====================
  // 表スクロール関数
  // =====================
  const handleTouchStart = (
    e: React.TouchEvent<HTMLDivElement>
  ) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (
    e: React.TouchEvent<HTMLDivElement>
  ) => {
    const touchEndX = e.changedTouches[0].clientX;

    const diff = touchStartX - touchEndX;

    // 左スワイプ
    if (diff > 80) {
      setWeekOffset((prev) => prev + 1);
    }

    // 右スワイプ
    if (diff < -80) {
      setWeekOffset((prev) => prev - 1);
    }
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

  // =====================
  // UI（ここはほぼそのまま）
  // =====================

// 👇 名前入力画面
  if (step === "loading") {
    return <div>読み込み中...</div>;
  }

  if (step === "login") {
    return (
      <div style={{ padding: 20 }}>
        <h2>ログインしてください</h2>
        <button onClick={login}>Googleでログイン</button>
      </div>
    );
  }

  if (step === "name") {
    return (
      <div style={{ padding: 20 }}>
        <h2>名前を入力してください</h2>

        <input
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          style={inputStyle}
        />

        <button onClick={registerName}>登録</button>
      </div>
    );
  }

  if (step === "teacher") {
    router.push("/teacher");
    return <div>移動中...</div>;
  }

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

      {user ? (
        <div>
          <p>ログイン中：{user?.name}</p>
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
        <div 
          style={{ 
            display: "flex", 
            flexDirection: "column",
            gap: 20,
          }}>

          <h2>記録入力</h2>
            <input
              type="date"
              value={date}
              onChange={handleDateChange}
            />

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label>勉強時間</label>
            <input
                type="number"
                value={studyTime}
                onChange={(e) => setStudyTime(e.target.value)}
                style={inputStyle}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label>スマホ時間</label>
            <input
              type="number"
              value={phoneTime}
              onChange={(e) => setPhoneTime(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontWeight: "bold" }}>就寝時間</label>

            <select
              value={sleepTime}
              onChange={(e) => setSleepTime(e.target.value)}
              style={inputStyle}
            >
              <option value="" disabled>
                就寝時間を選択
              </option>

              {Array.from({ length: 96 }).map((_, i) => {
                const h = String(Math.floor(i / 4)).padStart(2, "0");
                const m = String((i % 4) * 15).padStart(2, "0");

                return (
                  <option key={i} value={`${h}:${m}`}>
                    {h}:{m}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <p>満足度</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap",}}>
              {["◎", "○", "△", "×"].map((s) => (
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

      {/* 週切替 */}
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

          <div
            style={{
              overflowX: "hidden",
              marginBottom: 24,
              touchAction: "pan-x",
              userSelect: "none",
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 10,
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

                  const log = logs.find((l) => {
                    return l.date === day.date;
                  });
                  return (
                    <tr key={day.date}>
                      <td style={tdStyle}>{day.displayDate}</td>
                      <td style={tdStyle}>{day.dayName}</td>
                      <td style={tdStyle}>{log?.studyTime ?? ""}</td>
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

// styles（そのまま）
const inputStyle = {
  padding: 12,
  border: "1px solid #ccc",
  borderRadius: 8,
  width: "100%",
  boxSizing: "border-box" as const,
};

const buttonStyle = {
  padding: "12px 16px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
};

const thStyle = {
  border: "1px solid #ccc",
  padding: 6,
  background: "#f3f4f6",
  textAlign: "center" as const,
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: 6,
  textAlign: "center" as const,
};