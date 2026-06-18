"use client";

import { useState } from "react";
import Button from "@/components/shared/Button";
import { useAuth } from "@/lib/auth/AuthContext";
import { createStudentProfile } from "@/lib/user/createStudentProfile";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { user } = useAuth();

  const router = useRouter();

  const [tempName, setTempName] = useState("");

  const registerName = async () => {
    if (!user?.uid) return;

    const trimmedName = tempName.trim();

    if (!trimmedName) {
      alert("名前を入力してください");
      return;
    }

    try {
      await createStudentProfile(
        user.uid,
        trimmedName
      );
      router.push("/student");

    } catch (e) {
      console.error("register error:", e);
      alert("登録に失敗しました");
    }
  };


  return (
    <div style={{ padding: 20 }}>
        <h2>登録画面</h2>
        <div
        style={{
            marginBottom: 12,
            color: "#666",
            fontSize: 14
        }}
        >
        登録するメールアドレス
        </div>

        <div
        style={{
            marginBottom: 16,
            padding: 12,
            borderRadius: 8,
            background: "var(--card)",
            border: "1px solid var(--border)",
        }}
        >
        {user?.email}
        </div>

        <h2>名前を登録</h2>

        <div style={{ marginBottom: 12, color: "#666", fontSize: 14 }}>
        ※本名で登録してください（ニックネーム不可）
        </div>

      <input
        value={tempName}
        onChange={(e) => setTempName(e.target.value)}
        style={inputStyle}
      />

      <div style={{ marginTop: 16 }}>
        <Button
          variant="primary"
          size="md"
          onClick={registerName}
        >
          登録
        </Button>
      </div>
    </div>
  );
}


const inputStyle = {
  padding: 12,
  borderRadius: 8,
  border: "1px solid var(--border)",
  background: "var(--card)",
  color: "var(--text)",
  outline: "none",
  fontSize: 14,
};