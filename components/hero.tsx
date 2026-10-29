import { ArrowRight } from "lucide-react";
import { WordRotate } from "@/components/magicui/word-rotate";
import PromptComposer from "@/components/prompt-composer";
import { Button } from "@/components/ui/button";
import VideoRetroGrid from "@/components/video-retro-grid";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[92svh] flex-col overflow-hidden bg-ink pt-20"
    >
      <div className="absolute inset-0">
        <VideoRetroGrid />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_55%_at_50%_42%,rgba(7,8,10,0.88)_0%,rgba(7,8,10,0.62)_55%,rgba(7,8,10,0.18)_78%,transparent_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-ink via-ink/70 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-ink via-ink/70 to-transparent" />
      </div>

      <div className="relative z-10 flex w-full flex-1 flex-col px-4 pb-6 pt-8 md:px-8 md:pb-8 md:pt-10">
        <div className="mx-auto max-w-4xl text-center">
          <p className="eyebrow">Pay as you go</p>

          <h1 className="mx-auto mt-4 max-w-4xl text-[clamp(3rem,6.5vw,6.5rem)] font-semibold leading-[0.88] tracking-[-0.065em]">
            Cinematic video
            <br />
            <WordRotate
              words={["on demand.", "per video.", "on your terms."]}
              containerClassName="mt-1 md:mt-2"
              className="font-serif font-normal italic tracking-[-0.02em] text-jade"
            />
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-cream/65 md:text-base">
            Describe the shot, pick a model, and pay only for the videos you
            make. No subscription, no credit packs, no waste.
          </p>
        </div>

        <div className="mt-auto pt-8 md:pt-10">
          <PromptComposer />

          <div className="mx-auto mt-3 flex w-full max-w-3xl flex-wrap items-center justify-center gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-cream/60">
              1 video = $1.60 · No subscription
            </span>
            <Button
              asChild
              variant="ghost"
              className="inline-flex h-auto items-center gap-1.5 rounded-full border border-cream/10 bg-ink/45 px-3.5 py-1.5 text-sm font-normal text-cream/70 backdrop-blur-md transition-colors hover:border-cream/30 hover:bg-cream/10 hover:text-cream"
            >
              <a href="#reels">
                See the reels
                <ArrowRight className="size-3.5" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
