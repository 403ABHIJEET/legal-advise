import { APPROACH_STEPS } from "@/lib/content";

export function Approach() {
  return (
    <>
      <section id="approach" className="relative mx-auto grid max-w-[1440px] items-center gap-7 px-5 py-[30px] md:px-[clamp(20px,5.8vw,90px)] md:py-9 lg:grid-cols-[.72fr_1.3fr_.8fr]">
        <div className="relative">
          <div className="eyebrow">Our Approach</div>
          <h2 className="mb-[7px] mt-[7px] font-serif text-[27px] font-bold text-pnavy sm:text-[30px]">How We Work</h2>
          <p className="text-[13px] leading-[1.65] text-[#60778c]">A straightforward, transparent process that keeps you informed at every stage.</p>
          <div aria-hidden className="pointer-events-none absolute right-2.5 top-1 text-[100px] text-[#0b31540a]">⚖</div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {APPROACH_STEPS.map((s) => (
            <article key={s.n} className="flex items-start gap-3 border-b border-[#e0e9ef] p-3.5">
              <span className="grid size-9 shrink-0 place-items-center rounded-full border border-[#c9dce8] bg-[#e3eef5] font-extrabold text-pnavy">{s.n}</span>
              <div>
                <h3 className="mb-1 font-serif text-sm font-bold text-pnavy">{s.title}</h3>
                <p className="m-0 text-[11px] leading-[1.55] text-[#60778c]">{s.text}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="rounded-xl bg-[linear-gradient(145deg,#0b3154,#155276)] p-5 text-white shadow-[0_12px_25px_#0b31541c] md:col-span-1 lg:col-auto">
          <strong className="font-serif text-lg font-bold text-[#e0bd7a]">Our commitment</strong>
          <p className="mb-0 text-[13px] leading-[1.7] text-[#e3edf5]">Thoughtful preparation, honest communication and respect for every client’s circumstances.</p>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-[18px] bg-[linear-gradient(100deg,#082a49,#124c70)] px-5 py-5 text-white md:grid-cols-4 md:px-[clamp(24px,8vw,125px)] md:py-[22px]">
        {[["Client-focused", "Guidance"], ["Clear", "Communication"], ["Prepared", "Representation"], ["Professional", "Responsibility"]].map(([a, b]) => (
          <div key={a} className="flex items-center gap-2.5 md:justify-center md:border-r md:border-white/15 md:last:border-0">
            <strong className="font-serif text-xl font-bold text-[#e0b969] max-sm:text-base">{a}</strong>
            <span className="text-[11px] text-[#d5e2eb]">{b}</span>
          </div>
        ))}
      </section>
    </>
  );
}
