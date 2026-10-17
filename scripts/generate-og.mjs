import puppeteer from "puppeteer";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function buildBalancedTemplate({
  logoSvg,
  yasminDataUri,
  badgeText,
  headlineLine1,
  headlineLine2,
  subtitle,
  pills = [],
  quoteText,
  footerNote,
  footerDomain = "hirefound.com",
  floatingPill,
}) {
  const pillsHtml = pills
    .map((pill) => `<span class="service-pill">${pill}</span>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@400;500;600;700;800&display=swap');

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
        radial-gradient(circle at 86% 28%, rgba(196, 181, 253, 0.28) 0%, transparent 46%),
        radial-gradient(circle at 12% 82%, rgba(212, 165, 116, 0.24) 0%, transparent 44%),
        radial-gradient(circle at 50% 18%, rgba(122, 30, 74, 0.08) 0%, transparent 48%),
        #FCF9F5;
      z-index: 1;
    }

    /* Clean outer frame */
    .outer-border {
      position: absolute;
      inset: 16px;
      border: 1.5px solid rgba(212, 165, 116, 0.42);
      border-radius: 26px;
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

    /* Left narrative column: Well-balanced, no empty voids */
    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justifyContent: space-between;
      height: 100%;
      padding: 4px 0;
      max-width: 690px;
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
      border: 1.5px solid rgba(122, 30, 74, 0.22);
      border-radius: 999px;
      padding: 6px 16px;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      color: #7A1E4A;
      margin-left: 4px;
    }

    .narrative-body {
      display: flex;
      flex-direction: column;
      gap: 18px;
      margin: auto 0;
    }

    .headline {
      font-family: 'DM Serif Display', Georgia, serif;
      font-size: 64px;
      line-height: 1.06;
      color: #1F1A24;
      letter-spacing: -0.025em;
    }

    .headline .plum-accent {
      color: #7A1E4A;
      font-style: italic;
    }

    .subtitle {
      font-size: 22px;
      font-weight: 500;
      line-height: 1.4;
      color: #4A3E45;
      max-width: 650px;
    }

    .pills-row {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 2px;
    }

    .service-pill {
      display: inline-flex;
      align-items: center;
      background: rgba(122, 30, 74, 0.06);
      border: 1px solid rgba(122, 30, 74, 0.2);
      border-radius: 999px;
      padding: 6px 16px;
      font-size: 14px;
      font-weight: 700;
      color: #7A1E4A;
      letter-spacing: 0.01em;
    }

    .quote-strip {
      display: flex;
      align-items: center;
      gap: 12px;
      border-left: 3px solid #D4A574;
      padding-left: 14px;
      margin-top: 4px;
    }

    .quote-text {
      font-size: 16px;
      font-weight: 500;
      font-style: italic;
      color: #6E5F6B;
      line-height: 1.35;
    }

    .footer-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1.5px solid rgba(212, 165, 116, 0.45);
      padding-top: 16px;
      width: 100%;
    }

    .footer-note {
      font-size: 17px;
      font-weight: 700;
      color: #6E5F6B;
      letter-spacing: 0.02em;
    }

    .footer-domain {
      font-size: 21px;
      font-weight: 800;
      color: #7A1E4A;
      letter-spacing: 0.02em;
    }

    /* Right column: Balanced, refined portrait card */
    .portrait-col {
      flex-shrink: 0;
      width: 350px;
      height: 460px;
      position: relative;
    }

    .portrait-frame {
      width: 100%;
      height: 100%;
      border-radius: 26px;
      overflow: hidden;
      position: relative;
      border: 2px solid rgba(212, 165, 116, 0.6);
      box-shadow:
        0 20px 40px -10px rgba(122, 30, 74, 0.18),
        0 8px 18px -4px rgba(0, 0, 0, 0.08);
      background: #EDE6F2;
    }

    .portrait-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 12%;
      display: block;
    }

    /* Scrim gradient on portrait */
    .portrait-gradient {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to bottom,
        transparent 50%,
        rgba(31, 26, 36, 0.5) 76%,
        rgba(31, 26, 36, 0.88) 100%
      );
    }

    /* Name overlay on portrait */
    .portrait-name-tag {
      position: absolute;
      bottom: 20px;
      left: 20px;
      right: 20px;
      color: #FFFFFF;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }

    .portrait-name {
      font-family: 'DM Serif Display', Georgia, serif;
      font-size: 30px;
      line-height: 1.1;
      letter-spacing: -0.01em;
    }

    .portrait-title {
      font-size: 14px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.95);
      margin-top: 3px;
      letter-spacing: 0.02em;
    }

    /* Floating pill badge */
    .top-floating-badge {
      position: absolute;
      top: -12px;
      right: 18px;
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
    <!-- Left Column: Rich, well-proportioned narrative -->
    <div class="content">
      <div class="brand-row">
        <div class="brand-logo">
          ${logoSvg}
        </div>
        <div class="brand-name">HireFound</div>
        <div class="brand-badge">${badgeText}</div>
      </div>

      <div class="narrative-body">
        <h1 class="headline">
          ${headlineLine1}<br>
          <span class="plum-accent">${headlineLine2}</span>
        </h1>
        <p class="subtitle">
          ${subtitle}
        </p>
        ${pills.length > 0 ? `<div class="pills-row">${pillsHtml}</div>` : ""}
        ${
          quoteText
            ? `<div class="quote-strip"><span class="quote-text">${quoteText}</span></div>`
            : ""
        }
      </div>

      <div class="footer-bar">
        <span class="footer-note">${footerNote}</span>
        <span class="footer-domain">${footerDomain}</span>
      </div>
    </div>

    <!-- Right Column: Refined, elegant Yasmin portrait -->
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
    // 1. Flagship Homepage OG Card - Balanced, harmonious, zero empty space
    const homeHtml = buildBalancedTemplate({
      logoSvg,
      yasminDataUri,
      badgeText: "Boutique Search & Speaking",
      headlineLine1: "The right people",
      headlineLine2: "change everything.",
      subtitle: "Boutique recruitment, executive search, and people development across Jordan and the GCC.",
      pills: ["Executive Search", "Talent Advisory", "Speaking & Workshops"],
      quoteText: "Understanding the people behind the CVs and the businesses behind the roles.",
      footerNote: "Jordan & GCC",
      footerDomain: "hirefound.com",
      floatingPill: "Executive Talent Advisor",
    });

    const homeOut = path.join(ROOT, "public/assets/og-image.png");
    await renderCard(browser, homeHtml, homeOut);

    // 2. Jobs Board OG Card - Harmonious and clear
    const jobsHtml = buildBalancedTemplate({
      logoSvg,
      yasminDataUri,
      badgeText: "Curated Open Roles",
      headlineLine1: "Find your match.",
      headlineLine2: "Where you belong.",
      subtitle: "Curated leadership, tech, and hospitality opportunities across Jordan and the GCC.",
      pills: ["Leadership", "Tech & Product", "Hospitality"],
      quoteText: "Connecting exceptional talent with meaningful roles across the region.",
      footerNote: "Live Vacancies Board",
      footerDomain: "hirefound.com/jobs",
      floatingPill: "Curated Opportunities",
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
