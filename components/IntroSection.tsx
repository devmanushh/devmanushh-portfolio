export default function IntroSection() {
  return (
    <section className="hand-section">
      <div className="paper-shell grid items-center gap-10 md:grid-cols-[260px_1fr]">
        <div className="relative mx-auto h-56 w-56 rounded-[48%_52%_45%_55%] border-[3px] border-[#181614] bg-[#fffaf0]/60">
          <div className="absolute left-1/2 top-[28%] h-12 w-12 -translate-x-1/2 rounded-full border-[3px] border-[#181614]" />
          <div className="absolute bottom-8 left-1/2 h-24 w-32 -translate-x-1/2 rounded-t-full border-[3px] border-[#181614]" />
          <div className="absolute -right-2 top-5 h-16 w-10 rotate-[-28deg] rounded-full border-r-[3px] border-[#181614]" />
        </div>

        <div>
          <p className="mb-4 text-2xl font-bold">introduction.</p>
          <h1 className="hand-title max-w-3xl font-bold">
            Software engineer with a messy notebook and a clean build habit.
          </h1>
          <div className="mt-8 grid max-w-2xl gap-3 text-2xl leading-8 text-[#4f4942]">
            <p>Building scalable systems, products, and small experiments.</p>
            <p>Also collecting places, photos, notes, and odd little ideas.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
