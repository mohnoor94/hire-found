// Snapshot Speaking & Media (desktop 1440 + mobile 390) from the static export.
// Requires a static server with out/ mounted at /hire-found (not SPA-fallback).
import puppeteer from "puppeteer";
import fs from "node:fs/promises";
import path from "node:path";

const BASE_URL =
  process.env.SITE_URL ?? "http://localhost:3005/hire-found/";
const OUT_DIR = "/opt/cursor/artifacts";

const PLUM = "rgb(122, 30, 74)";

async function assertStyled(page) {
  const heading = await page.waitForSelector("#speaking-media-heading", {
    visible: true,
    timeout: 15000,
  });
  const styles = await page.evaluate((el) => {
    const cs = getComputedStyle(el);
    return {
      color: cs.color,
      fontFamily: cs.fontFamily,
      fontSize: cs.fontSize,
    };
  }, heading);
  if (styles.color !== PLUM) {
    throw new Error(
      `CSS not loaded: heading color is ${styles.color}, expected ${PLUM}`,
    );
  }
  const family = styles.fontFamily.toLowerCase();
  if (!family.includes("dm serif") && !family.includes("serif")) {
    throw new Error(`Unexpected heading font: ${styles.fontFamily}`);
  }
  return styles;
}

async function snapBand(page, filePath) {
  await page.evaluate(() => {
    document.getElementById("action-stack")?.setAttribute("hidden", "");
  });
  const speaking = await page.$("#speaking-media");
  if (!speaking) throw new Error("Missing #speaking-media");
  await page.evaluate(() => {
    document.getElementById("trust")?.scrollIntoView({
      behavior: "instant",
      block: "center",
    });
  });
  await new Promise((r) => setTimeout(r, 1300));
  const scrollTarget = await page.evaluate(() => {
    const heading = document.getElementById("speaking-media-heading");
    const y = heading.getBoundingClientRect().top + window.scrollY - 108;
    window.scrollTo({ top: Math.max(0, y), left: 0, behavior: "instant" });
    return {
      y,
      scrollY: window.scrollY,
      speakingTop:
        document.getElementById("speaking-media").getBoundingClientRect().top +
        window.scrollY,
      heading: heading?.textContent,
    };
  });
  if (!scrollTarget.heading?.includes("Speaking")) {
    throw new Error("Did not find Speaking & Media heading");
  }
  await new Promise((r) => setTimeout(r, 1600));
  await page.screenshot({
    path: filePath,
    type: "png",
    fullPage: false,
  });
  return scrollTarget;
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(20000);

    // Desktop 1440: tall enough for How It Works remnant + section + Trust start
    await page.setViewport({ width: 1440, height: 1600, deviceScaleFactor: 1 });
    await page.goto(BASE_URL, { waitUntil: "load" });
    await page.evaluateHandle("document.fonts.ready");
    const desktopStyles = await assertStyled(page);
    const desktopOut = path.join(OUT_DIR, "speaking_media_desktop_1440_onbrand.png");
    const desktopScroll = await snapBand(page, desktopOut);

    // Mobile 390: tall enough for the stacked cards plus neighbors
    await page.setViewport({
      width: 390,
      height: 2200,
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });
    await page.setUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    );
    await page.goto(BASE_URL, { waitUntil: "load" });
    await page.evaluateHandle("document.fonts.ready");
    const mobileStyles = await assertStyled(page);
    const mobileOut = path.join(OUT_DIR, "speaking_media_mobile_390_onbrand.png");
    const mobileScroll = await snapBand(page, mobileOut);

    console.log(
      JSON.stringify(
        {
          desktopOut,
          mobileOut,
          desktopStyles,
          mobileStyles,
          desktopScroll,
          mobileScroll,
        },
        null,
        2,
      ),
    );
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
