import { ContactForm } from "./ContactForm";

export function ContactSection({ defaultArea }: { defaultArea?: string }) {
  return (
    <section id="contact" className="mx-auto grid max-w-[1320px] items-center gap-[18px] px-5 py-[30px] md:grid-cols-[.9fr_1.1fr] md:gap-[42px] md:px-[clamp(20px,5.8vw,90px)] md:py-[42px]">
      <div>
        <div className="eyebrow">Contact Us</div>
        <h2 className="my-[7px] font-serif text-[27px] font-bold text-pnavy sm:text-[30px]">Tell us how we may help.</h2>
        <p className="text-sm leading-[1.8] text-[#60778c]">
          Send a general enquiry and the office can review it and respond through an appropriate channel. Please avoid sharing confidential documents or urgent case details in this form.
        </p>
        {[
          ["✉", "General enquiries", "Use the form to tell us your name, preferred contact details and area of law."],
          ["⌖", "Office details", "Find our address, phone, email and map link in the footer below."],
        ].map(([icon, title, text]) => (
          <div key={title} className="mt-5 flex items-start gap-[13px]">
            <span className="grid size-[38px] shrink-0 place-items-center rounded-[10px] bg-[#e6f0f6] text-xl text-pblue">{icon}</span>
            <div>
              <strong className="font-serif text-pnavy">{title}</strong>
              <p className="my-1 text-xs text-[#60778c]">{text}</p>
            </div>
          </div>
        ))}
      </div>
      <ContactForm defaultArea={defaultArea} />
    </section>
  );
}
