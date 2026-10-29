"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { BuyButton } from "@/components/paywall";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

const productLinks = [
  {
    title: "Video studio",
    description: "Text to cinematic 9:16",
    href: "#reels",
  },
  {
    title: "Image studio",
    description: "Stills that match your film",
    href: "#how",
  },
  {
    title: "Reels",
    description: "See what people are making",
    href: "#reels",
  },
  {
    title: "API",
    description: "Generate from your own app",
    href: "#pricing",
  },
];

function Wordmark() {
  return (
    <Link href="#top" className="flex items-center gap-2.5" aria-label="SABLE home">
      <span className="grid size-7 place-items-center rounded-full border border-jade/30 bg-jade/10 font-serif text-sm italic text-jade">
        S
      </span>
      <span className="text-sm font-medium uppercase tracking-[0.24em] text-cream">
        SABLE<span className="text-jade">.</span>
      </span>
    </Link>
  );
}

const megaContentStyles =
  "absolute left-1/2 top-full z-[60] hidden w-[calc(100vw-1.5rem)] max-w-5xl -translate-x-1/2 rounded-none bg-transparent p-0 pt-3 text-cream shadow-none ring-0 outline-hidden md:block";

const mobileContentStyles =
  "absolute inset-x-0 top-full z-[60] mt-3 flex max-h-[calc(100svh-5rem)] flex-col gap-0 overflow-y-auto rounded-[22px] border border-cream/10 bg-ink-2/98 p-4 text-cream shadow-2xl ring-0 backdrop-blur-2xl md:hidden";

export default function SiteHeader() {
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };

  const scheduleMegaClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMegaOpen(false), 220);
  };

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!megaOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setMegaOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [megaOpen]);

  return (
    <>
      {mobileOpen && (
        <div
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-ink/70 backdrop-blur-sm md:hidden"
        />
      )}
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3">
        <div ref={containerRef} className="relative mx-auto max-w-5xl">
          <div className="relative flex h-12 items-center justify-between rounded-full border border-cream/10 bg-ink/75 px-2.5 shadow-[0_12px_44px_rgba(0,0,0,0.35)] backdrop-blur-xl md:px-3">
              <Wordmark />

              <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
                <div
                  onMouseEnter={openMega}
                  onMouseLeave={scheduleMegaClose}
                  className="relative"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setMegaOpen((value) => !value)}
                    aria-expanded={megaOpen}
                    aria-haspopup="true"
                    className="flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-normal text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream"
                  >
                    Product
                    <ChevronDown
                      className={cn(
                        "size-2.5 transition-transform duration-300",
                        megaOpen && "rotate-180"
                      )}
                    />
                  </Button>
                </div>
                <Link
                  href="#reels"
                  className="flex h-9 items-center rounded-full px-3 text-sm text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream"
                >
                  Reels
                </Link>
                <Link
                  href="#pricing"
                  className="flex h-9 items-center rounded-full px-3 text-sm text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream"
                >
                  Pricing
                </Link>
              </nav>

              <div className="flex items-center gap-2">
                <BuyButton className="h-9 rounded-full bg-cream px-4 text-sm font-medium text-ink transition-colors hover:bg-jade hover:text-ink">
                  Buy videos
                </BuyButton>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setMobileOpen((value) => !value)}
                  aria-expanded={mobileOpen}
                  aria-label="Toggle menu"
                  className="grid h-8 w-8 place-items-center rounded-full border border-cream/15 p-0 text-cream/70 hover:bg-transparent hover:text-cream md:hidden"
                >
                  <span className="relative block h-3 w-4">
                    <span
                      className={`absolute left-0 top-0 h-px w-4 bg-current transition-transform duration-300 ${
                        mobileOpen ? "translate-y-[5px] rotate-45" : ""
                      }`}
                    />
                    <span
                      className={`absolute left-0 top-[5px] h-px w-4 bg-current transition-opacity duration-300 ${
                        mobileOpen ? "opacity-0" : "opacity-100"
                      }`}
                    />
                    <span
                      className={`absolute left-0 top-[10px] h-px w-4 bg-current transition-transform duration-300 ${
                        mobileOpen ? "-translate-y-[5px] -rotate-45" : ""
                      }`}
                    />
                  </span>
                </Button>
              </div>
            </div>

            {megaOpen && (
            <div
              onMouseEnter={openMega}
              onMouseLeave={scheduleMegaClose}
              className={megaContentStyles}
            >
              <div className="overflow-hidden rounded-[22px] border border-cream/10 bg-ink-2/95 p-2.5 shadow-[0_30px_100px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
                <div className="grid gap-3 md:grid-cols-[1.35fr_1fr]">
                <div className="grid gap-1 sm:grid-cols-2">
                  {productLinks.map((link, index) => (
                    <Link
                      key={link.title}
                      href={link.href}
                      onClick={() => setMegaOpen(false)}
                      className="group rounded-xl p-3 transition-colors hover:bg-cream/10"
                    >
                      <span className="font-mono text-xs uppercase tracking-[0.16em] text-jade/80">
                        0{index + 1}
                      </span>
                      <span className="mt-1.5 block text-base font-medium tracking-[-0.02em] text-cream transition-colors group-hover:text-jade">
                        {link.title}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-cream/65">
                        {link.description}
                      </span>
                    </Link>
                  ))}
                </div>

                <div className="relative overflow-hidden rounded-xl border border-cream/10 bg-ink p-4">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_100%_0%,rgba(94,199,165,0.18),transparent_60%)]" />
                  <div className="relative">
                    <p className="eyebrow">Pay as you go</p>
                    <p className="mt-3 font-serif text-3xl italic leading-[0.95] tracking-[-0.02em] text-cream">
                      1 video.
                      <br />
                      1 payment.
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-cream/60">
                      Buy exactly the videos you need. No subscription, no
                      credits, no waste.
                    </p>
                    <BuyButton className="mt-4 inline-flex h-9 items-center rounded-full bg-jade px-4 text-sm font-medium text-ink transition-colors hover:bg-cream hover:text-ink">
                      Buy videos
                    </BuyButton>
                  </div>
                  </div>
                </div>
              </div>
            </div>
            )}

          {mobileOpen && (
            <div className={mobileContentStyles}>
              <div className="flex flex-col">
                {productLinks.map((link, index) => (
                  <Link
                    key={link.title}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-baseline gap-4 border-b border-cream/10 py-4 last:border-b-0"
                  >
                    <span className="font-mono text-xs text-jade/80">
                      0{index + 1}
                    </span>
                    <span>
                      <span className="block text-xl font-medium tracking-[-0.02em] text-cream">
                        {link.title}
                      </span>
                      <span className="mt-1 block text-sm text-cream/65">
                        {link.description}
                      </span>
                    </span>
                  </Link>
                ))}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Link
                    href="#reels"
                    onClick={() => setMobileOpen(false)}
                    className="flex h-11 items-center justify-center rounded-full border border-cream/15 text-sm text-cream/80"
                  >
                    Reels
                  </Link>
                  <Link
                    href="#pricing"
                    onClick={() => setMobileOpen(false)}
                    className="flex h-11 items-center justify-center rounded-full border border-cream/15 text-sm text-cream/80"
                  >
                    Pricing
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
