// Snapshot Yasmin's Notes (desktop 1440 + mobile 390).
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

async function snap(filePath, viewport, userAgent) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();
    if (userAgent) await page.setUserAgent(userAgent);
    await page.setViewport(viewport);
    await page.goto(BASE_URL, { waitUntil: "networkidle0", timeout: 30000 });
    await page.waitForSelector("#yasmins-notes", {
      visible: true,
      timeout: 10000,
    });
    await page.evaluate(() => {
      window.getSelection()?.removeAllRanges();
      document.querySelector("#yasmins-notes")?.scrollIntoView({
        behavior: "instant",
        block: "start",
      });
    });
    await new Promise((resolve) => setTimeout(resolve, 250));
    await page.evaluate(() => window.getSelection()?.removeAllRanges());
    const el = await page.$("#yasmins-notes");
    if (!el) throw new Error("Element not found: #yasmins-notes");
    await el.screenshot({ path: filePath, type: "png" });
  } finally {
    await browser.close();
  }
}

async function main() {
  await ensureDir(OUT_DIR);
  const desktopOut = path.join(OUT_DIR, "yasmins_notes_desktop_1440.png");
  const mobileOut = path.join(OUT_DIR, "yasmins_notes_mobile_390.png");
  await snap(desktopOut, { width: 1440, height: 900, deviceScaleFactor: 1 });
  await snap(
    mobileOut,
    { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  );
  console.log(JSON.stringify({ desktopOut, mobileOut }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
