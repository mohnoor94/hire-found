import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { WaveWarmToDark } from "@/components/site/sections/WaveWarmToDark";
import { JobsPageClient } from "@/components/jobs/jobs-page-client";
import { JobsSkeletons } from "@/components/jobs/jobs-states";

export const metadata: Metadata = {
  title: "Find Your Match - Open Roles | HireFound",
  description:
    "Curated leadership, tech, and hospitality career opportunities across Jordan and the GCC with HireFound.",
  openGraph: {
    title: "Find Your Match - Open Roles | HireFound",
    description:
      "Curated leadership, tech, and hospitality career opportunities across Jordan and the GCC.",
    url: "https://hirefound.com/jobs/",
    siteName: "HireFound",
    images: [
      {
        url: "https://hirefound.com/assets/og-jobs.png",
        width: 1200,
        height: 630,
        alt: "HireFound - Curated Open Roles & Career Matching",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Find Your Match - Open Roles | HireFound",
    description:
      "Curated leadership, tech, and hospitality career opportunities across Jordan and the GCC.",
    images: ["https://hirefound.com/assets/og-jobs.png"],
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
      <SiteNav />
      <main
        id="main-content"
        className="page-transition-enter pt-[calc(var(--site-nav-offset)+1.5rem)]"
      >
        <Suspense fallback={<JobsFallback />}>
          <JobsPageClient />
        </Suspense>
      </main>
      <WaveWarmToDark />
      <SiteFooter />
    </>
  );
}
