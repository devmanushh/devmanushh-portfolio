import AdminToaster from "@/admin/AdminToaster";
import "@/styles/admin.css";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminToaster />
      {children}
    </>
  );
}
