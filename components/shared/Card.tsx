type Props = {
  children: React.ReactNode;
  style?: React.CSSProperties;
};

export default function Card({
  children,
  style,
}: Props) {
  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: 20,
        marginBottom: 12,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
