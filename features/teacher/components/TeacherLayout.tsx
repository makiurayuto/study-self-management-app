"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Button from "@/components/shared/Button";
import Skeleton from "@/components/shared/Skeleton";
import { colors } from "@/components/shared/styles";
import { useAuth } from "@/lib/auth/AuthContext";
import { useTeacherGuard } from "@/features/teacher/hooks/useTeacherGuard";

const NAV_ITEMS = [
  { href: "/teacher", label: "📋 ダッシュボード" },
  { href: "/teacher/students", label: "📊 生徒詳細" },
  { href: "/teacher/management", label: "🛠 生徒管理" },
];

// 先生画面共通：権限チェック + ナビ
export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const allowed = useTeacherGuard();
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  return (
    <div style={containerStyle}>
      <header style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            marginBottom: 8,
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 15 }}>
            👨‍🏫 先生用画面
            {user?.name && (
              <span style={{ fontWeight: 400, color: colors.muted, marginLeft: 8, fontSize: 13 }}>
                {user.name}
              </span>
            )}
          </div>

          <Button variant="secondary" colorVariant="gray" size="sm" onClick={handleLogout}>
            ログアウト
          </Button>
        </div>

        <nav
          style={{
            display: "flex",
            gap: 4,
            // 横だけスクロール（狭い画面用）。縦スクロールバーは出さない
            overflowX: "auto",
            overflowY: "hidden",
            scrollbarWidth: "none",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                style={{
                  padding: "10px 14px",
                  whiteSpace: "nowrap",
                  fontSize: 14,
                  fontWeight: active ? 700 : 500,
                  color: active ? colors.primary : "var(--text)",
                  opacity: active ? 1 : 0.7,
                  borderBottom: `3px solid ${active ? colors.primary : "transparent"}`,
                  textDecoration: "none",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {allowed ? (
        children
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Skeleton height={32} width="40%" />
          <Skeleton height={120} radius={12} />
          <Skeleton height={240} radius={12} />
        </div>
      )}
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 1200,
  margin: "0 auto",
  padding: "16px 20px 60px",
  boxSizing: "border-box",
  color: "var(--text)",
};
