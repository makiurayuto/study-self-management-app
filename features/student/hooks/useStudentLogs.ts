"use client";

import { useCallback, useEffect, useState } from "react";
import type { StudentDailyLog } from "@/types/student-log";
import { fetchStudentLogs, saveStudentLog } from "@/lib/logService";

export function useStudentLogs(uid: string | undefined) {
  const [logs, setLogs] = useState<StudentDailyLog[]>([]);
  // 読み込みが完了した uid（uid と異なる間は読み込み中）
  const [loadedUid, setLoadedUid] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);

  const loading = !!uid && loadedUid !== uid;

  useEffect(() => {
    if (!uid) return;

    fetchStudentLogs(uid)
      .then((list) => {
        setLogs(list);
        setLoadError(false);
      })
      .catch((e) => {
        console.error("logs読込失敗", e);
        setLoadError(true);
      })
      .finally(() => setLoadedUid(uid));
  }, [uid]);

  // 保存後は再取得せず手元の一覧を更新する
  const saveLog = useCallback(async (log: StudentDailyLog) => {
    await saveStudentLog(log);

    setLogs((prev) => [
      ...prev.filter((l) => l.date !== log.date),
      log,
    ]);
  }, []);

  return { logs, loading, loadError, saveLog };
}
