import type { ReactNode } from "react";

type SignalItem = {
  label: string;
  value: string;
};

export function SectionHeader({
  children,
  eyebrow,
  subtitle,
  title,
}: {
  children?: ReactNode;
  eyebrow: string;
  subtitle?: string;
  title?: string;
}) {
  return (
    <div className="section-header-compound">
      <div>
        <span className="section-eyebrow">{eyebrow}</span>
        {title ? <h2 className="section-title">{title}</h2> : null}
        {subtitle ? <p className="section-subtitle">{subtitle}</p> : null}
      </div>
      {children ? <div className="section-header-aside">{children}</div> : null}
    </div>
  );
}

export function SignalStrip({ items }: { items: SignalItem[] }) {
  return (
    <div className="signal-strip" aria-label="Portfolio signals">
      {items.map((item) => (
        <span key={item.label} className="signal-pill">
          <strong>{item.value}</strong>
          <em>{item.label}</em>
        </span>
      ))}
    </div>
  );
}

export function OrbitalFrame({ children }: { children: ReactNode }) {
  return (
    <div className="orbital-frame">
      <span className="orbital-frame-ring orbital-frame-ring-one" aria-hidden="true" />
      <span className="orbital-frame-ring orbital-frame-ring-two" aria-hidden="true" />
      <span className="orbital-frame-node orbital-frame-node-one" aria-hidden="true" />
      <span className="orbital-frame-node orbital-frame-node-two" aria-hidden="true" />
      {children}
    </div>
  );
}
