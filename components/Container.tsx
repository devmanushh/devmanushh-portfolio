export default function Container({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="paper-shell">{children}</div>;
}
