"use client";

import { useState } from "react";
import { Tabs as TabsPrimitive } from "radix-ui";
import {
  useServicesTab,
  type ServiceAudience,
} from "@/components/site/services-tab";
import { useI18n } from "@/components/site/i18n";

const EMPLOYER_SERVICES = [
  {
    title: "Executive Search & Headhunting",
    body: "I find leaders who don't just fill a seat: they transform your business. C-suite, directors, the people who move the needle.",
  },
  {
    title: "Recruitment & Job Matching",
    body: "From junior to senior, across industries. I handle sourcing, screening, and matching, so you just meet the finalists.",
  },
  {
    title: "DISC Assessments",
    body: "Understand how your candidates think, communicate, and work. Better insights mean better hires that stick.",
  },
] as const;

const CANDIDATE_SERVICES = [
  {
    title: "Career Matchmaking",
    body: "Tell me where you want to go. I'll find the opportunities that actually match: not just what's available, but what's right.",
  },
  {
    title: "CV Optimization",
    body: "Your CV should tell your story, not just list your jobs. I'll help you make it impossible to ignore.",
  },
  {
    title: "Interview Preparation",
    body: "Nervous? Don't be. We'll practice until you walk in there owning the room. I know what they're looking for.",
  },
] as const;

function isAudience(value: string): value is ServiceAudience {
  return value === "employers" || value === "candidates";
}

export function Services() {
  const t = useI18n();
  const shared = useServicesTab();
  const [localTab, setLocalTab] = useState<ServiceAudience>("employers");
  const tab = shared?.tab ?? localTab;
  const setTab = shared?.setTab ?? setLocalTab;

  return (
    <section id="services" className="bg-warm-dark px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-accent text-4xl tracking-[-0.02em] text-balance text-primary md:text-5xl">
          {t.services.heading}
        </h2>
        <p className="mt-4 max-w-[36rem] text-lg text-muted">
          {t.services.subheading}
        </p>

        <TabsPrimitive.Root
          value={tab}
          onValueChange={(next) => {
            if (isAudience(next)) setTab(next);
          }}
          className="mt-10"
        >
          <TabsPrimitive.List
            aria-label="Who I help"
            className="flex flex-wrap gap-2"
          >
            <TabsPrimitive.Trigger value="employers" className="filter-pill">
              {t.services.tabEmployers}
            </TabsPrimitive.Trigger>
            <TabsPrimitive.Trigger value="candidates" className="filter-pill">
              {t.services.tabCandidates}
            </TabsPrimitive.Trigger>
          </TabsPrimitive.List>

          <TabsPrimitive.Content
            value="employers"
            className="hf-panel mt-10 outline-none"
          >
            <ServiceList items={t.services.employers} />
          </TabsPrimitive.Content>
          <TabsPrimitive.Content
            value="candidates"
            className="hf-panel mt-10 outline-none"
          >
            <ServiceList items={t.services.candidates} />
          </TabsPrimitive.Content>
        </TabsPrimitive.Root>
      </div>
    </section>
  );
}

function ServiceList({
  items,
}: {
  items: readonly { title: string; body: string }[];
}) {
  return (
    <ul className="flex flex-col">
      {items.map((item) => (
        <li
          key={item.title}
          className="reveal-on-scroll border-t border-border py-8 first:border-t-0 first:pt-0"
        >
          <h3 className="font-accent text-2xl text-primary">{item.title}</h3>
          <p className="mt-3 max-w-[65ch] leading-relaxed text-muted">
            {item.body}
          </p>
        </li>
      ))}
    </ul>
  );
}
