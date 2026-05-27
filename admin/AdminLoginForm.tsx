import { LogIn, LockKeyhole } from "lucide-react";
import Link from "next/link";

import { AdminAuthActions, AdminAuthCard, AdminAuthPage } from "@/admin/AdminAuthCard";
import { adminLogin } from "@/lib/admin-actions";

export function AdminLoginForm() {
  return (
    <AdminAuthPage>
      <AdminAuthCard
        eyebrow="secure console"
        icon={<LockKeyhole size={20} />}
        title="Admin login"
        subtitle="Enter the admin email and password to edit the portfolio."
      >
        <form action={adminLogin} className="admin-login-form">
          <label>
            <span>Email</span>
            <input name="email" type="email" placeholder="Admin email" required />
          </label>
          <label>
            <span>Password</span>
            <input
              name="password"
              type="password"
              placeholder="Admin password"
              required
            />
          </label>
          <AdminAuthActions>
            <button type="submit">
              <LogIn size={17} />
              Sign in
            </button>
            <Link href="/admin/forgot-password" className="admin-login-helper">
              Forgot password?
            </Link>
          </AdminAuthActions>
        </form>
      </AdminAuthCard>
    </AdminAuthPage>
  );
}
