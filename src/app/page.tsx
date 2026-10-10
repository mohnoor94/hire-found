import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { ActionStack } from "@/components/site/action-stack";
import { LiveVacancies } from "@/components/site/live-vacancies";
import { Hero } from "@/components/site/sections/Hero";
import { About } from "@/components/site/sections/About";
import { Services } from "@/components/site/sections/Services";
import { HowItWorks } from "@/components/site/sections/HowItWorks";
import { Trust } from "@/components/site/sections/Trust";
import { WaveWarmToDark } from "@/components/site/sections/WaveWarmToDark";
import { AmbientBackdrop } from "@/components/site/ambient-backdrop";

export default function HomePage() {
  return (
    <>
      <a href="#hero" className="skip-link">
        Skip to content
      </a>
      <AmbientBackdrop />
      <SiteNav />
      <main className="relative z-10">
        <Hero />
        <About />
        <LiveVacancies />
        <Services />
        <HowItWorks />
        <Trust />
      </main>
      <WaveWarmToDark from="warm" />
      <SiteFooter />
      <ActionStack />
    </>
  );
}
