import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "SABLE — Cinematic AI video, pay as you go",
  description:
      "Cinematic 9:16 video from a prompt. Pay only for the videos you make — no subscription, no credit packs.",
  openGraph: {
    title: "SABLE — Cinematic AI video, pay as you go",
    description:
    "Cinematic 9:16 video from a prompt. Pay only for the videos you make — no subscription, no credit packs.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} dark h-full antialiased`}
    >
      <body className="min-h-full overflow-x-clip bg-ink text-cream">
        {children}
      </body>
    </html>
  );
}
