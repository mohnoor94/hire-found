import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { ActionStack } from "@/components/site/action-stack";
import { ServicesTabProvider } from "@/components/site/services-tab";
import { LiveVacancies } from "@/components/site/live-vacancies";
import { Hero } from "@/components/site/sections/Hero";
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
      <ServicesTabProvider>
        <main>
          <Hero />
          <AntiPitch />
          <LiveVacancies />
          <About />
          <Services />
          <HowItWorks />
          <Trust />
          <WaveWarmToDark />
          <SiteFooter />
        </main>
      </ServicesTabProvider>
      <ActionStack />
    </>
  );
}
