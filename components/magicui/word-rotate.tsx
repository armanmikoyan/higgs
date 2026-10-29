"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, type MotionProps } from "motion/react";

import { cn } from "@/lib/utils";

interface WordRotateProps {
  words: string[];
  duration?: number;
  motionProps?: MotionProps;
  className?: string;
  containerClassName?: string;
}

export function WordRotate({
  words,
  duration = 2500,
  motionProps = {
    initial: { opacity: 0, y: "-100%" },
    animate: { opacity: 1, y: "0%" },
    exit: { opacity: 0, y: "100%" },
    transition: { duration: 0.28, ease: "easeOut" },
  },
  className,
  containerClassName,
}: WordRotateProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    return () => clearInterval(interval);
  }, [words, duration]);

  return (
    <span
      className={cn(
        "inline-flex overflow-hidden py-1 align-bottom",
        containerClassName
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[index]}
          className={cn("inline-block", className)}
          {...motionProps}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
