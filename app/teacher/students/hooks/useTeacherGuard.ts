"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type User = {
  role?: string;
} | null;

type Props = {
  user: User;
  authLoading: boolean;
  fetchData: () => void;
};

export function useTeacherGuard({
  user,
  authLoading,
  fetchData,
}: Props) {
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/");
      return;
    }

    if (user.role !== "teacher") {
      router.push("/");
      return;
    }

    fetchData();
  }, [user, authLoading]);
}