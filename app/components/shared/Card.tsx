type Props = {
  children: React.ReactNode;
};

export default function Card({
  children,
}: Props) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: 12,
        padding: 20,
        marginBottom: 12,
      }}
    >
      {children}
    </div>
  );
}