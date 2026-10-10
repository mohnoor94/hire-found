import puppeteer from "puppeteer";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function buildBoldTemplate({
  logoSvg,
  yasminDataUri,
  badgeText,
  headlineLine1,
  headlineLine2,
  subtitle,
  footerNote,
  floatingPill,
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@500;600;700;800&display=swap');

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      width: 1200px;
      height: 630px;
      overflow: hidden;
      background-color: #FCF9F5;
      font-family: 'Inter', -apple-system, sans-serif;
      color: #1F1A24;
      display: flex;
      position: relative;
    }

    /* Ambient luxury background glow */
    .bg-canvas {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 85% 30%, rgba(196, 181, 253, 0.28) 0%, transparent 48%),
        radial-gradient(circle at 10% 80%, rgba(212, 165, 116, 0.2) 0%, transparent 42%),
        #FCF9F5;
      z-index: 1;
    }

    /* Clean outer frame */
    .outer-border {
      position: absolute;
      inset: 16px;
      border: 1.5px solid rgba(212, 165, 116, 0.4);
      border-radius: 24px;
      pointer-events: none;
      z-index: 10;
    }

    /* Main container */
    .layout {
      position: relative;
      z-index: 5;
      display: flex;
      width: 100%;
      height: 100%;
      padding: 44px 52px;
      gap: 48px;
      align-items: center;
      justify-content: space-between;
    }

    /* Left narrative column: High impact, zero clutter */
    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justifyContent: space-between;
      height: 100%;
      padding: 10px 0;
      max-width: 620px;
    }

    .brand-row {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .brand-logo {
      height: 48px;
      display: flex;
      align-items: center;
    }

    .brand-logo svg {
      height: 48px;
      width: auto;
      display: block;
    }

    .brand-name {
      font-family: 'DM Serif Display', Georgia, serif;
      font-size: 42px;
      color: #7A1E4A;
      letter-spacing: -0.02em;
      line-height: 1;
    }

    .brand-badge {
      display: inline-flex;
      align-items: center;
      background: rgba(122, 30, 74, 0.08);
      border: 1px solid rgba(122, 30, 74, 0.2);
      border-radius: 999px;
      padding: 6px 16px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #7A1E4A;
      margin-left: 6px;
    }

    .hero-copy {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .headline {
      font-family: 'DM Serif Display', Georgia, serif;
      font-size: 68px;
      line-height: 1.04;
      color: #1F1A24;
      letter-spacing: -0.025em;
    }

    .headline .plum-accent {
      color: #7A1E4A;
      font-style: italic;
    }

    .subtitle {
      font-size: 23px;
      font-weight: 600;
      line-height: 1.35;
      color: #5C4E58;
      max-width: 580px;
    }

    .footer-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1.5px solid rgba(212, 165, 116, 0.4);
      padding-top: 18px;
      width: 100%;
    }

    .footer-note {
      font-size: 16px;
      font-weight: 600;
      color: #7A6C77;
      letter-spacing: 0.02em;
    }

    .footer-domain {
      font-size: 18px;
      font-weight: 800;
      color: #7A1E4A;
      letter-spacing: 0.02em;
    }

    /* Right column: Large portrait */
    .portrait-col {
      flex-shrink: 0;
      width: 440px;
      height: 520px;
      position: relative;
    }

    .portrait-frame {
      width: 100%;
      height: 100%;
      border-radius: 28px;
      overflow: hidden;
      position: relative;
      border: 2px solid rgba(212, 165, 116, 0.55);
      box-shadow:
        0 24px 48px -12px rgba(122, 30, 74, 0.16),
        0 8px 16px -4px rgba(0, 0, 0, 0.06);
      background: #EDE6F2;
    }

    .portrait-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 14%;
      display: block;
    }

    /* Bottom gradient on portrait */
    .portrait-gradient {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to bottom,
        transparent 55%,
        rgba(31, 26, 36, 0.5) 80%,
        rgba(31, 26, 36, 0.85) 100%
      );
    }

    /* Large readable name overlay */
    .portrait-name-tag {
      position: absolute;
      bottom: 20px;
      left: 22px;
      right: 22px;
      color: #FFFFFF;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }

    .portrait-name {
      font-family: 'DM Serif Display', Georgia, serif;
      font-size: 32px;
      line-height: 1.1;
      letter-spacing: -0.01em;
    }

    .portrait-title {
      font-size: 15px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.92);
      margin-top: 2px;
      letter-spacing: 0.02em;
    }

    /* Bold badge floating at top */
    .top-floating-badge {
      position: absolute;
      top: -12px;
      right: 20px;
      background: #7A1E4A;
      color: #FCF9F5;
      border: 3px solid #FCF9F5;
      border-radius: 999px;
      padding: 8px 18px;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      box-shadow: 0 8px 20px rgba(122, 30, 74, 0.35);
      display: flex;
      align-items: center;
      gap: 6px;
      z-index: 15;
    }

    .badge-star {
      color: #D4A574;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="bg-canvas"></div>
  <div class="outer-border"></div>

  <div class="layout">
    <!-- Left Column: High contrast & big fonts -->
    <div class="content">
      <div class="brand-row">
        <div class="brand-logo">
          ${logoSvg}
        </div>
        <div class="brand-name">HireFound</div>
        <div class="brand-badge">${badgeText}</div>
      </div>

      <div class="hero-copy">
        <h1 class="headline">
          ${headlineLine1}<br>
          <span class="plum-accent">${headlineLine2}</span>
        </h1>
        <p class="subtitle">
          ${subtitle}
        </p>
      </div>

      <div class="footer-bar">
        <span class="footer-note">${footerNote}</span>
        <span class="footer-domain">hirefound.com</span>
      </div>
    </div>

    <!-- Right Column: Big, bold Yasmin portrait -->
    <div class="portrait-col">
      <div class="top-floating-badge">
        <span class="badge-star">✦</span>
        <span>${floatingPill}</span>
      </div>
      <div class="portrait-frame">
        <img src="${yasminDataUri}" alt="Yasmin Blasi" class="portrait-img">
        <div class="portrait-gradient"></div>
        <div class="portrait-name-tag">
          <div class="portrait-name">Yasmin Blasi</div>
          <div class="portrait-title">Founder & Managing Director</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

async function renderCard(browser, html, outputPath) {
  const page = await browser.newPage();
  try {
    await page.setViewport({
      width: 1200,
      height: 630,
      deviceScaleFactor: 1,
    });

    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.evaluateHandle("document.fonts.ready");

    await page.screenshot({
      path: outputPath,
      type: "png",
    });
    console.log(`Rendered: ${outputPath}`);
  } finally {
    await page.close();
  }
}

async function main() {
  const yasminImgPath = path.join(ROOT, "public/assets/yasmin-blasi.png");
  const yasminBase64 = (await fs.readFile(yasminImgPath)).toString("base64");
  const yasminDataUri = `data:image/png;base64,${yasminBase64}`;

  const logoSvgPath = path.join(ROOT, "public/assets/hirefound-signature-primary.svg");
  const logoSvg = await fs.readFile(logoSvgPath, "utf-8");

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    // 1. Flagship Homepage OG Card - Clean, bold, instantly legible
    const homeHtml = buildBoldTemplate({
      logoSvg,
      yasminDataUri,
      badgeText: "Executive Search",
      headlineLine1: "You want a hire?",
      headlineLine2: "We got you found.",
      subtitle: "Connecting visionary leaders with exceptional executive talent across Jordan & the Gulf.",
      footerNote: "Amman · Riyadh · Dubai",
      floatingPill: "TEDx Speaker",
    });

    const homeOut = path.join(ROOT, "public/assets/og-image.png");
    await renderCard(browser, homeHtml, homeOut);

    // 2. Jobs Board OG Card
    const jobsHtml = buildBoldTemplate({
      logoSvg,
      yasminDataUri,
      badgeText: "Open Roles",
      headlineLine1: "Find Your Match.",
      headlineLine2: "Discover open roles.",
      subtitle: "Curated career opportunities across hospitality, tech, and leadership in the region.",
      footerNote: "Live Vacancies Board",
      floatingPill: "Career Matchmaker",
    });

    const jobsOut = path.join(ROOT, "public/assets/og-jobs.png");
    await renderCard(browser, jobsHtml, jobsOut);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
