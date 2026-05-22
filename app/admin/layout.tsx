import AdminSidebar from "@/admin/AdminSidebar";
import AdminHeader from "@/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />

      <div style={{ flex: 1 }}>
        <AdminHeader />

        <main style={{ padding: "24px" }}>{children}</main>
      </div>
    </div>
  );
}