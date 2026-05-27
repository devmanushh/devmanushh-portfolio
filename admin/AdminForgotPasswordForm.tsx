"use client";

import { ArrowLeft, Mail, Send } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";

import { AdminAuthActions, AdminAuthCard, AdminAuthPage } from "@/admin/AdminAuthCard";
import { requestAdminPasswordReset } from "@/lib/admin-actions";

export function AdminForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(
    requestAdminPasswordReset,
    {
      ok: false,
      message: "",
    },
  );

  return (
    <AdminAuthPage>
      <AdminAuthCard
        eyebrow="email recovery"
        icon={<Mail size={20} />}
        title="Reset password"
        subtitle="Send a one-time reset link to the configured admin email address."
      >
        <form action={formAction} className="admin-login-form">
          {state.message ? (
            <p className={`admin-form-status ${state.ok ? "is-success" : "is-error"}`}>
              {state.message}
            </p>
          ) : null}
          <AdminAuthActions>
            <button type="submit" disabled={isPending}>
              <Send size={17} />
              {isPending ? "Sending..." : "Send reset link"}
            </button>
            <Link href="/admin" className="admin-login-helper">
              <ArrowLeft size={16} />
              Back to sign in
            </Link>
          </AdminAuthActions>
        </form>
      </AdminAuthCard>
    </AdminAuthPage>
  );
}
