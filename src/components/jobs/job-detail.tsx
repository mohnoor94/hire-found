"use client";

import { useEffect, useState } from "react";
import { useBookingModal } from "@/components/site/cal-dialog";
import {
  DEFAULTS,
  type Job,
  categoryColors,
  categoryLabel,
  containsArabic,
  formatRichText,
  getRelativeTime,
} from "@/lib/jobs";
import { withBasePath } from "@/lib/base-path";

type JobDetailProps = {
  job: Job;
  onBack: () => void;
};

declare global {
  interface Window {
    Tally?: {
      loadEmbeds?: () => void;
    };
  }
}

export function JobDetail({ job, onBack }: JobDetailProps) {
  const { open } = useBookingModal();
  const [copied, setCopied] = useState(false);
  const [jobUrl, setJobUrl] = useState(
    withBasePath(`/jobs/?id=${job.slug || ""}`),
  );
  const colors = categoryColors(job.category);
  const label = categoryLabel(job.category);
  const postedDate = getRelativeTime(job.createdAt);

  const whatsAppNumber = job.contactWhatsApp || DEFAULTS.whatsApp;
  const emailAddress = job.contactEmail || DEFAULTS.email;
  const jobTitle = job.title || "";
  const encodedMessage = encodeURIComponent(
    `Hi! I'm interested in the "${jobTitle}" position.\n\n${jobUrl}`,
  );
  const encodedSubject = encodeURIComponent(`Interest in: ${jobTitle}`);
  const hasTally = Boolean(job.tallyFormId?.trim());
  const descriptionHtml = job.fullDescription || "";
  const descriptionIsArabic = containsArabic(descriptionHtml);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const nextUrl = `${window.location.origin}${withBasePath(`/jobs/?id=${job.slug || ""}`)}`;
      await Promise.resolve();
      if (!cancelled) setJobUrl(nextUrl);
    })();
    return () => {
      cancelled = true;
    };
  }, [job.slug]);

  useEffect(() => {
    if (!hasTally) return;

    function loadEmbeds() {
      window.Tally?.loadEmbeds?.();
    }

    const existing = document.querySelector(
      'script[src*="tally.so/widgets/embed.js"]',
    );
    if (existing) {
      loadEmbeds();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://tally.so/widgets/embed.js";
    script.async = true;
    script.onload = loadEmbeds;
    document.body.appendChild(script);
  }, [hasTally, job.tallyFormId]);

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable - match vanilla silent fail
    }
  }

  const tallyUrl = hasTally
    ? `https://tally.so/embed/${job.tallyFormId}?transparentBackground=1&dynamicHeight=1&hideTitle=1&alignLeft=1&jobTitle=${encodeURIComponent(job.title || "")}`
    : "";

  return (
    <div>
      <button
        type="button"
        className="mb-8 inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-primary transition-colors duration-200 hover:text-primary-light"
        aria-label="Back to all job listings"
        data-back-link="true"
        onClick={onBack}
      >
        <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        All Jobs
      </button>

      <header className="mb-8">
        <h1 className="font-accent mb-2 text-3xl font-bold text-text-main md:text-4xl">
          {job.title}
        </h1>
        {job.titleAr?.trim() ? (
          <p
            className="mb-3 text-xl font-semibold text-secondary"
            dir="rtl"
            lang="ar"
          >
            {job.titleAr}
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${colors.bg} ${colors.text}`}
          >
            {label}
          </span>
          {job.location ? <span>📍 {job.location}</span> : null}
          {job.employmentType ? (
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}
            >
              {job.employmentType}
            </span>
          ) : null}
          {job.companyName?.trim() ? (
            <span>🏢 {job.companyName}</span>
          ) : null}
          {job.salary?.trim() ? <span>💰 {job.salary}</span> : null}
          {postedDate ? <span>🕐 {postedDate}</span> : null}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            className="magnetic inline-flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-full border-2 border-primary/20 px-4 py-2 text-sm font-semibold text-primary transition-colors duration-200 hover:bg-primary/5"
            aria-label="Share this job - copy URL to clipboard"
            onClick={handleShare}
          >
            <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
            </svg>
            Share
          </button>
          <span
            className={`text-sm font-medium text-success transition-opacity duration-200 ${copied ? "opacity-100" : "opacity-0"}`}
            aria-live="polite"
          >
            ✓ Link copied!
          </span>
        </div>
      </header>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-bold text-text-main">
          About This Role
        </h2>

        {job.fullDescriptionAr?.trim() ? (
          <div
            className="prose prose-sm mb-8 max-w-none space-y-4 leading-relaxed text-text-main"
            dir="rtl"
            lang="ar"
            dangerouslySetInnerHTML={{
              __html: formatRichText(job.fullDescriptionAr),
            }}
          />
        ) : null}

        {descriptionHtml.trim() ? (
          <div
            className="prose prose-sm max-w-none space-y-4 leading-relaxed text-text-main"
            {...(descriptionIsArabic
              ? { dir: "rtl" as const, lang: "ar" }
              : {})}
            dangerouslySetInnerHTML={{
              __html: formatRichText(descriptionHtml),
            }}
          />
        ) : null}
      </section>

      {hasTally ? (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold text-text-main">Apply Now</h2>
          <iframe
            data-tally-src={tallyUrl}
            src={tallyUrl}
            width="100%"
            frameBorder={0}
            title="Application Form"
            className="rounded-lg"
            style={{ minHeight: 400 }}
          />
          <div className="mt-10 border-t border-gray-200 pt-8">
            <h3 className="mb-2 text-lg font-bold text-text-main">
              Have Questions?
            </h3>
            <p className="mb-4 text-sm text-muted">
              Want more details or prefer to reach out directly? We&apos;re happy
              to help.
            </p>
            <div className="flex flex-col flex-wrap items-start gap-3 sm:flex-row sm:items-center">
              <WhatsAppLink href={`https://wa.me/${whatsAppNumber}?text=${encodedMessage}`} />
              <EmailLink href={`mailto:${emailAddress}?subject=${encodedSubject}`} />
            </div>
          </div>
        </section>
      ) : (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold text-text-main">
            Interested? Get in Touch
          </h2>
          <div className="flex flex-col flex-wrap items-start gap-3 sm:flex-row sm:items-center">
            <WhatsAppLink href={`https://wa.me/${whatsAppNumber}?text=${encodedMessage}`} />
            <EmailLink href={`mailto:${emailAddress}?subject=${encodedSubject}`} />
            <button
              type="button"
              className="magnetic inline-flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-warm transition-colors duration-200 hover:bg-primary-light"
              aria-label="Book a call with Yasmin"
              onClick={(e) => open(e.currentTarget)}
            >
              <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              Book a Call
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

function WhatsAppLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="magnetic inline-flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-full bg-whatsapp px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:brightness-110"
      aria-label="Contact via WhatsApp"
    >
      <svg className="size-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      WhatsApp
    </a>
  );
}

function EmailLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      className="magnetic inline-flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:brightness-110"
      aria-label="Send an email"
    >
      <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
      Email
    </a>
  );
}
