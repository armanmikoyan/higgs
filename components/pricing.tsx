"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { RollingNumber } from "@/components/magicui/rolling-number";
import { BuyButton } from "@/components/paywall";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { MAX_VIDEOS, MIN_VIDEOS, getQuote } from "@/lib/pricing";
import { cn } from "@/lib/utils";

const tiers = [
  {
    label: "1–9",
    price: "$1.60",
    start: 1,
    active: (quantity: number) => quantity < 10,
  },
  {
    label: "10–49",
    price: "$1.30",
    start: 10,
    active: (quantity: number) => quantity >= 10 && quantity < 50,
  },
  {
    label: "50–100",
    price: "$0.95",
    start: 50,
    active: (quantity: number) => quantity >= 50,
  },
];

const sliderStyles =
  "[&_[data-slot=slider-track]]:h-0.5 [&_[data-slot=slider-track]]:bg-cream/[0.14] [&_[data-slot=slider-range]]:min-w-3 [&_[data-slot=slider-range]]:rounded-full [&_[data-slot=slider-range]]:bg-jade [&_[data-slot=slider-thumb]]:size-[18px] [&_[data-slot=slider-thumb]]:border-[3px] [&_[data-slot=slider-thumb]]:border-ink [&_[data-slot=slider-thumb]]:bg-jade [&_[data-slot=slider-thumb]]:ring-1 [&_[data-slot=slider-thumb]]:ring-jade/55 [&_[data-slot=slider-thumb]]:shadow-none [&_[data-slot=slider-thumb]]:hover:ring-1 [&_[data-slot=slider-thumb]]:focus-visible:ring-1 [&_[data-slot=slider-thumb]]:active:ring-1";

export default function Pricing() {
  const [quantity, setQuantity] = useState(1);
  const quote = getQuote(quantity);

  return (
    <section
      id="pricing"
      className="relative overflow-hidden border-t border-cream/10 bg-ink py-10 md:py-12"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(94,199,165,0.08),transparent_70%)]" />

      <div className="relative w-full px-4 md:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow">Pricing</p>
          <h2 className="mt-4 text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[0.9] tracking-[-0.055em]">
            Pay for what you{" "}
            <em className="font-serif font-normal italic tracking-[-0.02em] text-jade">
              make.
            </em>
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-cream/60">
            No subscription. No credit packs. Choose your video count, unlock a
            lower per-video rate, and pay once — from $1.60 per video.
          </p>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-3xl border border-cream/10 bg-ink-2 p-5 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-cream/60">
                  Videos
                </p>
                <div className="mt-2 flex items-end gap-3">
                  <RollingNumber
                    value={quote.quantity}
                    className="text-4xl font-medium tracking-[-0.04em]"
                  />
                  <span className="pb-1 text-base text-cream/60">
                    / {MAX_VIDEOS}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    setQuantity((value) => Math.max(MIN_VIDEOS, value - 1))
                  }
                  disabled={quantity <= MIN_VIDEOS}
                  aria-label="Decrease videos"
                  className="grid h-10 w-10 place-items-center rounded-full border border-cream/15 p-0 text-lg leading-none font-normal text-cream/60 hover:border-jade/40 hover:bg-transparent hover:text-jade disabled:cursor-not-allowed disabled:opacity-30"
                >
                  −
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    setQuantity((value) => Math.min(MAX_VIDEOS, value + 1))
                  }
                  disabled={quantity >= MAX_VIDEOS}
                  aria-label="Increase videos"
                  className="grid h-10 w-10 place-items-center rounded-full border border-cream/15 p-0 text-lg leading-none font-normal text-cream/60 hover:border-jade/40 hover:bg-transparent hover:text-jade disabled:cursor-not-allowed disabled:opacity-30"
                >
                  +
                </Button>
              </div>
            </div>

            <Slider
              value={[quantity]}
              min={MIN_VIDEOS}
              max={MAX_VIDEOS}
              step={1}
              onValueChange={([value]) => setQuantity(value)}
              aria-label="Number of videos"
              className={`mt-6 w-full ${sliderStyles}`}
            />
            <div className="mt-3 flex justify-between font-mono text-[11px] uppercase tracking-[0.12em] text-cream/55 sm:text-xs sm:tracking-[0.14em]">
              <span>1 video</span>
              <span>100 videos</span>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2">
              {tiers.map((tier) => {
                const active = tier.active(quote.quantity);
                return (
                  <Button
                    key={tier.label}
                    type="button"
                    variant="ghost"
                    onClick={() => setQuantity(tier.start)}
                    className={cn(
                      "h-auto flex-col items-start justify-start rounded-2xl border p-3 text-left text-cream transition-colors hover:text-cream sm:p-4",
                      active
                        ? "border-jade/50 bg-jade/10 hover:border-jade/60 hover:bg-jade/15"
                        : "border-cream/12 hover:border-cream/30 hover:bg-cream/[0.05]"
                    )}
                  >
                    <span
                      className={`font-mono text-[11px] uppercase tracking-[0.12em] sm:text-xs sm:tracking-[0.14em] ${
                        active ? "text-jade" : "text-cream/55"
                      }`}
                    >
                      {tier.label}
                    </span>
                    <span className="mt-2 block text-lg font-medium tracking-[-0.02em] sm:text-xl">
                      {tier.price}
                      <span className="ml-1 hidden text-xs font-normal text-cream/55 sm:inline">
                        / video
                      </span>
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-3xl border border-cream/10 bg-ink-2 p-5 md:p-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-cream/60">
                Your order
              </p>
              <div className="mt-5 space-y-3 text-base">
                <div className="flex justify-between">
                  <span className="text-cream/60">Videos</span>
                  <RollingNumber value={quote.quantity} />
                </div>
                <div className="flex justify-between">
                  <span className="text-cream/60">Unit price</span>
                  <RollingNumber
                    value={quote.unit}
                    decimalPlaces={2}
                    prefix="$"
                  />
                </div>
                <div
                  aria-hidden={quote.savings <= 0}
                  className={cn(
                    "flex justify-between text-jade",
                    quote.savings <= 0 && "invisible"
                  )}
                >
                  <span>Volume saving</span>
                  <RollingNumber
                    value={quote.savings}
                    decimalPlaces={2}
                    prefix="−$"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-end justify-between border-t border-cream/10 pt-5">
                <span className="text-base text-cream/60">Total</span>
                <RollingNumber
                  value={quote.total}
                  decimalPlaces={2}
                  prefix="$"
                  className="text-3xl font-medium tracking-[-0.03em]"
                />
              </div>
            </div>

            <div className="mt-6">
              <BuyButton
                quantity={quote.quantity}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-cream text-base font-medium text-ink transition-colors hover:bg-jade hover:text-ink"
              >
                Buy <RollingNumber value={quote.quantity} />{" "}
                {quote.quantity === 1 ? "video" : "videos"}
                <ArrowRight className="size-4" />
              </BuyButton>
              <p className="mt-4 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-cream/50 sm:text-xs sm:tracking-[0.14em]">
                One-time payment · No subscription
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
