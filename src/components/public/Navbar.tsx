"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { NAV_SERVICES } from "@/lib/content";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const link = "text-[13px] font-semibold text-[#153858] no-underline hover:text-[#b78635] max-sm:text-[11px]";

  return (
    <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-5 bg-white/90 px-[clamp(14px,5.8vw,90px)] py-2 shadow-[0_2px_14px_#173c5810] backdrop-blur-md sm:min-h-[78px]">
      <Link href="/#home" className="flex min-w-0 items-center gap-2.5 no-underline lg:min-w-[270px]">
        <Image src="/logo.png" alt="Pranj Legal Associates logo" width={72} height={72} priority className="size-[54px] shrink-0 object-contain sm:size-[72px]" />
        <span className="flex flex-col leading-[1.05] text-pnavy">
          <strong className="font-serif text-base font-bold tracking-[.7px] sm:text-[21px]">PRANJ LEGAL</strong>
          <b className="text-center font-serif text-[13px] font-bold sm:text-base">Associates</b>
          <small className="mt-1 font-serif text-[8px] italic text-[#365f7c] sm:text-[10px]">Solving Your Legal Matters with Expertise</small>
        </span>
      </Link>

      <nav className="flex items-center gap-[clamp(10px,1.6vw,24px)] max-sm:w-full max-sm:flex-wrap max-sm:justify-between max-sm:gap-2 max-sm:py-1">
        <Link href="/#home" className={link}>Home</Link>
        <Link href="/#about" className={link}>About Us</Link>

        <div className="relative" ref={menuRef}>
          <button type="button" className={`${link} border-0 bg-transparent py-2.5`} aria-expanded={open} aria-haspopup="true" onClick={() => setOpen((o) => !o)}>
            Services⌄
          </button>
          {open && (
            <div className="absolute right-[-20px] top-full z-20 grid min-w-[250px] rounded-xl border border-[#dbe5ec] bg-white p-2 shadow-[0_18px_35px_#0b315425]">
              {NAV_SERVICES.map((s) => (
                <Link key={s} href="/#services" onClick={() => setOpen(false)} className="block whitespace-nowrap rounded-[7px] px-3 py-2.5 text-[13px] font-semibold text-[#26364e] no-underline hover:bg-canvas">
                  {s}
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link href="/#approach" className={link}>Our Approach</Link>
        <Link href="/#contact" className={link}>Contact Us</Link>
        <Link href="/login" className="btn min-w-[94px] !bg-pnavy px-5 py-2.5 !text-white no-underline hover:!bg-navy-2 max-sm:px-3 max-sm:py-2 max-sm:text-[11px]">
          ♙ Login
        </Link>
      </nav>
    </header>
  );
}
