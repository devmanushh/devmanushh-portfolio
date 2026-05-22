type Props = {
  title: string;
  value: string;
};

export default function DashboardCard({
  title,
  value,
}: Props) {
  return (
    <div
      style={{
        border: "1px solid #1a1a1a",
        borderRadius: "20px",
        padding: "24px",
      }}
    >
      <p style={{ color: "#999" }}>{title}</p>

      <h2 style={{ marginTop: "12px" }}>{value}</h2>
    </div>
  );
}