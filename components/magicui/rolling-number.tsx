"use client";

import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";

interface RollingNumberProps {
  value: number;
  decimalPlaces?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  digitClassName?: string;
  duration?: number;
}

function RollingDigit({
  digit,
  duration,
  className,
}: {
  digit: string;
  duration: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex h-[1.1em] items-center tabular-nums [clip-path:inset(0_-0.1em)]",
        className
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={digit}
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex h-full items-center leading-none"
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function RollingNumber({
  value,
  decimalPlaces = 0,
  prefix,
  suffix,
  className,
  digitClassName,
  duration = 0.3,
}: RollingNumberProps) {
  const [integerPart, fractionalPart] = value
    .toFixed(decimalPlaces)
    .split(".");
  const integerDigits = integerPart.split("");

  return (
    <span className={cn("inline-flex items-center tabular-nums", className)}>
      {prefix ? <span>{prefix}</span> : null}
      {integerDigits.map((digit, index) => (
        <RollingDigit
          key={`integer-${integerDigits.length - 1 - index}`}
          digit={digit}
          duration={duration}
          className={digitClassName}
        />
      ))}
      {fractionalPart !== undefined ? (
        <>
          <span className="px-[0.02em]">.</span>
          {fractionalPart.split("").map((digit, index) => (
            <RollingDigit
              key={`fraction-${fractionalPart.length - 1 - index}`}
              digit={digit}
              duration={duration}
              className={digitClassName}
            />
          ))}
        </>
      ) : null}
      {suffix ? <span>{suffix}</span> : null}
    </span>
  );
}
