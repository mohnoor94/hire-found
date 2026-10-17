import { describe, it, expect, vi } from "vitest";
import fs from "node:fs";
import path from "node:path";

vi.mock("next/font/google", () => ({
  Inter: () => ({ variable: "--font-inter" }),
  DM_Serif_Display: () => ({ variable: "--font-dm-serif" }),
  Noto_Sans_Arabic: () => ({ variable: "--font-noto-arabic" }),
}));

import { metadata as layoutMetadata } from "@/app/layout";
import { metadata as jobsMetadata } from "@/app/jobs/page";

const ROOT = path.resolve(__dirname, "../../..");

describe("SEO and Social Preview Cards", () => {
  it("has valid non-empty og-image.png for homepage", () => {
    const ogImagePath = path.join(ROOT, "public/assets/og-image.png");
    expect(fs.existsSync(ogImagePath)).toBe(true);
    const stats = fs.statSync(ogImagePath);
    expect(stats.size).toBeGreaterThan(100 * 1024); // Greater than 100KB
  });

  it("has valid non-empty og-jobs.png for jobs board", () => {
    const ogJobsPath = path.join(ROOT, "public/assets/og-jobs.png");
    expect(fs.existsSync(ogJobsPath)).toBe(true);
    const stats = fs.statSync(ogJobsPath);
    expect(stats.size).toBeGreaterThan(100 * 1024); // Greater than 100KB
  });

  it("layout metadata contains valid OpenGraph and Twitter configurations without em dashes", () => {
    expect(layoutMetadata.title).toBeDefined();
    expect(layoutMetadata.description).toBeDefined();

    const titleStr = String(layoutMetadata.title);
    const descStr = String(layoutMetadata.description);

    expect(titleStr).not.toContain("—");
    expect(descStr).not.toContain("—");

    const og = layoutMetadata.openGraph;
    expect(og).toBeDefined();
    expect(String(og?.title)).not.toContain("—");
    expect(String(og?.description)).not.toContain("—");
    expect(og?.url).toBe("https://mohnoor94.github.io/hire-found/");

    const ogImages = og?.images;
    expect(Array.isArray(ogImages)).toBe(true);
    const firstImg = (ogImages as Array<{ url: string; width: number; height: number; alt?: string }>)[0];
    expect(firstImg.url).toContain("og-image.png");
    expect(firstImg.width).toBe(1200);
    expect(firstImg.height).toBe(630);
    expect(firstImg.alt).not.toContain("—");

    const tw = layoutMetadata.twitter as Record<string, unknown> | undefined;
    expect(tw).toBeDefined();
    expect(tw?.card).toBe("summary_large_image");
    expect(String(tw?.title)).not.toContain("—");
    expect(String(tw?.description)).not.toContain("—");
  });

  it("jobs page metadata contains valid OpenGraph and Twitter configurations without em dashes", () => {
    expect(jobsMetadata.title).toBeDefined();
    expect(jobsMetadata.description).toBeDefined();

    const titleStr = String(jobsMetadata.title);
    const descStr = String(jobsMetadata.description);

    expect(titleStr).not.toContain("—");
    expect(descStr).not.toContain("—");

    const og = jobsMetadata.openGraph;
    expect(og).toBeDefined();
    expect(String(og?.title)).not.toContain("—");
    expect(String(og?.description)).not.toContain("—");
    expect(og?.url).toBe("https://mohnoor94.github.io/hire-found/jobs/");

    const ogImages = og?.images;
    expect(Array.isArray(ogImages)).toBe(true);
    const firstImg = (ogImages as Array<{ url: string; width: number; height: number; alt?: string }>)[0];
    expect(firstImg.url).toContain("og-jobs.png");
    expect(firstImg.width).toBe(1200);
    expect(firstImg.height).toBe(630);
    expect(firstImg.alt).not.toContain("—");

    const tw = jobsMetadata.twitter as Record<string, unknown> | undefined;
    expect(tw).toBeDefined();
    expect(tw?.card).toBe("summary_large_image");
    expect(String(tw?.title)).not.toContain("—");
    expect(String(tw?.description)).not.toContain("—");
  });
});
