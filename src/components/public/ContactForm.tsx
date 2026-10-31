"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitEnquiry } from "@/actions/enquiry";
import { AREAS_OF_LAW } from "@/lib/content";

const input = "w-full rounded-[7px] border border-[#dce6ed] bg-white p-[11px] text-xs text-ink outline-none focus:ring-4 focus:ring-white/30";
const label = "mb-1 block text-[11px] text-[#e3edf5]";

export function ContactForm({ defaultArea }: { defaultArea?: string }) {
  const [state, action, pending] = useActionState(submitEnquiry, null);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);

  return (
    <form
      key={defaultArea ?? "none"}
      ref={ref}
      action={action}
      className="grid gap-3 rounded-2xl bg-[linear-gradient(150deg,#0b3154,#104d72)] p-5 text-white shadow-[0_20px_42px_#0b315425] sm:grid-cols-2 sm:p-[25px]"
    >
      <h3 className="m-0 font-serif text-2xl font-bold text-white sm:col-span-2">Book a Consultation</h3>
      <p className="m-0 mb-1 text-xs text-[#d1e2ed] sm:col-span-2">Share a few details to help us understand your enquiry.</p>

      <div><label className={label} htmlFor="name">Full name *</label>
        <input id="name" name="name" required maxLength={120} placeholder="Your name" className={input} autoComplete="name" /></div>
      <div><label className={label} htmlFor="mobile">Mobile number *</label>
        <input id="mobile" name="mobile" type="tel" required inputMode="tel" maxLength={20} placeholder="Mobile number" className={input} autoComplete="tel" /></div>
      <div><label className={label} htmlFor="email">Email address</label>
        <input id="email" name="email" type="email" placeholder="name@example.com" className={input} autoComplete="email" /></div>
      <div><label className={label} htmlFor="areaOfLaw">Area of law *</label>
        <select id="areaOfLaw" name="areaOfLaw" required defaultValue={defaultArea ?? ""} className={input}>
          <option value="">Select area of law</option>
          {AREAS_OF_LAW.map((a) => <option key={a} value={a}>{a}</option>)}
        </select></div>
      <div className="sm:col-span-2"><label className={label} htmlFor="query">Your query *</label>
        <textarea id="query" name="query" required rows={4} maxLength={3000} placeholder="Briefly describe your query" className={input} /></div>

      {/* Honeypot: hidden from people, filled by bots */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <div className="sm:col-span-2">
        <button type="submit" disabled={pending} className="w-full rounded-lg bg-[linear-gradient(90deg,#c49a50,#d4b16d)] px-4 py-3 font-extrabold text-[#172c3e] disabled:opacity-60">
          {pending ? "Sending…" : <>Send Enquiry&nbsp; →</>}
        </button>
        <span role="status" className={`mt-2 block text-xs ${state?.ok ? "text-[#cfe8da]" : "text-[#ffd0d0]"}`}>{state?.message}</span>
      </div>
      <small className="text-[10px] text-[#c1d3df] sm:col-span-2">Submitting this form does not create an advocate-client relationship.</small>
    </form>
  );
}
