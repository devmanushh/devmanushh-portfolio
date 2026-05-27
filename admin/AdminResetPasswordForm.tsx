"use client";

import { ArrowLeft, KeyRound, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";

import { AdminAuthActions, AdminAuthCard, AdminAuthPage } from "@/admin/AdminAuthCard";
import { resetAdminPassword } from "@/lib/admin-actions";

export function AdminResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, isPending] = useActionState(resetAdminPassword, {
    ok: false,
    message: "",
  });

  return (
    <AdminAuthPage>
      <AdminAuthCard
        eyebrow="credential reset"
        icon={<KeyRound size={20} />}
        title="New password"
        subtitle="Choose a new password for the portfolio admin account."
      >
        <form action={formAction} className="admin-login-form">
          <input type="hidden" name="token" value={token} />
          <label>
            <span>New password</span>
            <input
              name="password"
              type="password"
              placeholder="New password"
              minLength={8}
              required
            />
          </label>
          <label>
            <span>Confirm password</span>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              minLength={8}
              required
            />
          </label>
          {state.message ? (
            <p className={`admin-form-status ${state.ok ? "is-success" : "is-error"}`}>
              {state.message}
            </p>
          ) : null}
          <AdminAuthActions>
            <button type="submit" disabled={isPending || state.ok}>
              <ShieldCheck size={17} />
              {isPending ? "Resetting..." : "Reset password"}
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
