export default function AdminPage() {
  return (
    <div>
      <h1>Admin Dashboard</h1>

      <p>Manage your portfolio content from here.</p>

      <div style={{ display: "grid", gap: "16px", marginTop: "24px" }}>
        <div>Projects</div>
        <div>Experience</div>
        <div>Activities</div>
        <div>Extra Activities</div>
        <div>Contact</div>
      </div>
    </div>
  );
}
