import type { ReactNode } from "react";

type AdminAuthCardProps = {
  children: ReactNode;
  eyebrow: string;
  icon: ReactNode;
  subtitle: string;
  title: string;
};

export function AdminAuthPage({ children }: { children: ReactNode }) {
  return (
    <main className="admin-auth-page">
      <span className="admin-auth-grid" aria-hidden="true" />
      <span className="admin-auth-ring admin-auth-ring-one" aria-hidden="true" />
      <span className="admin-auth-ring admin-auth-ring-two" aria-hidden="true" />
      <div className="admin-auth-stage">{children}</div>
    </main>
  );
}

export function AdminAuthCard({
  children,
  eyebrow,
  icon,
  subtitle,
  title,
}: AdminAuthCardProps) {
  return (
    <section className="admin-auth-card">
      <div className="admin-auth-card-top">
        <div className="admin-auth-icon">{icon}</div>
        <span>{eyebrow}</span>
      </div>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      {children}
    </section>
  );
}

export function AdminAuthActions({ children }: { children: ReactNode }) {
  return <div className="admin-auth-actions">{children}</div>;
}
