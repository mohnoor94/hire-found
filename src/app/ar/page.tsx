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
import { WaveWarmToDark } from "@/components/site/sections/WaveWarmToDark";
import { Markets } from "@/components/site/sections/Markets";

export default function HomePageAr() {
  return (
    <>
      <a href="#hero" className="skip-link">
        تخطَّ إلى المحتوى
      </a>
      <SiteNav />
      <ServicesTabProvider>
        <main>
          <Hero />
          <About />
          <LiveVacancies />
          <Services />
          <Markets />
          <HowItWorks />
          <Trust />
        </main>
        <WaveWarmToDark from="warm" />
        <SiteFooter />
      </ServicesTabProvider>
      <ActionStack />
    </>
  );
}

