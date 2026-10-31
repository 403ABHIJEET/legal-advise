import Image from "next/image";
import Link from "next/link";

export type SiteInfo = { address: string; phone: string; email: string; mapUrl: string };

export function Disclaimer() {
  return (
    <div className="mx-auto mb-7 mt-0 max-w-[1200px] rounded-xl border border-[#e0e9ef] bg-white p-[18px_22px] text-xs text-[#4d5b70] max-md:mx-3.5">
      <b>Important notice</b>
      <p className="mt-1.5 leading-[1.6]">
        This website is for general informational purposes only and is not an advertisement, solicitation, invitation or inducement to engage legal services. Viewing this website or submitting a query does not create an advocate-client relationship. Do not share confidential or time-sensitive details until the office confirms a secure communication channel.
      </p>
    </div>
  );
}

export function Footer({ info }: { info: SiteInfo }) {
  const a = "text-[#d9e5ee] no-underline hover:text-[#e0bd7a]";
  return (
    <footer className="grid grid-cols-2 gap-[25px] bg-[#082b49] px-[18px] pb-3 pt-[26px] text-[11px] text-[#d9e5ee] md:grid-cols-[1.25fr_.7fr_1.2fr_.6fr] md:px-[clamp(20px,5.8vw,90px)]">
      <div className="col-span-2 flex items-center gap-2.5 md:col-span-1">
        <Image src="/logo.png" alt="Pranj Legal Associates logo" width={70} height={70} className="size-[70px] object-contain" />
        <div className="flex flex-col gap-[5px]">
          <strong className="font-serif text-[15px] font-bold text-white">PRANJ LEGAL ASSOCIATES</strong>
          <small className="italic text-[#c7d8e4]">Solving Your Legal Matters with Expertise</small>
        </div>
      </div>
      <div className="flex flex-col gap-[7px]">
        <strong className="text-[#e0bd7a]">Quick Links</strong>
        <Link href="/#home" className={a}>Home</Link>
        <Link href="/#about" className={a}>About Us</Link>
        <Link href="/#services" className={a}>Services</Link>
        <Link href="/#approach" className={a}>Our Approach</Link>
      </div>
      <div className="flex flex-col gap-[7px]">
        <strong className="text-[#e0bd7a]">Contact Details</strong>
        <span>{info.address || "Office address to be configured"}</span>
        <span>{info.phone ? <a className={a} href={`tel:${info.phone.replace(/[^0-9+]/g, "")}`}>{info.phone}</a> : "Phone number to be configured"}</span>
        <span>{info.email ? <a className={a} href={`mailto:${info.email}`}>{info.email}</a> : "Email address to be configured"}</span>
        <a className={a} href={info.mapUrl || "/#contact"} target={info.mapUrl ? "_blank" : undefined} rel="noopener noreferrer">View location / map</a>
      </div>
      <div className="hidden flex-col justify-center font-serif text-[21px] italic leading-normal text-[#e0bd7a] md:flex">
        Your matter.<br />Our commitment.
      </div>
      <div className="col-span-full mt-2.5 border-t border-white/15 pt-3 text-[#9eb5c6]">
        © {new Date().getFullYear()} Pranj Legal Associates · General information only · <span>Privacy &amp; Terms</span>
      </div>
    </footer>
  );
}
