import { BentoFeatures } from "@/components/home/bento-features";
import { CallToAction } from "@/components/home/call-to-action";
import { HeroSection } from "@/components/home/hero-section";
import { InteractiveDemo } from "@/components/home/interactive-demo";
import { MarqueeBrands } from "@/components/home/marquee-brands";
import { StatsTicker } from "@/components/home/stats-ticker";
import { Testimonials } from "@/components/home/testimonials";

export function Home() {
  return (
    <main className="flex min-h-screen flex-col overflow-x-hidden bg-white dark:bg-zinc-950">
      <HeroSection />
      <MarqueeBrands />
      <BentoFeatures />
      <StatsTicker />
      <InteractiveDemo />
      <Testimonials />
      <CallToAction />
    </main>
  );
}
