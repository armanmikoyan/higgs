import Link from "next/link";
import { BuyButton } from "@/components/paywall";

const columns = [
  {
    title: "Product",
    links: ["Video studio", "Reels", "Pricing"],
  },
  {
    title: "Company",
    links: ["About", "Contact", "Changelog"],
  },
  {
    title: "Legal",
    links: ["Terms", "Privacy"],
  },
];

const socials = ["X", "Instagram", "YouTube", "Discord"];

export default function SiteFooter() {
  return (
    <footer className="border-t border-cream/10 bg-ink">
      <div className="w-full px-4 py-8 md:px-8 md:py-10">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:gap-10">
          <div className="max-w-sm sm:col-span-2 md:col-span-1">
            <Link href="#top" className="inline-flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-full border border-jade/30 bg-jade/10 font-serif text-base italic text-jade">
                S
              </span>
              <span className="text-sm font-medium uppercase tracking-[0.26em] text-cream">
                SABLE<span className="text-jade">.</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-cream/65">
              Cinematic AI video, priced per video. No subscription, no credits
              — just the clips you make.
            </p>
            <BuyButton className="mt-5 inline-flex h-10 items-center rounded-full border border-cream/15 px-4 text-sm font-normal text-cream/80 transition-colors hover:border-jade/50 hover:bg-jade/10 hover:text-jade">
              Buy videos
            </BuyButton>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-cream/60">
                {column.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#top"
                      className="text-sm text-cream/70 transition-colors duration-300 hover:text-jade"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-5 border-t border-cream/10 pt-6">
          <p className="text-xs text-cream/60">
            © 2026 SABLE Labs. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {socials.map((social) => (
              <a
                key={social}
                href="#top"
                className="text-sm text-cream/65 transition-colors duration-300 hover:text-cream"
              >
                {social}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 overflow-hidden border-t border-cream/10 pt-6">
          <p
            aria-hidden="true"
            className="select-none text-center text-[clamp(4rem,23vw,26rem)] font-semibold leading-[0.7] tracking-[-0.09em] text-cream/[0.09]"
          >
            SABLE<span className="text-jade/30">.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
