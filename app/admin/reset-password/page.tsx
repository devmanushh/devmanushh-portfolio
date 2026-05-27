import Link from "next/link";

import { AdminResetPasswordForm } from "@/admin/AdminResetPasswordForm";

export const dynamic = "force-dynamic";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams?: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const token = params?.token ?? "";

  if (!token) {
    return (
      <main className="admin-login-page">
        <section className="admin-login-card">
          <h1>Reset link missing</h1>
          <p>Request a new password reset link from the admin sign-in page.</p>
          <Link href="/admin/forgot-password" className="admin-login-helper">
            Request reset link
          </Link>
        </section>
      </main>
    );
  }

  return <AdminResetPasswordForm token={token} />;
}
