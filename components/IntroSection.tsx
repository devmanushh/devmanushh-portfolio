import type { IntroContent } from "@/lib/profile-store";

export default function IntroSection({ intro }: { intro: IntroContent }) {
  return (
    <section id="home" className="hand-section scroll-mt-28">
      <div className="paper-shell grid items-center gap-10 md:grid-cols-[260px_1fr]">
        <div className="relative mx-auto h-56 w-56 rounded-[48%_52%_45%_55%] border-[3px] border-[#181614] bg-[#fffaf0]/60">
          <div className="absolute left-1/2 top-[28%] h-12 w-12 -translate-x-1/2 rounded-full border-[3px] border-[#181614]" />
          <div className="absolute bottom-8 left-1/2 h-24 w-32 -translate-x-1/2 rounded-t-full border-[3px] border-[#181614]" />
          <div className="absolute -right-2 top-5 h-16 w-10 rotate-[-28deg] rounded-full border-r-[3px] border-[#181614]" />
        </div>

        <div>
          <p className="mb-4 text-2xl font-bold">introduction.</p>
          <h1 className="hand-title max-w-3xl font-bold">
            {intro.heading}
          </h1>
          <div className="mt-8 grid max-w-2xl gap-3 text-2xl leading-8 text-[#4f4942]">
            <p>{intro.lineOne}</p>
            <p>{intro.lineTwo}</p>
            <div className="mt-7 w-fit border-t-2 border-[#181614] pt-4">
              <p className="text-xl font-bold text-[#181614]">
                currently working for
              </p>
              <p className="mt-1 text-2xl text-[#4f4942]">
                {intro.currentCompany} · {intro.currentRole}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
