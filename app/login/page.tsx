"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";
import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/firebase";
import { useAuth } from "@/lib/auth/AuthContext";
import AuthCard from "@/components/shared/AuthCard";
import Button from "@/components/shared/Button";
import { colors } from "@/components/shared/styles";

// ユーザーが自分で閉じた場合などはエラー表示しない
const CANCEL_CODES = ["auth/popup-closed-by-user", "auth/cancelled-popup-request"];

export default function LoginPage() {

  const router = useRouter();
  const { user, authLoading } = useAuth();

  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState("");

  // ログイン済みなら振り分けへ
  useEffect(() => {
    if (!authLoading && user) router.replace("/");
  }, [user, authLoading, router]);


  const login = async () => {

    const provider = new GoogleAuthProvider();

    provider.setCustomParameters({
      prompt: "select_account",
    });

    setSigningIn(true);
    setError("");

    try {

      await signInWithPopup(
        auth,
        provider
      );

      router.replace("/");

    } catch (e) {

      if (e instanceof FirebaseError && CANCEL_CODES.includes(e.code)) return;

      console.error(e);
      setError(
        e instanceof FirebaseError && e.code === "auth/popup-blocked"
          ? "ポップアップがブロックされました。ブラウザの設定を確認してください"
          : "ログインに失敗しました。もう一度お試しください"
      );

    } finally {
      setSigningIn(false);
    }

  };


  return (
    <AuthCard>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40 }}>📚</div>
        <h1 style={{ margin: "8px 0 4px", fontSize: 22, fontWeight: "bold" }}>
          勉強時間自己管理アプリ
        </h1>
        <p style={{ margin: 0, fontSize: 14, opacity: 0.6 }}>
          毎日の勉強・スマホ・睡眠を記録しよう
        </p>
      </div>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={login}
        disabled={signingIn}
      >
        {signingIn ? "ログイン中…" : "Googleでログイン"}
      </Button>

      {error && (
        <div role="alert" style={{ color: colors.danger, fontSize: 14, textAlign: "center" }}>
          {error}
        </div>
      )}
    </AuthCard>
  );
}
