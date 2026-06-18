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
      router.push("/login");
      return;
    }

    if (!user.name) {
      router.push("/register");
      return;
    }

    if (user.role === "teacher") {
      router.push("/teacher");
      return;
    }

    router.push("/student");


  }, [user, authLoading, router]);


  return (
    <div>
      移動中...
    </div>
  );
}