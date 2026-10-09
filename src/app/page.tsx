import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { ActionStack } from "@/components/site/action-stack";
import { ScrollReveals } from "@/components/site/scroll-reveals";
import { HeroEffects } from "@/components/site/hero-effects";
import { ServicesEffects } from "@/components/site/services-effects";
import { MicroInteractions } from "@/components/site/micro-interactions";
import { LiveVacancies } from "@/components/site/live-vacancies";
import { Hero } from "@/components/site/sections/Hero";
import { WaveDarkToWarm } from "@/components/site/sections/WaveDarkToWarm";
import { AntiPitch } from "@/components/site/sections/AntiPitch";
import { About } from "@/components/site/sections/About";
import { Services } from "@/components/site/sections/Services";
import { HowItWorks } from "@/components/site/sections/HowItWorks";
import { Trust } from "@/components/site/sections/Trust";
import { WaveWarmToDark } from "@/components/site/sections/WaveWarmToDark";

export default function HomePage() {
  return (
    <>
      <a href="#hero" className="skip-link">
        Skip to content
      </a>
      <SiteNav />
      <main>
        <Hero />
        <WaveDarkToWarm />
        <AntiPitch />
        <LiveVacancies />
        <About />
        <Services />
        <HowItWorks />
        <Trust />
        <WaveWarmToDark />
        <SiteFooter />
      </main>
      <ActionStack />
      <HeroEffects />
      <ServicesEffects />
      <ScrollReveals />
      <MicroInteractions />
    </>
  );
}
