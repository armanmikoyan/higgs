"use client";

import { useEffect, useRef, type VideoHTMLAttributes } from "react";

type ClipProps = {
  src?: string;
  poster?: string;
  color?: string;
  className?: string;
} & Omit<VideoHTMLAttributes<HTMLVideoElement>, "src" | "poster">;

export function Clip({ src, poster, color, className, autoPlay }: ClipProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (typeof IntersectionObserver === "undefined") {
      video.play().catch(() => {});
      return;
    }

    let isVisible = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry?.isIntersecting ?? false;
        if (isVisible) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(video);
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [src]);

  if (!src) {
    return (
      <div
        aria-hidden="true"
        tabIndex={-1}
        className={className}
        style={{ backgroundColor: color ?? "#12151b" }}
      />
    );
  }
  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      className={className}
      autoPlay={autoPlay}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
