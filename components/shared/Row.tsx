type Props = {
  label: string;
  value: string;
};

export default function Row({
  label,
  value,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: 14,
      }}
    >
      <span style={{ opacity: 0.6 }}>
        {label}
      </span>

      <span>{value}</span>
    </div>
  );
}
