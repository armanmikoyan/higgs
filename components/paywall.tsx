"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { Check, X } from "lucide-react";
import { RollingNumber } from "@/components/magicui/rolling-number";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import {
  MAX_VIDEOS,
  MIN_VIDEOS,
  clampQuantity,
  formatUSD,
  getQuote,
} from "@/lib/pricing";

type PaywallContextValue = {
  openPaywall: (quantity?: number) => void;
  closePaywall: () => void;
};

const PaywallContext = createContext<PaywallContextValue | null>(null);

export function usePaywall() {
  const context = useContext(PaywallContext);
  if (!context) {
    throw new Error("usePaywall must be used inside PaywallProvider");
  }
  return context;
}

const sliderStyles =
  "[&_[data-slot=slider-track]]:h-0.5 [&_[data-slot=slider-track]]:bg-cream/[0.14] [&_[data-slot=slider-range]]:min-w-3 [&_[data-slot=slider-range]]:rounded-full [&_[data-slot=slider-range]]:bg-jade [&_[data-slot=slider-thumb]]:size-[18px] [&_[data-slot=slider-thumb]]:border-[3px] [&_[data-slot=slider-thumb]]:border-ink [&_[data-slot=slider-thumb]]:bg-jade [&_[data-slot=slider-thumb]]:ring-1 [&_[data-slot=slider-thumb]]:ring-jade/55 [&_[data-slot=slider-thumb]]:shadow-none [&_[data-slot=slider-thumb]]:hover:ring-1 [&_[data-slot=slider-thumb]]:focus-visible:ring-1 [&_[data-slot=slider-thumb]]:active:ring-1";

function QuantityButton({
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      type="button"
      variant="ghost"
      className="h-9 w-9 rounded-full border border-cream/15 p-0 text-lg leading-none font-normal text-cream/60 hover:border-jade/40 hover:bg-transparent hover:text-jade disabled:cursor-not-allowed disabled:opacity-30"
      {...props}
    >
      {children}
    </Button>
  );
}

