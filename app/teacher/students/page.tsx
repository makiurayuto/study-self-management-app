"use client";
import { useEffect, useMemo, useState } from "react";
import { db } from "@/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import Button from "@/app/components/shared/Button";
import { getWeekDates } from "@/app/lib/date";


type Student = {
  uid: string;
  name: string;
};

type Log = {
  uid: string;
  date: string;
  studyTime: number | null;
  phoneTime: number | null;
  sleepTime: string;
  satisfaction: string;
};

export default function TeacherPage() {
  const { user, authLoading } = useAuth();
  const router = useRouter();

  const [students, setStudents] = useState<Student[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);

  // 👇選択中の生徒
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const [viewMode, setViewMode] =
    useState<"students" | "hidden">("students");
  const [loading, setLoading] = useState(true);

  const [weekOffset, setWeekOffset] = useState(0);

  const [hiddenStudents, setHiddenStudents] = useState<Student[]>([]);

  // =========================
  // データ取得
  // =========================
  const fetchData = async () => {
    setLoading(true);

    const userSnap = await getDocs(collection(db, "users"));
    const logSnap = await getDocs(collection(db, "weeklyLogs"));

    const studentList: Student[] = [];
    const hiddenList: Student[] = [];

    userSnap.forEach((d) => {
      const data = d.data();

      if (data.role === "student") {
        const student = {
          uid: d.id,
          name: data.name || "名前なし",
        };

        // 👇ここが超重要
        if (data.isHidden) {
          hiddenList.push(student);
        } else {
          studentList.push(student);
        }
      }
    });

    setStudents(studentList);
    setHiddenStudents(hiddenList);

    const logList: Log[] = [];

    logSnap.forEach((d) => {
      const data = d.data();

      logList.push({
        uid: data.uid ?? "",
        date: data.date ?? "",
        studyTime: data.studyTime ?? null,
        phoneTime: data.phoneTime ?? null,
        sleepTime: data.sleepTime ?? "",
        satisfaction: data.satisfaction ?? "",
      });
    });

    logList.sort((a, b) => b.date.localeCompare(a.date));

    setLogs(logList);

    setLoading(false);
  };

  const handleChangeMode = (mode: "students" | "hidden") => {
    setViewMode(mode);
    setSelectedUid(null);
  };

  const getWeekLabel = (offset: number) => {
    if (offset === 0) return "今週";
    if (offset === -1) return "先週";
    if (offset === 1) return "来週";
    return `${offset > 0 ? "+" : ""}${offset}週`;
  };

  const formatDate = (d: Date) =>
  `${d.getMonth() + 1}/${d.getDate()}`;

  const formatDateDisplay = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  const week = getWeekDates(weekOffset);

  const start = week[0].date;
  const end = week[6].date;

  const normalize = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const filteredLogs = logs.filter((l) => {
    const logDate = l.date.split("T")[0]; // ←強制正規化

    return (
      l.uid === selectedUid &&
      week.some((w) => w.date === logDate)
    );
  });

  const studentMap = useMemo(() => {
    return Object.fromEntries(
      [...students, ...hiddenStudents].map((s) => [s.uid, s.name])
    );
  }, [students, hiddenStudents]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/");
      return;
    }

    if (!user || user.role !== "teacher") {
      router.push("/");
      return;
    }

    fetchData();
  }, [user, authLoading]);

  useEffect(() => {
    console.log(selectedUid);
    console.log(studentMap);
  }, [selectedUid, studentMap]);

  if (authLoading || loading) {
    return <div style={{ padding: 20 }}>読み込み中...</div>;
  }

  const isHiddenStudent = hiddenStudents.some(
    (s) => s.uid === selectedUid
  );

  // =========================
  // UI
  // =========================
  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* ================= 左：生徒一覧 ================= */}
      <div
        style={{
          width: "30%",
          borderRight: "1px solid #ddd",
          overflowY: "auto",
        }}
      >
        <h2 style={{ padding: 16 }}>👤 生徒一覧</h2>

        {/* モード切替 */}
        <div style={{ padding: "0 16px", display: "flex", gap: 8 }}>
          <button
            onClick={() => handleChangeMode("students")}
            style={{
              flex: 1,
              padding: 8,
              background: viewMode === "students" ? "#dbeafe" : "#f3f4f6",
            }}
          >
            👤 生徒
          </button>

          <button
            onClick={() => handleChangeMode("hidden")}
            style={{
              flex: 1,
              padding: 8,
              background: viewMode === "hidden" ? "#fee2e2" : "#f3f4f6",
            }}
          >
            🚫 非表示
          </button>
        </div>

        <hr />

        {/* 生徒一覧 */}
        {viewMode === "students" &&
          students.map((s) => (
            <div
              key={s.uid}
              onClick={() => setSelectedUid(s.uid)}
              style={{
                padding: "12px 16px",
                cursor: "pointer",
                borderBottom: "1px solid #e5e7eb",
                background: selectedUid === s.uid ? "#f0f9ff" : "white",
              }}
            >
              {s.name}
            </div>
          ))}

        {/* 非表示リスト */}
        {viewMode === "hidden" &&
          hiddenStudents.map((s) => (
            <div
              key={s.uid}
              onClick={() => setSelectedUid(s.uid)}
              style={{
                padding: "12px 16px",
                cursor: "pointer",
                borderBottom: "1px solid #e5e7eb",
                background: "white",
                display: "flex",
                gap: 20,
              }}
            >
              <span>{s.name}</span>

              <div style={{ marginLeft: "auto" }}>
                <Button
                  variant="secondary"
                  onClick={async () => {
                    await updateDoc(doc(db, "users", s.uid), {
                      isHidden: false,
                    });

                    fetchData();
                  }}
                >
                  再表示
                </Button>
              </div>
            </div>
          ))}
      </div>

      {/* ================= 右：詳細 ================= */}
      <div style={{ width: "70%", padding: 20 }}>

        {/* 未選択 */}
        {!selectedUid && (
          <p>👈 生徒を選択してください</p>
        )}

        {/* 生徒選択中（生徒モード） */}
        {selectedUid && (
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
            
            <div style={{ marginBottom: 12 }}>
              <h2 style={{ marginBottom: 4 }}>
                 {getWeekLabel(weekOffset)}
              </h2>

              <div style={{ color: "#666", fontSize: 14 }}>
                {week[0].date} 〜 {week[6].date}
              </div>
            </div>


            <div style={{ marginBottom: 12, display: "flex", gap: 8 }}>
              <Button variant="secondary" size="md" onClick={() => setWeekOffset((p) => p - 1)}>
                ← 前の週
              </Button>

              <Button variant="secondary" size="md" onClick={() => setWeekOffset(0)}>
                今週
              </Button>

              <Button variant="secondary" size="md" onClick={() => setWeekOffset((p) => p + 1)}>
                次の週 →
              </Button>
            </div>

            <div style={{ overflowX: "auto", marginTop: 20 }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr>
                    <th style={thStyle}>日付</th>
                    <th style={thStyle}>勉強</th>
                    <th style={thStyle}>スマホ</th>
                    <th style={thStyle}>睡眠</th>
                    <th style={thStyle}>満足度</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredLogs.map((log, i) => (
                    <tr key={i}>
                      <td style={tdStyle}>
                        {formatDateDisplay(log.date)}
                      </td>
                      <td style={tdStyle}>
                        {log.studyTime
                          ? `${(log.studyTime / 60).toFixed(1)}h`
                          : ""}
                      </td>

                      <td style={tdStyle}>
                        {log.phoneTime
                          ? `${(log.phoneTime / 60).toFixed(1)}h`
                          : ""}
                      </td>

                      <td style={tdStyle}>{log.sleepTime}</td>
                      <td style={tdStyle}>{log.satisfaction}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ height: 24 }} />

            {selectedUid && viewMode === "students" && (
              <div style={{ display: "flex", gap: 8 }}>
                <Button
                  variant="secondary"
                  colorVariant ="danger"
                  onClick={async () => {
                    await updateDoc(doc(db, "users", selectedUid), {
                      isHidden: true,
                    });

                    setSelectedUid(null);
                    setViewMode("hidden");
                    fetchData();
                  }}
                >
                  非表示にする
                </Button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

// =========================
// styles
// =========================

const thStyle = {
  border: "1px solid #ccc",
  padding: 10,
  background: "#f3f4f6",
  textAlign: "left" as const,
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: 10,
};
