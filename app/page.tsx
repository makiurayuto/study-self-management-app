"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth/AuthContext";

export default function Home() {

  const router = useRouter();
  const { user, authLoading } = useAuth();


  useEffect(() => {

    if (authLoading) return;


    if (!user) {
      router.replace("/login");
      return;
    }


    if (!user.name) {
      router.replace("/register");
      return;
    }


    if (user.role === "teacher") {
      router.replace("/teacher");
      return;
    }


    router.replace("/student");


  }, [user, authLoading, router]);


  return (
    <div
      role="status"
      aria-label="読み込み中"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="spinner" />
    </div>
  );
}
