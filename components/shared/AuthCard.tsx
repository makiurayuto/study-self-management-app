// ログイン・登録など、画面中央に1枚だけ出すカード
export default function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 20,
          padding: "32px 24px",
          boxSizing: "border-box",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {children}
      </div>
    </div>
  );
}
