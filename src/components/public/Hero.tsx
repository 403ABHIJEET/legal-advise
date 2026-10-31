import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section
      id="home"
      className="relative isolate grid min-h-[350px] items-center gap-3 overflow-hidden border-b border-[#dce8ef] bg-[linear-gradient(90deg,#f8fbfdf5_0%,#f7fbf9eb_38%,#d9eaf2a8_100%)] px-[clamp(22px,8vw,130px)] pb-8 pt-[38px] max-md:py-8 md:grid-cols-[1fr_.7fr] lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,.85fr)_130px]"
    >
      <div aria-hidden className="pointer-events-none absolute left-[39%] top-[-80px] -z-10 rotate-[-8deg] text-[390px] leading-none text-[#123c5b0b]">⚖</div>
      <div aria-hidden className="pointer-events-none absolute -bottom-[60px] right-[5%] -z-10 text-[240px] text-[#0a38500a]">⚖</div>
      <div aria-hidden className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,#f9fbfdf2,#eaf4f7a8),radial-gradient(circle_at_78%_30%,#bdd9e6_0,transparent_45%)]" />

      <div className="relative z-[2] max-w-[620px]">
        <div className="eyebrow"><span className="mr-2 inline-block h-0.5 w-[34px] bg-pgold align-middle" /> Welcome to Pranj Legal Associates</div>
        <h1 className="my-[13px] font-serif text-[clamp(34px,3.4vw,52px)] font-bold leading-[1.1] tracking-[-.6px] text-pnavy max-sm:text-[35px]">
          Your Rights, Our Priority.<br />
          <em className="text-[.72em] font-semibold text-[#1e6383]">Solving Your Legal Problems</em>
        </h1>
        <p className="max-w-[510px] text-[15px] leading-[1.65] text-[#385772]">
          Trusted legal guidance for individuals, families and businesses. We approach every matter with preparation, clear communication and respect for your circumstances.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/#services" className="btn !rounded-3xl !bg-pnavy px-5 py-3 text-[13px] no-underline">Explore Our Services&nbsp; →</Link>
          <Link href="/#contact" className="btn !rounded-3xl border border-[#9bb6c9] !bg-white/70 px-5 py-3 text-[13px] !text-pnavy no-underline">Get in Touch</Link>
        </div>
        <div className="mt-5 flex flex-wrap gap-4 text-[11px] text-[#48657d] max-sm:gap-2">
          <span>✓ Clear next steps</span><span>✓ Client-focused guidance</span><span>✓ Professional care</span>
        </div>
      </div>

      <div className="relative z-[1] min-h-[290px] self-stretch max-sm:-mt-2.5 max-sm:min-h-[230px]">
        <Image src="/hero.png" alt="Illustration of a lawyer with legal books" fill sizes="(max-width: 768px) 90vw, 400px" className="object-contain object-[center_20%] mix-blend-multiply saturate-[.9]" priority />
      </div>

      <blockquote className="z-[1] m-0 hidden border-y-2 border-pgold py-3.5 text-center font-serif text-[17px] italic leading-normal text-[#244d6d] lg:block">
        “Justice is not just a goal; it is our commitment.”
      </blockquote>
    </section>
  );
}
