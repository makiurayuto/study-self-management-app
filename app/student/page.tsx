"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/shared/Button";
import TimeControl from "@/features/time/components/TimeControl";
import SleepTimePicker from "@/features/sleep/components/SleepTimePicker";
import { useAuth } from "@/lib/auth/AuthContext";
import { updateStudentName } from "@/lib/user/updateStudentName";
import {
  fetchStudentLog,
  fetchStudentLogs,
  saveStudentLog,
} from "@/lib/logService";
import { getWeekDates } from "@/lib/date";
import { minutesToTime, timeToMinutes } from "@/lib/time";
import type { StudentDailyLog } from "@/types/student-log";

export default function StudentPage() {

  const { user, logout: signOut } = useAuth();

  const router = useRouter();

  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("");
  const [studyTime, setStudyTime] = useState("");
  const [phoneTime, setPhoneTime] = useState("");
  const [sleepTime, setSleepTime] = useState("");
  const [satisfaction, setSatisfaction] = useState("");

  const [showNameEdit, setShowNameEdit] = useState(false);
  const [newName, setNewName] = useState("");

  const [logs, setLogs] = useState<StudentDailyLog[]>([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [openSleepPicker, setOpenSleepPicker] = useState(false);

  const [date, setDate] = useState(
    new Date().toLocaleDateString("sv-SE")
  );

  const logout = async () => {
    await signOut();
    router.replace("/");
  };

  // =====================
  // フォームへ反映
  // =====================
  const applyLogToForm = (log: StudentDailyLog | null) => {
    setStudyTime(log?.studyTime != null ? minutesToTime(log.studyTime) : "");
    setPhoneTime(log?.phoneTime != null ? minutesToTime(log.phoneTime) : "");
    setSleepTime(log?.sleepTime ?? "");
    setSatisfaction(log?.satisfaction ?? "");
  };

  // 1日読み込み
  const loadData = async (uid: string, d: string) => {
    applyLogToForm(await fetchStudentLog(uid, d));
  };

  // logs取得
  const fetchLogs = async (uid: string) => {
    setLogs(await fetchStudentLogs(uid));
  };

  // =====================
  // 保存
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
      await saveStudentLog({
        uid: user.uid,
        date,
        studyTime: timeToMinutes(studyTime),
        phoneTime: timeToMinutes(phoneTime),
        sleepTime,
        satisfaction,
      });

      setMessage("✅ 保存しました！");
      setMessageColor("#22c55e");

      setTimeout(() => {
        setMessage("");
      }, 2000);

      applyLogToForm(null);

      await fetchLogs(user.uid);
    } catch (e) {
      console.error(e);
    }
  };

  // =====================
  // 日付変更
  // =====================
  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;

    setDate(newDate);

    if (!user?.uid) return;

    await loadData(user.uid, newDate);
  };

  const weekDates = getWeekDates(weekOffset);

  // 週の中で最も多い月を表示
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
  // 名前変更
  // =====================
  const handleUpdateName = async () => {
    if (!user) return;

    await updateStudentName(
      user.uid,
      newName
    );

    setShowNameEdit(false);
  };

  useEffect(() => {
    if (!user?.name) return;

    fetchStudentLogs(user.uid).then(setLogs);
  }, [user?.uid, user?.name]);

  // ログイン時に選択日の登録内容をロード
  useEffect(() => {
    if (!user?.uid) return;

    fetchStudentLog(user.uid, date).then(applyLogToForm);
    // 日付変更時は handleDateChange で読み込むため uid のみに依存
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        padding: "0 16px",
      }}
    >
      <div style={{ marginTop: 24, marginBottom: 24 }}>
        <h1
          style={{
            textAlign: "center",
            fontSize: 25,
            fontWeight: "bold",
          }}
        >
          勉強時間自己管理アプリ
        </h1>
      </div>

        <div style={{ marginBottom: 20 }}>

          {/* 1行目：ユーザー + 右側ボタン */}
          <div
            style={{
              position: "relative", // ←ここに追加
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              padding: "0 32px",
            }}
          >
            {/* 左：ユーザー名 */}
            <p style={{ margin: 0 }}>
              ユーザー：{user?.name}
            </p>

            {/* 右：縦並びボタン */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              
              <Button
                variant="secondary"
                colorVariant="gray"
                size="sm"
                onClick={() => {
                  setNewName(user?.name || "");
                  setShowNameEdit(true);
                }}
              >
                名前変更
              </Button>
              
              {showNameEdit && (
                <div
                  style={overlayStyle}
                  onClick={() => setShowNameEdit(false)}
                >
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      ...cardStyle,
                      width: 320,
                      background: "var(--card)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                      }}
                    >
                      名前変更
                    </div>

                    <input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="新しい名前"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleUpdateName();
                      }}
                      style={{
                        width: "100%",
                        padding: 12,
                        borderRadius: 10,
                        border: "1px solid var(--border)",
                        background: "var(--bg)",
                        color: "var(--text)",
                        fontSize: 16,
                        boxSizing: "border-box",
                      }}
                    />

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 8,
                      }}
                    >
                      <Button
                        variant="secondary"
                        size="md"
                        onClick={() => setShowNameEdit(false)}
                      >
                        キャンセル
                      </Button>

                      <Button
                        variant="primary"
                        size="md"
                        onClick={handleUpdateName}
                      >
                        保存
                      </Button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
   

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
                  textAlign: "center", 
                }}
              />
            </div>

          <TimeControl
            label="📚 勉強時間"
            value={studyTime}
            setValue={setStudyTime}
          />
                    
          <TimeControl
            label="📱 スマホ時間"
            value={phoneTime}
            setValue={setPhoneTime}
          />

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
                textAlign: "center",
              }}
            >
              {sleepTime || "未選択"}
            </div>
          </div>
          {openSleepPicker && (
            <div style={overlayStyle} onClick={() => setOpenSleepPicker(false)}>
              <div
                style={modalStyle}
                onClick={(e) => e.stopPropagation()}
              >
                <SleepTimePicker
                  value={sleepTime}
                  onChange={(v) => setSleepTime(v)}
                  onClose={() => setOpenSleepPicker(false)}
                />

                <button onClick={() => setOpenSleepPicker(false)}>
                  完了
                </button>
              </div>
            </div>
          )}

          <div style={cardStyle}>
            <div style={{display: "flex", alignItems: "center", gap: 6, fontWeight: "bold" }}>
                満足度
            </div>
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


          <Button variant="primary" size="md" onClick={saveData}>
            保存
          </Button>
        </div>
      )}

      <hr style={{ margin: 24 }} />

      {/* 表 */}
      {user && (
        <div>
          <div
            style={{
              marginBottom: 4,
              marginLeft: 28,
              fontWeight: "bold",
            }}
          >
              1週間記録
          </div>
          <div
            style={{
              overflowX: "hidden",
              marginBottom: 24,
              userSelect: "none",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 16,
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
                        {log?.studyTime != null
                          ? (log.studyTime / 60).toFixed(1) + "h"
                          : ""}
                      </td>

                      <td style={tdStyle}>
                        {log?.phoneTime != null
                          ? (log.phoneTime / 60).toFixed(1) + "h"
                          : ""}
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
          <Button variant="secondary" size="md" onClick={() => setWeekOffset((prev) => prev - 1)}>
            前の週
          </Button>

          <Button variant="secondary" size="md" onClick={() => setWeekOffset(0)}>
            今週
          </Button>

          <Button variant="secondary" size="md" onClick={() => setWeekOffset((prev) => prev + 1)}>
            次の週
          </Button>
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 6,
          marginTop: 40,
          marginBottom: 80,
          paddingBottom: 20,
          paddingRight: 32,
        }}
      >
        <Button variant="secondary" colorVariant="gray" onClick={logout} size="sm">
          ログアウト
        </Button>

      </div>
    </div>
  );
}

const thStyle = {
  border: "1px solid var(--border)",
  padding: "8px 10px",
  background: "var(--card)",
  color: "var(--text)",
  textAlign: "center" as const,
  fontSize: 16,
  fontWeight: "bold",
};

const tdStyle = {
  border: "1px solid var(--border)",
  padding: "8px 10px",
  color: "var(--text)",
  textAlign: "center" as const,
  fontSize: 16,
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
