"use client";

import { useEffect, useState } from "react";

import { Clip } from "@/components/clip";
import { clips } from "@/lib/clips";

const cells = Array.from(
  { length: 48 },
  (_, index) => clips[index % clips.length]
);

function GridSet({ items }: { items: typeof cells }) {
  return (
    <div className="grid grid-cols-[repeat(4,260px)] gap-7 md:grid-cols-[repeat(8,260px)]">
      {items.map((clip, index) => {
        const stagger = [0, 10, 20, 30, 5, 15, 25, 8][index % 8];
        return (
          <div
            key={`${clip.id}-${index}`}
            className="relative aspect-[9/16] overflow-hidden rounded-[22px] bg-ink-3"
            style={{ transform: `translateY(${stagger}px)` }}
          >
            <Clip
              src={clip.src}
              poster={clip.poster}
              autoPlay
              className="absolute inset-0 size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/10 to-ink/30" />
          </div>
        );
      })}
    </div>
  );
}

export default function VideoRetroGrid() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(query.matches);
    update();
    if (query.addEventListener) {
      query.addEventListener("change", update);
      return () => query.removeEventListener("change", update);
    }
    query.addListener(update);
    return () => query.removeListener(update);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <div className="absolute inset-0 [perspective:2400px]">
        <div className="h-full w-full origin-center [transform:rotateX(10deg)]">
          <div className="flex animate-video-grid flex-col items-center">
            <GridSet items={isDesktop ? cells : cells.slice(0, 16)} />
          </div>
        </div>
      </div>
    </div>
  );
}
