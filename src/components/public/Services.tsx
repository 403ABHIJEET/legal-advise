import Link from "next/link";
import { DEFAULT_SERVICES } from "@/lib/content";

export function Services({ campaigns }: { campaigns: { id: string; title: string; description: string }[] }) {
  const items = [
    ...DEFAULT_SERVICES.map((s) => ({ key: s.title, title: s.title, desc: s.desc, area: s.area })),
    ...campaigns.map((c) => ({ key: c.id, title: c.title, desc: c.description, area: "Other / General Query" as const })),
  ];

  return (
    <section id="services" className="mx-auto max-w-[1440px] px-[clamp(20px,5.8vw,90px)] pb-[30px] pt-[35px]">
      <div className="mb-5 text-center">
        <div className="eyebrow">Our Practice Areas</div>
        <h2 className="my-[7px] font-serif text-[27px] font-bold text-pnavy sm:text-[30px]">Legal Services</h2>
        <p className="text-[#60778c]">Practical guidance across a range of legal matters.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {items.map((s) => (
          <article key={s.key} className="min-h-[142px] rounded-xl border border-[#e0e9ef] bg-white/85 p-4 shadow-[0_7px_20px_#133d5808] transition hover:-translate-y-[3px] hover:shadow-[0_12px_24px_#133d5812]">
            <span aria-hidden className="mb-2 block text-[23px] text-pgold">⚖</span>
            <h3 className="mb-1.5 font-serif text-[15px] font-bold text-navy">{s.title}</h3>
            <p className="mb-2 text-xs leading-normal text-[#637a8e]">{s.desc}</p>
            <Link href={`/?service=${encodeURIComponent(s.area)}#contact`} scroll className="text-btn !px-0">Enquire about this →</Link>
          </article>
        ))}
      </div>
    </section>
  );
}
