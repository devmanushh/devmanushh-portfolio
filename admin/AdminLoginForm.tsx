import { LockKeyhole } from "lucide-react";

import { adminLogin } from "@/lib/admin-actions";

export function AdminLoginForm() {
  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <div className="admin-login-icon">
          <LockKeyhole size={20} />
        </div>
        <h1>Admin login</h1>
        <p>Enter the admin email and password to edit the portfolio.</p>

        <form action={adminLogin} className="admin-login-form">
          <input name="email" type="email" placeholder="Admin email" required />
          <input
            name="password"
            type="password"
            placeholder="Admin password"
            required
          />
          <button type="submit">Sign in</button>
        </form>
      </section>
    </main>
  );
}
