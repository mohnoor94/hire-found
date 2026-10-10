// Snapshot the Trust section (desktop + mobile) with the bento flag enabled.
// Requires dev server at http://localhost:3000 (basePath /hire-found).
import puppeteer from "puppeteer";
import fs from "node:fs/promises";
import path from "node:path";

const BASE_URL =
  process.env.SITE_URL ?? "http://localhost:3000/hire-found/";
const OUT_DIR = "/opt/cursor/artifacts/screenshots";

async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch {}
}

async function snap(selector, filePath, viewport, userAgent) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();
    if (userAgent) await page.setUserAgent(userAgent);
    await page.setViewport(viewport);
    await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(selector, { visible: true, timeout: 10000 });
    await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      el?.scrollIntoView({ behavior: "instant", block: "center" });
    }, selector);
    const el = await page.$(selector);
    if (!el) throw new Error(`Element not found: ${selector}`);
    await el.screenshot({ path: filePath, type: "png" });
  } finally {
    await browser.close();
  }
}

async function main() {
  await ensureDir(OUT_DIR);
  const desktopOut = path.join(OUT_DIR, "trust-desktop.png");
  const mobileOut = path.join(OUT_DIR, "trust-mobile.png");
  // Desktop
  await snap("#trust", desktopOut, { width: 1280, height: 900 });
  // Mobile
  await snap(
    "#trust",
    mobileOut,
    { width: 390, height: 844, isMobile: true, hasTouch: true },
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  );
  console.log(JSON.stringify({ desktopOut, mobileOut }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

