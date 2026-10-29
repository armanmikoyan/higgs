import SiteHeader from "@/components/site-header";
import Hero from "@/components/hero";
import ModelMarquee from "@/components/model-marquee";
import Reels from "@/components/reels";
import HowItWorks from "@/components/how-it-works";
import Pricing from "@/components/pricing";
import SiteFooter from "@/components/site-footer";
import { PaywallProvider } from "@/components/paywall";
import ScrollReset from "@/components/scroll-reset";

export default function Home() {
  return (
    <PaywallProvider>
      <ScrollReset />
      <SiteHeader />
      <main>
        <Hero />
        <ModelMarquee />
        <Reels />
        <HowItWorks />
        <Pricing />
      </main>
      <SiteFooter />
    </PaywallProvider>
  );
}
