"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { auth, db } from "@/firebase";
import SleepTimePicker from "./components/SleepTimePicker";
import Button from "./components/Button";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
  GoogleAuthProvider,
  signInWithRedirect,
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
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("");
  const [studyTime, setStudyTime] = useState("");
  const [phoneTime, setPhoneTime] = useState("");
  const [sleepTime, setSleepTime] = useState("");
  const [satisfaction, setSatisfaction] = useState("");

  const [logs, setLogs] = useState<any[]>([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [openSleepPicker, setOpenSleepPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const [dialog, setDialog] = useState<{
    open: boolean;
    message: string;
    type: "success" | "error";
  }>({
    open: false,
    message: "",
    type: "success",
  });

  const cardStyle: React.CSSProperties = {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: 16,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    boxSizing: "border-box",
  }; 

  const lineStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    height: 2,
    transform: "translateY(-50%)",
    borderTop: "1px solid #ddd",
    borderBottom: "1px solid #ddd",
    pointerEvents: "none",
  };

  // =====================
  //ログイン
  // =====================
  const login = async () => {
    const provider = new GoogleAuthProvider();

    provider.setCustomParameters({
      prompt: "select_account",
    });

    setStep("loading");

    await signInWithRedirect(auth, provider);
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
    if (
      !studyTime ||
      !phoneTime ||
      !sleepTime ||
      !satisfaction
    ) {
      setMessage("⚠ 未入力があります");
      setMessageColor("#ef4444");
      return;
    }

    if (!user) return alert("ログインしてください");

    try {
      await setDoc(
        doc(db, "weeklyLogs", `${user.uid}_${date}`),
        {
          uid: user.uid,
          date,
          studyTime: studyTime === "" ? null : timeToMinutes(studyTime),
          phoneTime: phoneTime === "" ? null : timeToMinutes(phoneTime),
          sleepTime,
          satisfaction,
        }
      );

      setMessage("✅ 保存しました！");
      setMessageColor("#22c55e");

      setTimeout(() => {
        setMessage("");
      }, 2000);

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
  if (step === "teacher") {
    router.push("/teacher");
  }
}, [step]);

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

  // "02:30" → 2.5
  const timeToDecimal = (time: string) => {
    if (!time) return 0;
    const [h, m] = time.split(":").map(Number);
    return h + m / 60;
  };

  // "02:30" → 150（分）
  const timeToMinutes = (time: string) => {
    if (!time) return 0;
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  // 150（分） → "02:30"
  const minutesToTime = (min: number) => {
    const h = String(Math.floor(min / 60)).padStart(2, "0");
    const m = String(min % 60).padStart(2, "0");
    return `${h}:${m}`;
  };

  const startHour = 20;

  const timeToSleepClock = (time: string) => {
    if (!time) return "";

    const [h, m] = time.split(":").map(Number);

    const totalMinutes = h * 60 + m;

    const startMinutes = startHour * 60;

    const result = startMinutes + totalMinutes;

    const hh = Math.floor(result / 60) % 24;
    const mm = result % 60;

    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
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
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 16,
      color: "#666",
    }}>
      <p>移動中...</p>
    </div>
  );
}

  if (step === "login") {
    return (
      <div style={{ padding: 20 }}>
        <h2>ログインしてください</h2>
        <Button onClick={login}>Googleでログイン</Button>
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

        <Button variant="primary" onClick={registerName}>登録</Button>
      </div>
    );
  }
  

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        padding: "0 16px",
      }}
    >
      {dialog.open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => setDialog({ ...dialog, open: false })}
        >
          <div
            style={{
              background: "var(--card)",
              padding: 20,
              borderRadius: 16,
              width: 280,
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              transform: "scale(1)",
              animation: "pop 0.15s ease",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p
              style={{
                color: dialog.type === "success" ? "#22c55e" : "#ef4444",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              {dialog.message}
            </p>

            <button
              onClick={() => setDialog({ ...dialog, open: false })}
              style={{
                marginTop: 16,
                padding: "10px 14px",
                borderRadius: 10,
                background: "#4f46e5",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      <h1>勉強時間自己管理表</h1>

      {user ? (
        <div>
          <p>ログイン中：{user?.name}</p>
          <Button variant="secondary" onClick={logout}>
            ログアウト
          </Button>
        </div>
      ) : (
        <Button variant="primary" onClick={login}>
          Googleでログイン
        </Button>
      )}

      <hr style={{ margin: 24 }} />

      {/* 入力 */}
      {user && (
        <div 
          style={{ 
            display: "flex", 
            flexDirection: "column",
            gap: 24,
            padding: 16,
          }}>

          <h2>記録入力</h2>
            <div style={cardStyle}>
              <div style={{ fontWeight: "bold" }}>
                📅 日付
              </div>

              <input
                type="date"
                value={date}
                onChange={handleDateChange}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  background: "var(--bg)",
                  color: "var(--text)",
                  fontSize: 16,
                  outline: "none",
                  boxSizing: "border-box",
                  appearance: "none",
                  WebkitAppearance: "none",
                }}
              />
            </div>

          <div
            style={{
              background: "var(--card)",
              borderRadius: 12,
              padding: 16,
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
          <div style={{ fontWeight: "bold" }}>📚 勉強時間</div>

            <input
              type="time"
              value={studyTime}
              onChange={(e) => setStudyTime(e.target.value)}
              style={{
                padding: 12,
                borderRadius: 8,
                background: "var(--bg)",
                outline: "none",
              }}
            />
          </div>
          
          <div style={cardStyle}>
            <div style={{ fontWeight: "bold" }}>📱 スマホ時間</div>

            <input
              type="time"
              value={phoneTime}
              onChange={(e) => setPhoneTime(e.target.value)}
              style={{
                padding: 12,
                borderRadius: 8,
                background: "var(--bg)",
                outline: "none",
              }}
            />
          </div>

          <div
            style={cardStyle}
            onClick={() => setOpenSleepPicker(true)}
          >
            <div style={{ fontWeight: "bold" }}>
              🌙 就寝時間
            </div>
            <div
              style={{
                marginTop: 8,
                padding: 12,
                borderRadius: 10,
                border: "1px solid var(--border)",
                background: "var(--bg)",
              }}
            >
              {sleepTime || "未選択"}
            </div>
          </div>
          {openSleepPicker && (
            <div
              style={overlayStyle}
              onClick={() => setOpenSleepPicker(false)}
            >
              <div
                style={modalStyle}
                onClick={(e) => e.stopPropagation()}
              >
                <SleepTimePicker
                  value={sleepTime}
                  onChange={(v) => {
                    setSleepTime(v);
                    setOpenSleepPicker(false);
                  }}
                />
              </div>
            </div>
          )}

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
                    borderRadius: 10,
                    border:
                      satisfaction === s
                        ? "2px solid #4f46e5"
                        : "1px solid var(--border)",
                    background:
                      satisfaction === s 
                        ? "rgba(79,70,229,0.15)"
                         : "var(--card)",

                    color: "var(--text)",

                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s ease",

                    transform:
                      satisfaction === s
                        ? "scale(1.05)"
                        : "scale(1)",

                    boxShadow:
                      satisfaction === s
                        ? "0 4px 12px rgba(79,70,229,0.25)"
                        : "none",
                        
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            <p style={{ marginTop: 8, color: "var(--text)" }}>
              選択中：{satisfaction || "未選択"}
            </p>
          </div>

            {message && (
              <div style={{
                marginBottom: 10,
                padding: "10px 12px",
                borderRadius: 10,
                background: `${messageColor}15`,
                color: messageColor,
                fontWeight: 600,
              }}>
                {message}
              </div>
            )}


          <Button variant="primary" onClick={saveData}>
            保存
          </Button>
        </div>
      )}

      <hr style={{ margin: 24 }} />

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
                width: "95%",
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
                      <td style={tdStyle}>
                        {log?.studyTime ? (log.studyTime / 60).toFixed(1) + "h" : ""}
                      </td>

                      <td style={tdStyle}>
                        {log?.phoneTime ? (log.phoneTime / 60).toFixed(1) + "h" : ""}
                      </td>
                      <td style={tdStyle}>
                        {log?.sleepTime ? log.sleepTime : ""}
                      </td>
                      <td style={tdStyle}>{log?.satisfaction || ""}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 週切替 */}
      {user && (
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setWeekOffset(-1)}>
            前の週
          </Button>

          <Button variant="secondary" onClick={() => setWeekOffset(0)}>
            今週
          </Button>

          <Button variant="secondary" onClick={() => setWeekOffset(1)}>
            次の週
          </Button>
        </div>
      )}

      <div
      style={{ paddingBottom: 40 }}>

      </div>
    </div>
  );
}

const inputStyle = {
  padding: 12,
  borderRadius: 8,
  border: "1px solid var(--border)",
  background: "var(--card)",
  color: "var(--text)",
  outline: "none",
  fontSize: 14,
};
const buttonStyle: React.CSSProperties = {
  padding: "14px 16px",
  borderRadius: 12,
  border: "none",
  background: "#4f46e5",
  color: "white",
  fontWeight: 600,
  transition: "0.2s",
};

const thStyle = {
  border: "1px solid var(--border)",
  padding: 6,
  background: "var(--card)",
  color: "var(--text)",
  textAlign: "center" as const,
};

const tdStyle = {
  border: "1px solid var(--border)",
  padding: 6,
  color: "var(--text)",
  textAlign: "center" as const,
};

const modalOverlay = {
  position: "fixed" as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalBox = {
  background: "var(--card)",
  padding: 20,
  borderRadius: 16,
  width: "90%",
  maxWidth: 320,
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
  zIndex: 9999,
};

const modalStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 500,
  background: "var(--card)",
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  padding: 20,
  maxHeight: "60vh",
};