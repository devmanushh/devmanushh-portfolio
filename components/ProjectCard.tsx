type Props = {
  title: string;
  description: string;
};

export default function ProjectCard({
  title,
  description,
}: Props) {
  return (
    <div
      style={{
        border: "1px solid #1a1a1a",
        borderRadius: "20px",
        padding: "24px",
      }}
    >
      <h3>{title}</h3>

      <p style={{ marginTop: "12px", color: "#999" }}>
        {description}
      </p>
    </div>
  );
}