"use client";

import Link from "next/link";

export default function AdminSidebar() {
  return (
    <aside
      style={{
        width: "250px",
        borderRight: "1px solid #1a1a1a",
        padding: "24px",
      }}
    >
      <h2 style={{ marginBottom: "32px" }}>Admin</h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <Link href="/admin">Dashboard</Link>

        <Link href="/admin/projects">Projects</Link>

        <Link href="/admin/experience">Experience</Link>

        <Link href="/admin/activities">Activities</Link>

        <Link href="/admin/extraactivities">Extra Activities</Link>

        <Link href="/admin/settings">Settings</Link>
      </div>
    </aside>
  );
}
