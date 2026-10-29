"use client";

import {
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type TouchEvent as ReactTouchEvent,
} from "react";
import { ArrowLeft, ArrowRight, ChevronUp } from "lucide-react";
import { Clip } from "@/components/clip";
import { BuyButton } from "@/components/paywall";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { clips } from "@/lib/clips";
import { models } from "@/lib/models";
import { formatUSD, getQuote } from "@/lib/pricing";

function Arrow({ direction }: { direction: "left" | "right" }) {
  const Icon = direction === "left" ? ArrowLeft : ArrowRight;
  return <Icon className="size-4" aria-hidden="true" />;
}

export default function Reels() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const drag = useRef({
    active: false,
    moved: false,
    startX: 0,
    scrollLeft: 0,
  });

  const scrollBy = (direction: 1 | -1) => {
    const element = scrollerRef.current;
    if (!element) return;
    element.scrollBy({
      left: direction * Math.max(280, element.clientWidth * 0.8),
      behavior: "smooth",
    });
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    const element = scrollerRef.current;
    if (!element) return;
    drag.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      scrollLeft: element.scrollLeft,
    };
    element.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    const element = scrollerRef.current;
    if (!element) return;
    const delta = event.clientX - drag.current.startX;
    if (Math.abs(delta) > 4) drag.current.moved = true;
    element.scrollLeft = drag.current.scrollLeft - delta;
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    const element = scrollerRef.current;
    if (element?.hasPointerCapture(event.pointerId)) {
      element.releasePointerCapture(event.pointerId);
    }
  };

  const clipTouch = useRef<{
    x: number;
    y: number;
    scrollLeft: number;
    horizontal: boolean;
  } | null>(null);

  const onClipTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    const scroller = scrollerRef.current;
    if (!touch || !scroller) return;
    clipTouch.current = {
      x: touch.clientX,
      y: touch.clientY,
      scrollLeft: scroller.scrollLeft,
      horizontal: false,
    };
  };

  const onClipTouchMove = (event: ReactTouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    const scroller = scrollerRef.current;
    const start = clipTouch.current;
    if (!touch || !scroller || !start) return;
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (!start.horizontal && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
      start.horizontal = true;
    }
    if (start.horizontal) {
      scroller.scrollLeft = start.scrollLeft - dx;
    }
  };

  const onClipTouchEnd = () => {
    clipTouch.current = null;
  };

  const [activeClip, setActiveClip] = useState<Record<string, number>>({});

  const groups = models.map((model) => ({
    model,
    clips: clips.filter((clip) => clip.model === model.name),
  }));

  return (
    <section
      id="reels"
      className="relative overflow-hidden border-y border-cream/10 bg-ink-2/30 py-10 md:py-12"
    >
      <div className="w-full px-4 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">The reel</p>
            <h2 className="mt-2 text-[clamp(2.25rem,5vw,3.75rem)] font-semibold leading-[0.9] tracking-[-0.05em]">
              Made with{" "}
              <em className="font-serif font-normal italic tracking-[-0.02em] text-jade">
                SABLE
              </em>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <p className="hidden max-w-[240px] text-right text-sm leading-relaxed text-cream/65 sm:block">
              Swipe models, scroll clips. Every frame made from a prompt — and
              paid for per video.
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => scrollBy(-1)}
                aria-label="Previous models"
                className="grid h-9 w-9 place-items-center rounded-full border border-cream/15 p-0 text-cream/60 hover:border-jade/40 hover:bg-transparent hover:text-jade"
              >
                <Arrow direction="left" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => scrollBy(1)}
                aria-label="Next models"
                className="grid h-9 w-9 place-items-center rounded-full border border-cream/15 p-0 text-cream/60 hover:border-jade/40 hover:bg-transparent hover:text-jade"
              >
                <Arrow direction="right" />
              </Button>
            </div>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-cream/65 sm:hidden">
          Swipe sideways for models · scroll inside a clip for more.
        </p>
      </div>

      <div className="mt-6">
        <div
          ref={scrollerRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={endDrag}
          onClickCapture={(event) => {
            if (drag.current.moved) {
              event.preventDefault();
              event.stopPropagation();
              drag.current.moved = false;
            }
          }}
          className="no-scrollbar flex cursor-grab snap-x snap-mandatory items-start gap-3 overflow-x-auto px-[max(1rem,calc(50vw-130px))] pb-2 active:cursor-grabbing md:snap-proximity md:gap-4 md:px-8"
        >
          {groups.map((group) => (
            <div
              key={group.model.name}
              className="flex w-[68vw] max-w-[260px] shrink-0 snap-center flex-col gap-2 sm:w-[260px] md:snap-start"
            >
              <div className="px-1">
                <p className="font-serif text-2xl italic leading-none tracking-[-0.02em] text-jade">
                  {group.model.name}
                </p>
                <p className="mt-1 font-mono text-xs uppercase tracking-[0.16em] text-cream/55">
                  {group.model.provider}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center gap-0.5">
                <ChevronUp className="size-4 animate-bounce text-cream/40" />
                <span className="font-mono text-xs uppercase tracking-[0.16em] text-cream/55">
                  Swipe
                </span>
              </div>
              <article className="relative overflow-hidden rounded-[22px] bg-ink-3">
                <div
                  className="no-scrollbar h-[460px] w-full touch-pan-y snap-y snap-mandatory overflow-y-auto overscroll-contain"
                  onPointerDown={(event) => event.stopPropagation()}
                  onTouchStart={onClipTouchStart}
                  onTouchMove={onClipTouchMove}
                  onTouchEnd={onClipTouchEnd}
                  onTouchCancel={onClipTouchEnd}
                  onScroll={(event) => {
                    const el = event.currentTarget;
                    const slideHeight = el.clientHeight || 1;
                    const idx = Math.max(
                      0,
                      Math.min(
                        group.clips.length - 1,
                        Math.round(el.scrollTop / slideHeight)
                      )
                    );
                    setActiveClip((prev) =>
                      prev[group.model.name] === idx
                        ? prev
                        : { ...prev, [group.model.name]: idx }
                    );
                  }}
                >
                {group.clips.length > 0 ? (
                  group.clips.map((clip) => (
                    <div
                      key={clip.id}
                      className="h-full w-full shrink-0 snap-start snap-always"
                    >
                      <Clip src={clip.src} poster={clip.poster} color={clip.color} className="size-full" />
                    </div>
                  ))
                ) : (
                  <div className="grid h-full place-items-center text-cream/40">
                    <p className="font-mono text-xs uppercase tracking-[0.16em]">
                      {group.model.name}
                    </p>
                  </div>
                )}
              </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center justify-center gap-1.5 bg-gradient-to-t from-ink/90 via-ink/50 to-transparent px-3 pb-3 pt-8 text-[11px] uppercase tracking-[0.14em] text-cream/75 md:hidden">
                  <ChevronUp className="size-3.5" />
                  Swipe up for more clips
                </div>
              </article>

              {group.clips.length > 0 && (() => {
                const idx = activeClip[group.model.name] ?? 0;
                const clip = group.clips[idx];
                return (
                  <div className="space-y-1 px-1">
                    <div className="flex items-center justify-between gap-2">
                      <Badge
                        variant="outline"
                        className="h-auto rounded-full border-transparent bg-ink/45 px-2.5 py-1 font-mono text-xs font-normal tracking-[0.08em] text-cream/65 backdrop-blur-md"
                      >
                        {clip.duration}
                      </Badge>
                      <span className="font-mono text-xs tabular-nums text-cream/80">
                        {formatUSD(getQuote(1).unit)}
                      </span>
                    </div>
                    <h3 className="text-sm font-medium tracking-[-0.02em]">
                      {clip.title}
                    </h3>
                    <p className="line-clamp-2 text-sm leading-relaxed text-cream/60">
                      {clip.prompt}
                    </p>
                    <p className="font-mono text-xs uppercase tracking-[0.16em] text-jade/85">
                      {String(idx + 1).padStart(2, "0")} /{" "}
                      {String(group.clips.length).padStart(2, "0")}
                    </p>
                  </div>
                );
              })()}
            </div>
          ))}

          <div className="flex w-[68vw] max-w-[260px] shrink-0 snap-center flex-col gap-2 sm:w-[260px] md:snap-start">
            <div className="flex flex-col items-center justify-center gap-0.5 opacity-0">
              <ChevronUp className="size-4" />
              <span className="font-mono text-xs uppercase tracking-[0.16em]">Swipe</span>
            </div>
            <div className="px-1">
              <p className="font-serif text-2xl italic leading-none tracking-[-0.02em] text-jade">
                Your slot
              </p>
              <p className="mt-1 font-mono text-xs uppercase tracking-[0.16em] text-cream/55">
                SABLE
              </p>
            </div>
            <article className="relative flex h-[460px] flex-col justify-between overflow-hidden rounded-[22px] bg-jade p-6 text-ink">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink/70">
                Slot 07 — yours
              </p>
              <div>
                <p className="font-serif text-[clamp(2rem,3.2vw,3rem)] italic leading-[0.95] tracking-[-0.02em]">
                  Your next
                  <br />
                  clip goes
                  <br />
                  here.
                </p>
                <BuyButton className="mt-6 inline-flex h-auto items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-ink-3 hover:text-cream">
                  Buy videos
                  <Arrow direction="right" />
                </BuyButton>
              </div>
            </article>
            <div className="space-y-1 px-1">
              <p className="text-sm leading-relaxed text-cream/60">
                Buy only the videos you need. No subscription, no credits.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex w-full items-center justify-between px-4 md:px-8">
        <span className="font-mono text-xs uppercase tracking-[0.16em] text-cream/55">
          Swipe / scroll
        </span>
        <span className="font-mono text-xs uppercase tracking-[0.16em] text-cream/55">
          {models.length} models · 9:16 · 4K
        </span>
      </div>
    </section>
  );
}
