import AdminDashboard from "@/admin/AdminDashboard";
import { AdminLoginForm } from "@/admin/AdminLoginForm";
import Link from "next/link";

import { adminLogout } from "@/lib/admin-actions";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const isAuthenticated = await isAdminAuthenticated();

  if (!isAuthenticated) {
    return <AdminLoginForm />;
  }

  return (
    <div className="admin-shell">
      <AdminSidebar />

      <div className="admin-main">
        <AdminHeader />

        <main className="admin-content">
          <AdminDashboard />
        </main>
      </div>
    </div>
  );
}

function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <h2>Admin</h2>

      <div className="admin-nav">
        <Link href="/admin#hero">Hero Section</Link>
        <Link href="/admin#nomadglobe">Nomad Globe</Link>
        <Link href="/admin#engineering">Engineering Things</Link>
        <Link href="/admin#extra">Extra Activities</Link>
        <Link href="/admin#contact">Contact</Link>
        <form action={adminLogout} className="admin-home-form">
          <button type="submit" className="admin-home-link">
            Home
          </button>
        </form>
      </div>
    </aside>
  );
}

function AdminHeader() {
  return (
    <header className="admin-header">
      <h1>Portfolio Admin</h1>
    </header>
  );
}
