const steps = [
  {
    title: "Imagine it.",
    body: "Describe the shot. Reference a film, a lens, a mood — or just say what you see.",
  },
  {
    title: "Generate it.",
    body: "SABLE routes your prompt to the model best suited to it, in seconds.",
  },
  {
    title: "Post it.",
    body: "Export native 9:16 at up to 4K. Pay once for the clips you make — no timeline, no crew, no queue.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="bg-ink py-10 md:py-12">
      <div className="w-full px-4 md:px-8">
        <div className="flex items-end justify-between gap-6">
          <p className="eyebrow">How it works</p>
          <p className="hidden font-mono text-xs uppercase tracking-[0.16em] text-cream/55 sm:block">
            From idea to feed · Pay per video
          </p>
        </div>

        <div className="mt-6 grid gap-px overflow-hidden rounded-3xl border border-cream/10 bg-cream/10 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="bg-ink p-5 md:p-6">
              <span className="font-mono text-xs uppercase tracking-[0.16em] text-jade/80">
                0{index + 1}
              </span>
              <h3 className="mt-6 font-serif text-3xl italic tracking-[-0.02em] text-cream md:text-4xl">
                {step.title}
              </h3>
              <p className="mt-3 max-w-xs text-base leading-relaxed text-cream/60">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