function PaywallBody({
  quantity,
  setQuantity,
  onClose,
}: {
  quantity: number;
  setQuantity: Dispatch<SetStateAction<number>>;
  onClose: () => void;
}) {
  const [paid, setPaid] = useState(false);
  const quote = getQuote(quantity);

  return (
    <div className="relative">
      <DialogClose asChild>
        <Button
          type="button"
          variant="ghost"
          autoFocus
          aria-label="Close"
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-cream/10 p-0 text-cream/50 hover:border-cream/25 hover:bg-transparent hover:text-cream focus-visible:border-cream/10 focus-visible:ring-0"
        >
          <X className="size-4" />
        </Button>
      </DialogClose>

      {paid ? (
        <div className="py-6 text-center" aria-live="polite">
          <span className="mx-auto grid size-14 place-items-center rounded-full border border-jade/30 bg-jade/10 text-jade">
            <Check className="size-6" />
          </span>
          <DialogTitle className="mt-6 text-2xl font-medium tracking-[-0.03em]">
            Videos added.
          </DialogTitle>
          <DialogDescription className="mx-auto mt-3 max-w-sm text-base leading-relaxed text-cream/60">
            {quote.quantity} {quote.quantity === 1 ? "video is" : "videos are"}{" "}
            in your wallet. You paid {formatUSD(quote.total)} — no subscription,
            nothing to cancel.
          </DialogDescription>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="mt-8 h-12 w-full rounded-full bg-cream text-base font-medium text-ink hover:bg-jade hover:text-ink"
          >
            Done
          </Button>
        </div>
      ) : (
        <>
          <p className="eyebrow">Pay as you go</p>
          <DialogTitle className="mt-3 text-3xl font-medium tracking-[-0.04em]">
            Buy videos
          </DialogTitle>
          <DialogDescription className="mt-2 max-w-sm text-base leading-relaxed text-cream/60">
            Pick your video count. One payment for exactly the videos you need
            — no subscription, no credits.
          </DialogDescription>

          <div className="mt-7 rounded-2xl border border-cream/10 bg-ink p-5">
            <div className="flex items-center justify-between">
              <span className="text-base text-cream/70">Videos</span>
              <div className="flex items-center gap-3">
                <QuantityButton
                  onClick={() =>
                    setQuantity((value) => Math.max(MIN_VIDEOS, value - 1))
                  }
                  disabled={quantity <= MIN_VIDEOS}
                  aria-label="Decrease videos"
                >
                  −
                </QuantityButton>
                <span className="flex w-10 justify-center">
                  <RollingNumber
                    value={quantity}
                    className="text-xl font-medium"
                  />
                </span>
                <QuantityButton
                  onClick={() =>
                    setQuantity((value) => Math.min(MAX_VIDEOS, value + 1))
                  }
                  disabled={quantity >= MAX_VIDEOS}
                  aria-label="Increase videos"
                >
                  +
                </QuantityButton>
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
            <div className="mt-3 flex justify-between font-mono text-xs uppercase tracking-[0.14em] text-cream/55">
              <span>1 video</span>
              <span>100 videos</span>
            </div>
          </div>

          <div className="mt-6 space-y-3 text-base">
            <div className="flex justify-between">
              <span className="text-cream/60">Unit price</span>
              <RollingNumber
                value={quote.unit}
                decimalPlaces={2}
                prefix="$"
              />
            </div>
            <div className="flex justify-between">
              <span className="text-cream/60">Videos</span>
              <RollingNumber value={quote.quantity} />
            </div>
            <div
              aria-hidden={quote.savings <= 0}
              className={`flex justify-between text-jade ${
                quote.savings <= 0 ? "invisible" : ""
              }`}
            >
              <span>Volume saving</span>
              <RollingNumber
                value={quote.savings}
                decimalPlaces={2}
                prefix="−$"
              />
            </div>
            <div className="flex items-baseline justify-between border-t border-cream/10 pt-4">
              <span className="text-cream/60">Total</span>
              <RollingNumber
                value={quote.total}
                decimalPlaces={2}
                prefix="$"
                className="text-3xl font-medium tracking-[-0.03em]"
              />
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            onClick={() => setPaid(true)}
            className="mt-7 h-12 w-full rounded-full bg-jade text-base font-medium text-ink hover:bg-cream hover:text-ink"
          >
            Pay <RollingNumber value={quote.total} decimalPlaces={2} prefix="$" />
          </Button>
          <p className="mt-4 text-center font-mono text-xs uppercase tracking-[0.14em] text-cream/55">
            One-time payment · No subscription
          </p>
        </>
      )}
    </div>
  );
}

export function PaywallProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const openPaywall = useCallback((nextQuantity = 1) => {
    setQuantity(clampQuantity(nextQuantity));
    setIsOpen(true);
  }, []);

  const closePaywall = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ openPaywall, closePaywall }),
    [openPaywall, closePaywall]
  );

  return (
    <PaywallContext.Provider value={value}>
      {children}
      <Dialog open={isOpen} onOpenChange={(open) => !open && closePaywall()}>
        <DialogContent
          showCloseButton={false}
          className="bottom-4 left-4 right-4 top-auto z-[100] block max-h-[calc(100svh-2rem)] w-auto max-w-none translate-x-0 translate-y-0 gap-0 overflow-y-auto rounded-[26px] border border-cream/10 bg-ink-2 p-5 text-cream shadow-[0_40px_120px_rgba(0,0,0,0.7)] ring-0 sm:bottom-auto sm:left-1/2 sm:right-auto sm:top-1/2 sm:w-full sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:p-8"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_50%_at_50%_0%,rgba(94,199,165,0.1),transparent_65%)]" />
          <PaywallBody
            quantity={quantity}
            setQuantity={setQuantity}
            onClose={closePaywall}
          />
        </DialogContent>
      </Dialog>
    </PaywallContext.Provider>
  );
}

export function BuyButton({
  children,
  className,
  quantity = 1,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { quantity?: number }) {
  const { openPaywall } = usePaywall();

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => openPaywall(quantity)}
      className={className}
      {...props}
    >
      {children}
    </Button>
  );
}
