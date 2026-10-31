export function About() {
  return (
    <section id="about" className="grid items-center gap-[18px] border-y border-[#dfeaf0] bg-[#eaf3f8b8] px-5 py-[30px] md:grid-cols-[.75fr_1.25fr] md:gap-[45px] md:px-[clamp(20px,8vw,125px)] md:py-[25px]">
      <div>
        <div className="eyebrow">About the Firm</div>
        <h2 className="my-[7px] font-serif text-[27px] font-bold text-pnavy sm:text-[30px]">Professional guidance.<br />Clear communication.</h2>
      </div>
      <p className="m-0 text-sm leading-[1.8] text-[#60778c]">
        Legal concerns can be stressful and complex. Our approach is to understand the issue, explain available options in plain language and help you identify appropriate next steps. Every matter is different; advice depends on the facts and applicable law.
      </p>
    </section>
  );
}
