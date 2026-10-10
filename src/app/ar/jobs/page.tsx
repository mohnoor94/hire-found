import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { WaveWarmToDark } from "@/components/site/sections/WaveWarmToDark";
import { JobsPageClient } from "@/components/jobs/jobs-page-client";
import { JobsSkeletons } from "@/components/jobs/jobs-states";

export const metadata: Metadata = {
  title: "لقِ توفيقك - الوظائف المتاحة | HireFound",
  description:
    "استعرض الوظائف المتاحة مع HireFound. نوفّق المهنيين الموهوبين بفرص ذات معنى عبر الأردن والخليج.",
  openGraph: {
    title: "لقِ توفيقك - الوظائف المتاحة | HireFound",
    description:
      "استعرض الوظائف المتاحة واعثر على فرصتك القادمة مع HireFound.",
    url: "https://hirefound.com/ar/jobs/",
    siteName: "HireFound",
    images: ["https://hirefound.com/assets/yasmin-blasi.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "لقِ توفيقك - الوظائف المتاحة | HireFound",
    description:
      "استعرض الوظائف المتاحة واعثر على فرصتك القادمة مع HireFound.",
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

export default function JobsPageAr() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        تخطَّ إلى المحتوى
      </a>
      <SiteNav />
      <main id="main-content" className="pt-[calc(var(--site-nav-offset)+1.5rem)]">
        <Suspense fallback={<JobsFallback />}>
          <JobsPageClient />
        </Suspense>
      </main>
      <WaveWarmToDark />
      <SiteFooter />
    </>
  );
}

