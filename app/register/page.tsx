"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/shared/AuthCard";
import Button from "@/components/shared/Button";
import { colors, textInputStyle } from "@/components/shared/styles";
import { useAuth } from "@/lib/auth/AuthContext";
import { createStudentProfile } from "@/lib/user/createStudentProfile";

export default function RegisterPage() {
  const { user, authLoading, logout } = useAuth();

  const router = useRouter();

  const [tempName, setTempName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // 未ログイン / 登録済みは振り分けへ
  useEffect(() => {
    if (authLoading) return;
    if (!user || user.name) router.replace("/");
  }, [user, authLoading, router]);

  const trimmedName = tempName.trim();

  const registerName = async () => {
    if (!user?.uid || saving) return;

    if (!trimmedName) {
      setError("名前を入力してください");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await createStudentProfile(
        user.uid,
        trimmedName
      );
      router.push("/student");

    } catch (e) {
      console.error("register error:", e);
      setError("登録に失敗しました。もう一度お試しください");
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  return (
    <AuthCard>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40 }}>👋</div>
        <h1 style={{ margin: "8px 0 4px", fontSize: 22, fontWeight: "bold" }}>
          はじめに名前を登録
        </h1>
        <p style={{ margin: 0, fontSize: 14, opacity: 0.6 }}>
          先生が確認できるよう、本名で登録してください
        </p>
      </div>

      <div>
        <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 4 }}>
          ログイン中のアカウント
        </div>
        <div
          style={{
            padding: 12,
            borderRadius: 10,
            background: "var(--bg)",
            fontSize: 14,
            wordBreak: "break-all",
          }}
        >
          {user?.email}
        </div>
      </div>

      <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
        <span style={{ opacity: 0.6 }}>名前（本名・ニックネーム不可）</span>
        <input
          value={tempName}
          autoFocus
          autoComplete="name"
          placeholder="例：山田 太郎"
          onChange={(e) => {
            setTempName(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing) registerName();
          }}
          style={textInputStyle}
        />
      </label>

      {error && (
        <div role="alert" style={{ color: colors.danger, fontSize: 14 }}>
          {error}
        </div>
      )}

      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={registerName}
        disabled={saving || !trimmedName}
      >
        {saving ? "登録中…" : "登録する"}
      </Button>

      <button
        type="button"
        onClick={handleLogout}
        style={{
          background: "none",
          border: "none",
          color: colors.muted,
          fontSize: 13,
          cursor: "pointer",
          textDecoration: "underline",
        }}
      >
        別のアカウントでログインする
      </button>
    </AuthCard>
  );
}
