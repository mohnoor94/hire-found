"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Mail, Share2 } from "lucide-react";
import { useBookingModal } from "@/components/site/cal-dialog";
import {
  DEFAULTS,
  type Job,
  containsArabic,
  formatRichText,
  getRelativeTime,
} from "@/lib/jobs";
import { withBasePath } from "@/lib/base-path";
import { formatCategoryLabel, formatEmploymentType } from "@/lib/yasmin/labels";

type JobDetailProps = {
  job: Job;
};

declare global {
  interface Window {
    Tally?: {
      loadEmbeds?: () => void;
    };
  }
}

const primaryAction =
  "inline-flex min-h-12 touch-manipulation cursor-pointer items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground select-none active:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const quietAction =
  "inline-flex min-h-12 touch-manipulation items-center gap-2 rounded-full border border-primary/30 px-6 text-sm font-semibold text-primary select-none active:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export function JobDetail({ job }: JobDetailProps) {
  const { open } = useBookingModal();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [copied, setCopied] = useState(false);
  const [jobUrl, setJobUrl] = useState(
    withBasePath(`/jobs/?id=${job.slug || ""}`),
  );
  const label = formatCategoryLabel(job.category);
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
  const hasArabicDescription = Boolean(job.fullDescriptionAr?.trim());
  const hasEnglishDescription = Boolean(descriptionHtml.trim());
  const tallyPublicUrl = hasTally
    ? `https://tally.so/r/${job.tallyFormId}`
    : "";

  const meta = [
    label,
    job.location?.trim() || null,
    formatEmploymentType(
      typeof job.employmentType === "string" ? job.employmentType : undefined,
    ) || null,
    job.companyName?.trim() || null,
    job.salary?.trim() || null,
    postedDate || null,
  ].filter(Boolean);

  useEffect(() => {
    const previous = document.title;
    document.title = `${job.title} | HireFound`;
    titleRef.current?.focus({ preventScroll: true });
    return () => {
      document.title = previous;
    };
  }, [job.slug, job.title]);

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
      <Link
        href="/jobs/"
        className="mb-8 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-primary active:text-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        aria-label="Back to all job listings"
        data-back-link="true"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        All jobs
      </Link>

      <header>
        <h1
          ref={titleRef}
          tabIndex={-1}
          className="font-accent text-3xl tracking-[-0.02em] text-balance text-primary outline-none md:text-4xl"
        >
          {job.title}
        </h1>
        {job.titleAr?.trim() ? (
          <p
            className="mt-2 w-fit text-2xl leading-snug text-text-main"
            dir="rtl"
            lang="ar"
          >
            {job.titleAr}
          </p>
        ) : null}

        <p className="mt-4 max-w-[65ch] text-sm text-muted">{meta.join(" · ")}</p>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            className={quietAction}
            aria-label="Share this job - copy URL to clipboard"
            onClick={handleShare}
          >
            <Share2 className="size-4" aria-hidden="true" />
            Share
          </button>
          <span aria-live="polite" className="text-sm font-medium text-primary">
            {copied ? "Link copied" : ""}
          </span>
        </div>
      </header>

      {hasArabicDescription || hasEnglishDescription ? (
        <section className="mt-10 border-t border-secondary pt-10">
          <h2 className="font-accent mb-6 text-2xl text-primary">
            About This Role
          </h2>

          {hasArabicDescription ? (
            <div
              className="job-description mb-8 max-w-[65ch] text-base leading-relaxed text-text-main"
              dir="rtl"
              lang="ar"
              dangerouslySetInnerHTML={{
                __html: formatRichText(job.fullDescriptionAr),
              }}
            />
          ) : null}

          {hasEnglishDescription ? (
            <div
              className="job-description max-w-[65ch] text-base leading-relaxed text-text-main"
              {...(descriptionIsArabic
                ? { dir: "rtl" as const, lang: "ar" }
                : {})}
              dangerouslySetInnerHTML={{
                __html: formatRichText(descriptionHtml),
              }}
            />
          ) : null}
        </section>
      ) : null}

      {hasTally ? (
        <section className="mt-10 border-t border-secondary pt-10">
          <h2 className="font-accent text-2xl text-primary">Apply Now</h2>
          <iframe
            data-tally-src={tallyUrl}
            src={tallyUrl}
            title="Application Form"
            className="mt-6 min-h-[400px] w-full rounded-[16px] border border-primary/15 bg-white"
          />
          <p className="mt-3 text-sm text-muted">
            <a
              href={tallyPublicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary underline decoration-primary/40 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Open application form in a new tab
            </a>
          </p>
          <div className="mt-10">
            <h3 className="font-accent text-xl text-primary">Have Questions?</h3>
            <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-muted">
              The form above is the way to apply. WhatsApp, email, and a call
              are here if you would rather talk first.
            </p>
            <ContactActions
              whatsAppHref={`https://wa.me/${whatsAppNumber}?text=${encodedMessage}`}
              emailHref={`mailto:${emailAddress}?subject=${encodedSubject}`}
              onBook={(target) => open(target)}
              bookPrimary={false}
            />
          </div>
        </section>
      ) : (
        <section className="mt-10 border-t border-secondary pt-10">
          <h2 className="font-accent text-2xl text-primary">
            Interested? Get in Touch
          </h2>
          <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-muted">
            Book a call, or reach Yasmin on WhatsApp or email.
          </p>
          <ContactActions
            whatsAppHref={`https://wa.me/${whatsAppNumber}?text=${encodedMessage}`}
            emailHref={`mailto:${emailAddress}?subject=${encodedSubject}`}
            onBook={(target) => open(target)}
            bookPrimary
          />
        </section>
      )}
    </div>
  );
}

function ContactActions({
  whatsAppHref,
  emailHref,
  onBook,
  bookPrimary,
}: {
  whatsAppHref: string;
  emailHref: string;
  onBook: (target: HTMLButtonElement) => void;
  bookPrimary: boolean;
}) {
  return (
    <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <button
        type="button"
        className={bookPrimary ? primaryAction : quietAction}
        aria-label="Book a call with Yasmin"
        onClick={(event) => onBook(event.currentTarget)}
      >
        <Calendar className="size-4" aria-hidden="true" />
        Book a Call
      </button>
      <WhatsAppLink href={whatsAppHref} />
      <EmailLink href={emailHref} />
    </div>
  );
}

function WhatsAppLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={quietAction}
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
    <a href={href} className={quietAction} aria-label="Send an email">
      <Mail className="size-4" aria-hidden="true" />
      Email
    </a>
  );
}
