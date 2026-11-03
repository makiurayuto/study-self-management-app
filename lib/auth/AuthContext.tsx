"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/firebase";
import { doc, onSnapshot, type Unsubscribe } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import type { UserRole } from "@/types/user";

export type AppUser = {
  uid: string;
  email?: string;
  name?: string;
  role?: UserRole;
};

type AuthContextType = {
  user: AppUser | null;
  authLoading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  authLoading: true,
  logout: async () => {},
});

const logout = async () => {
  await signOut(auth);
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // users/{uid} の購読（ログインユーザーが変わるたびに張り替える）
    let unsubDoc: Unsubscribe | null = null;

    const unsubAuth = onAuthStateChanged(auth, (u) => {
      unsubDoc?.();
      unsubDoc = null;

      if (!u) {
        setUser(null);
        setAuthLoading(false);
        return;
      }

      setAuthLoading(true);

      unsubDoc = onSnapshot(
        doc(db, "users", u.uid),
        (snap) => {
          const data = snap.data();

          setUser({
            uid: u.uid,
            email: u.email ?? "",
            name: data?.name,
            role: data?.role,
          });
          setAuthLoading(false);
        },
        (error) => {
          console.error("AuthContext users読込失敗", error);
          setUser(null);
          setAuthLoading(false);
        }
      );
    });

    return () => {
      unsubDoc?.();
      unsubAuth();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, authLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
