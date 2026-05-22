type Props = {
  title: string;
  description: string;
};

export default function ActivityCard({
  title,
  description,
}: Props) {
  return (
    <div
      style={{
        border: "1px solid #1a1a1a",
        borderRadius: "20px",
        padding: "20px",
      }}
    >
      <h3>{title}</h3>

      <p style={{ marginTop: "10px", color: "#999" }}>
        {description}
      </p>
    </div>
  );
}