type Props = {
  title: string;
  subtitle?: string;
};

export default function SectionTitle({ title, subtitle }: Props) {
  return (
    <div className="mb-10">
      {subtitle ? <p className="mb-3 text-xl text-[#59534b]">{subtitle}</p> : null}
      <h2 className="scribble-underline text-4xl font-bold">{title}</h2>
    </div>
  );
}
