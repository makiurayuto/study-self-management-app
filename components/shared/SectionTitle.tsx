type Props = {
  children: React.ReactNode;
};

export default function SectionTitle({
  children,
}: Props) {
  return (
    <h3
      style={{
        fontSize: 18,
        fontWeight: 700,
        marginBottom: 8,
      }}
    >
      {children}
    </h3>
  );
}