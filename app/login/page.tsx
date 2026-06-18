"use client";

import { useRouter } from "next/navigation";
import { auth } from "@/firebase";
import Button from "@/components/shared/Button";
import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export default function LoginPage() {

  const router = useRouter();

  const login = async () => {
    const provider = new GoogleAuthProvider();

    provider.setCustomParameters({
      prompt: "select_account",
    });

    try {
      await signInWithPopup(auth, provider);

      // ログイン成功後
      router.push("/");

    } catch (e) {
      console.error(e);
      alert("ログインに失敗しました");
    }
  };


  return (
    <div style={{ padding: 20 }}>

      <h2
        style={{
          marginBottom: 12,
          marginLeft: 12,
        }}
      >
        ログインしてください
      </h2>


      <Button
        variant="primary"
        size="md"
        onClick={login}
      >
        Googleでログイン
      </Button>

    </div>
  );
}