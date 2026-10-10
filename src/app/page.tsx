import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { ActionStack } from "@/components/site/action-stack";
import { ServicesTabProvider } from "@/components/site/services-tab";
import { LiveVacancies } from "@/components/site/live-vacancies";
import { Hero } from "@/components/site/sections/Hero";
import { About } from "@/components/site/sections/About";
import { Services } from "@/components/site/sections/Services";
import { HowItWorks } from "@/components/site/sections/HowItWorks";
import { Trust } from "@/components/site/sections/Trust";
import { SpeakingMedia } from "@/components/site/sections/SpeakingMedia";
import { WaveWarmToDark } from "@/components/site/sections/WaveWarmToDark";
import { TRUST_BENTO_ENABLED } from "@/lib/flags";

export default function HomePage() {
  return (
    <>
      <a href="#hero" className="skip-link">
        Skip to content
      </a>
      <SiteNav />
      <ServicesTabProvider>
        <main>
          <Hero />
          <About />
          <LiveVacancies />
          <Services />
          <HowItWorks />
          <SpeakingMedia />
          <Trust />
        </main>
        <WaveWarmToDark from={TRUST_BENTO_ENABLED ? "warm" : "warm-dark"} />
        <SiteFooter />
      </ServicesTabProvider>
      <ActionStack />
    </>
  );
}
