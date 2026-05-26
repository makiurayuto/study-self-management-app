"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { signOut } from "firebase/auth";

type AppUser = {
  uid: string;
  name?: string;
  role?: "student" | "teacher";
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
        setAuthLoading(true);

        try {
        if (!u) {
            setUser(null);
            return;
        }

        const ref = doc(db, "users", u.uid);

        const unsubDoc = onSnapshot(ref, (snap) => {
            if (!snap.exists()) {
            setUser({ uid: u.uid });
            return;
            }

            const data = snap.data();

            setUser({
            uid: u.uid,
            name: data.name,
            role: data.role,
            });
        });

        return () => unsubDoc();

        } finally {
        setAuthLoading(false);
        }
    });

    return () => unsub();
    }, []);

  return (
    <AuthContext.Provider
        value={{
            user,
            authLoading,
            logout: async () => {
            await signOut(auth);
            },
        }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);