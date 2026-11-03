"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { AppUser } from "@/lib/auth/AuthContext";

type Props = {
  user: AppUser | null;
  authLoading: boolean;
};

// teacher 以外はトップへ戻す
export function useTeacherGuard({
  user,
  authLoading,
}: Props) {
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;

    if (user?.role !== "teacher") {
      router.push("/");
    }
  }, [user, authLoading, router]);
}
