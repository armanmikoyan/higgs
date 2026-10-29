"use client";

import { useEffect, useState } from "react";

type TypingOptions = {
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
};

export function useTypingCycle(
  words: readonly string[],
  { typeSpeed = 55, deleteSpeed = 28, pauseDuration = 1600 }: TypingOptions = {}
) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (words.length === 0) return;

    const word = words[wordIndex % words.length];
    let delay = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && text === word) {
      delay = pauseDuration;
    }

    const timeout = setTimeout(() => {
      if (!isDeleting && text === word) {
        setIsDeleting(true);
        return;
      }

      if (isDeleting && text === "") {
        setIsDeleting(false);
        setWordIndex((index) => (index + 1) % words.length);
        return;
      }

      setText(
        isDeleting
          ? word.slice(0, Math.max(0, text.length - 1))
          : word.slice(0, text.length + 1)
      );
    }, delay);

    return () => clearTimeout(timeout);
  }, [
    text,
    isDeleting,
    wordIndex,
    words,
    typeSpeed,
    deleteSpeed,
    pauseDuration,
  ]);

  return text;
}
