"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

// teacher 以外はトップへ戻す。表示してよいかを返す
export function useTeacherGuard() {
  const { user, authLoading } = useAuth();
  const router = useRouter();

  const isTeacher = user?.role === "teacher";

  useEffect(() => {
    if (authLoading) return;
    if (!isTeacher) router.replace("/");
  }, [isTeacher, authLoading, router]);

  return !authLoading && isTeacher;
}
