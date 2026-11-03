type Props = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

export default function PageTitle({ title, description, actions }: Props) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        gap: 12,
        flexWrap: "wrap",
        marginBottom: 16,
      }}
    >
      <div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: "bold" }}>{title}</h1>
        {description && (
          <p style={{ margin: "4px 0 0", fontSize: 13, opacity: 0.6 }}>{description}</p>
        )}
      </div>

      {actions && <div style={{ display: "flex", gap: 8 }}>{actions}</div>}
    </div>
  );
}
