import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { CustomCursor } from "@/components/site/custom-cursor";
import { ScrollReveals } from "@/components/site/scroll-reveals";
import { MicroInteractions } from "@/components/site/micro-interactions";
import { WaveWarmToDark } from "@/components/site/sections/WaveWarmToDark";
import { JobsPageClient } from "@/components/jobs/jobs-page-client";
import { JobsSkeletons } from "@/components/jobs/jobs-states";

export const metadata: Metadata = {
  title: "Find Your Match - Open Roles | HireFound",
  description:
    "Browse open roles at HireFound. We match talented professionals with meaningful careers across hospitality, tech, F&B, aviation, and more.",
  openGraph: {
    title: "Find Your Match - Open Roles | HireFound",
    description:
      "Browse open roles and find your next career match with HireFound.",
    url: "https://hirefound.com/jobs/",
    siteName: "HireFound",
    images: ["https://hirefound.com/assets/yasmin-blasi.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Find Your Match - Open Roles | HireFound",
    description:
      "Browse open roles and find your next career match with HireFound.",
    images: ["https://hirefound.com/assets/yasmin-blasi.png"],
  },
};

function JobsFallback() {
  return (
    <section className="bg-warm px-6 py-12 lg:py-16" aria-label="Job listings">
      <div className="mx-auto max-w-5xl">
        <JobsSkeletons count={4} />
      </div>
    </section>
  );
}

export default function JobsPage() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <CustomCursor />
      <SiteNav />
      <main id="main-content" className="pt-20">
        <Suspense fallback={<JobsFallback />}>
          <JobsPageClient />
        </Suspense>
        <WaveWarmToDark />
        <SiteFooter />
      </main>
      <ScrollReveals />
      <MicroInteractions />
    </>
  );
}
