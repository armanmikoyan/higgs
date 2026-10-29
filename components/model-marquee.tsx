import { models } from "@/lib/models";

function ModelGroup({ hidden = false }: { hidden?: boolean }) {
  return (
    <div
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-8 pr-8"
    >
      {models.map((model) => (
        <div key={model.name} className="flex items-center gap-2.5">
          <span className="size-1.5 rounded-full bg-jade/70" />
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-cream/75">
            {model.name}
          </span>
          <span className="hidden text-[11px] uppercase tracking-[0.1em] text-cream/55 sm:inline">
            {model.provider}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function ModelMarquee() {
  return (
    <section
      aria-label="Available models"
      className="relative border-y border-cream/10 bg-ink-2/30 py-3"
    >
      <div className="flex items-center gap-4 px-4 md:px-8">
        <span className="shrink-0 font-mono text-xs uppercase tracking-[0.18em] text-cream/60">
          Models
        </span>

        <div className="relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)]">
          <div className="marquee-track flex w-max animate-marquee">
            <ModelGroup />
            <ModelGroup hidden />
          </div>
        </div>

        <span className="hidden shrink-0 font-mono text-xs uppercase tracking-[0.16em] text-cream/55 sm:block">
          6 models · one prompt
        </span>
      </div>
    </section>
  );
}
