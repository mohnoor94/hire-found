import puppeteer from "puppeteer";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const butterflySvg = `<svg viewBox="-6 1 28 20" width="22" height="17" fill="none" style="vertical-align: middle; margin-right: 5px;">
  <path d="M8 10 C6 6 2 3 -1 2.5 C-3.5 2 -5 3.5 -5 6 C-5 8.5 -3 11 0 11.5 C3 12 6 11 8 10 Z" fill="#C4B5FD" />
  <path d="M8 10 C6 12 3 15 0.5 16.5 C-2 18 -4.5 17.5 -4.5 15 C-4.5 12.5 -2.5 11 0.5 11 C3 11 6 10.5 8 10 Z" fill="#FDA4AF" />
  <path d="M8 10 C10 6 14 3 17 2.5 C19.5 2 21 3.5 21 6 C21 8.5 19 11 16 11.5 C13 12 10 11 8 10 Z" fill="#C4B5FD" />
  <path d="M8 10 C10 12 13 15 15.5 16.5 C18 18 20.5 17.5 20.5 15 C20.5 12.5 18.5 11 15.5 11 C13 11 10 10.5 8 10 Z" fill="#FDA4AF" />
  <ellipse cx="8" cy="11" rx="1" ry="4" fill="#7C3AED" />
  <path d="M7.5 7 C6.2 4.5 4.5 3 3.5 2.2" stroke="#7C3AED" stroke-width="0.75" stroke-linecap="round" />
  <path d="M8.5 7 C9.8 4.5 11.5 3 12.5 2.2" stroke="#7C3AED" stroke-width="0.75" stroke-linecap="round" />
  <circle cx="3.5" cy="2.2" r="0.75" fill="#7C3AED" />
  <circle cx="12.5" cy="2.2" r="0.75" fill="#7C3AED" />
</svg>`;

function buildTemplate({
  logoSvg,
  yasminDataUri,
  badgeText,
  kickerText,
  headlineHtml,
  subText,
  pills,
  locationText,
  urlText,
  sealText,
  cardRole,
  cardStripLeft,
  cardStripRight,
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@400;500;600;700&display=swap');

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

    /* Ambient atmospheric warmth */
    .bg-canvas {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 86% 22%, rgba(196, 181, 253, 0.25) 0%, transparent 44%),
        radial-gradient(circle at 14% 86%, rgba(212, 165, 116, 0.18) 0%, transparent 40%),
        radial-gradient(circle at 48% 46%, rgba(122, 30, 74, 0.035) 0%, transparent 60%),
        #FCF9F5;
      z-index: 1;
    }

    /* Outer fine hairline double border */
    .outer-border {
      position: absolute;
      inset: 18px;
      border: 1px solid rgba(212, 165, 116, 0.45);
      border-radius: 20px;
      pointer-events: none;
      z-index: 10;
    }

    .inner-border {
      position: absolute;
      inset: 24px;
      border: 1px solid rgba(122, 30, 74, 0.12);
      border-radius: 14px;
      pointer-events: none;
      z-index: 10;
    }

    /* Corner accents */
    .corner-accent {
      position: absolute;
      width: 12px;
      height: 12px;
      border: 2px solid #D4A574;
      z-index: 11;
    }
    .corner-tl { top: 20px; left: 20px; border-right: none; border-bottom: none; border-top-left-radius: 4px; }
    .corner-tr { top: 20px; right: 20px; border-left: none; border-bottom: none; border-top-right-radius: 4px; }
    .corner-bl { bottom: 20px; left: 20px; border-right: none; border-top: none; border-bottom-left-radius: 4px; }
    .corner-br { bottom: 20px; right: 20px; border-left: none; border-top: none; border-bottom-right-radius: 4px; }

    /* Main container */
    .layout {
      position: relative;
      z-index: 5;
      display: flex;
      width: 100%;
      height: 100%;
      padding: 50px 58px;
      gap: 52px;
      align-items: center;
    }

    /* Left narrative column */
    .content {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      justifyContent: space-between;
      height: 100%;
      padding: 6px 0;
    }

    .brand-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }

    .brand-logo {
      display: flex;
      align-items: center;
      height: 38px;
    }

    .brand-logo svg {
      height: 38px;
      width: auto;
      display: block;
    }

    .brand-name {
      font-family: 'DM Serif Display', Georgia, serif;
      font-size: 35px;
      color: #7A1E4A;
      letter-spacing: -0.02em;
      line-height: 1;
    }

    .brand-badge {
      display: inline-flex;
      align-items: center;
      background: rgba(122, 30, 74, 0.08);
      border: 1px solid rgba(122, 30, 74, 0.16);
      border-radius: 999px;
      padding: 5px 13px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #7A1E4A;
      margin-left: 6px;
    }

    .hero-copy {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .kicker {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #C08D58;
      margin-bottom: 2px;
    }

    .headline {
      font-family: 'DM Serif Display', Georgia, serif;
      font-size: 54px;
      line-height: 1.06;
      color: #1F1A24;
      letter-spacing: -0.02em;
    }

    .headline .plum-accent {
      color: #7A1E4A;
      font-style: italic;
    }

    .tagline-sub {
      font-size: 17px;
      line-height: 1.5;
      color: #6B5E68;
      max-width: 580px;
    }

    .divider-line {
      height: 1px;
      width: 100%;
      background: linear-gradient(to right, rgba(212, 165, 116, 0.5), rgba(212, 165, 116, 0.18) 75%, transparent);
      margin-bottom: 2px;
    }

    .footer-meta {
      display: flex;
      flex-direction: column;
      gap: 14px;
      width: 100%;
    }

    .pill-group {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .pill {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      background: #FFFFFF;
      border: 1px solid rgba(212, 165, 116, 0.45);
      border-radius: 999px;
      padding: 6px 14px;
      font-size: 12px;
      font-weight: 600;
      color: #1F1A24;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    }

    .pill-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #7A1E4A;
    }

    .url-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 13px;
      color: #8C7D88;
      width: 100%;
    }

    .url-text {
      font-weight: 700;
      letter-spacing: 0.04em;
      color: #7A1E4A;
    }

    /* Right visual column: Yasmin Portrait Card */
    .portrait-col {
      flex-shrink: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }

    .portrait-card {
      position: relative;
      width: 376px;
      height: 494px;
      background: #FFFFFF;
      border-radius: 28px;
      padding: 13px;
      border: 1px solid rgba(212, 165, 116, 0.45);
      box-shadow:
        0 24px 48px -12px rgba(122, 30, 74, 0.12),
        0 8px 16px -4px rgba(0, 0, 0, 0.04);
      display: flex;
      flex-direction: column;
    }

    .portrait-inner-frame {
      position: relative;
      flex: 1;
      border-radius: 20px;
      overflow: hidden;
      background: #EDE6F2;
    }

    .portrait-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 15%;
      display: block;
    }

    /* Subtle gradient overlay at base of image for legible overlay */
    .portrait-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to bottom,
        transparent 55%,
        rgba(31, 26, 36, 0.4) 78%,
        rgba(31, 26, 36, 0.8) 100%
      );
    }

    /* Floating label over bottom of image */
    .portrait-caption {
      position: absolute;
      bottom: 14px;
      left: 14px;
      right: 14px;
      color: #FFFFFF;
      display: flex;
      flex-direction: column;
      gap: 2px;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    }

    .founder-name {
      font-family: 'DM Serif Display', Georgia, serif;
      font-size: 25px;
      line-height: 1.1;
      color: #FFFFFF;
      letter-spacing: -0.01em;
    }

    .founder-role {
      font-size: 12px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.92);
      letter-spacing: 0.02em;
    }

    /* Floating decorative badge at top-right */
    .floating-seal {
      position: absolute;
      top: -14px;
      right: -14px;
      background: #7A1E4A;
      color: #FCF9F5;
      border: 3px solid #FCF9F5;
      box-shadow: 0 8px 20px rgba(122, 30, 74, 0.32);
      border-radius: 999px;
      padding: 8px 16px;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      z-index: 15;
    }

    .seal-sparkle {
      color: #D4A574;
      font-size: 13px;
    }

    /* Bottom strip under card */
    .card-footer-strip {
      padding-top: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 11px;
      font-weight: 600;
      color: #6B5E68;
    }

    .card-footer-strip .accent-link {
      color: #7A1E4A;
      font-weight: 700;
    }
  </style>
</head>
<body>
  <div class="bg-canvas"></div>
  <div class="outer-border"></div>
  <div class="inner-border"></div>
  <div class="corner-accent corner-tl"></div>
  <div class="corner-accent corner-tr"></div>
  <div class="corner-accent corner-bl"></div>
  <div class="corner-accent corner-br"></div>

  <div class="layout">
    <!-- Left Column -->
    <div class="content">
      <div class="brand-row">
        <div class="brand-logo">
          ${logoSvg}
        </div>
        <div class="brand-name">HireFound</div>
        <div class="brand-badge">${butterflySvg} ${badgeText}</div>
      </div>

      <div class="hero-copy">
        <div class="kicker">${kickerText}</div>
        <h1 class="headline">
          ${headlineHtml}
        </h1>
        <p class="tagline-sub">
          ${subText}
        </p>
      </div>

      <div class="footer-meta">
        <div class="divider-line"></div>
        <div class="pill-group">
          ${pills
            .map(
              (pill) => `
          <div class="pill">
            <span class="pill-dot"></span>
            ${pill}
          </div>`,
            )
            .join("")}
        </div>
        <div class="url-row">
          <span>${locationText}</span>
          <span class="url-text">${urlText}</span>
        </div>
      </div>
    </div>

    <!-- Right Column: Yasmin Card -->
    <div class="portrait-col">
      <div class="portrait-card">
        <div class="floating-seal">
          <span class="seal-sparkle">✦</span>
          <span>${sealText}</span>
        </div>
        <div class="portrait-inner-frame">
          <img src="${yasminDataUri}" alt="Yasmin Blasi" class="portrait-img">
          <div class="portrait-overlay"></div>
          <div class="portrait-caption">
            <div class="founder-name">Yasmin Blasi</div>
            <div class="founder-role">${cardRole}</div>
          </div>
        </div>
        <div class="card-footer-strip">
          <span>${cardStripLeft}</span>
          <span class="accent-link">${cardStripRight}</span>
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
      deviceScaleFactor: 1, // 1200x630 pixel-for-pixel perfection
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
    // 1. Flagship Homepage OG Card
    const homeHtml = buildTemplate({
      logoSvg,
      yasminDataUri,
      badgeText: "Executive Search",
      kickerText: "Strategic Talent Partner · MENA",
      headlineHtml: 'You want a hire?<br><span class="plum-accent">We got you found.</span>',
      subText: "Connecting visionary founders and leaders with exceptional executive talent across Jordan, Saudi Arabia, and the UAE.",
      pills: ["Direct Founder Access", "10+ Years MENA", "C-Suite to Specialist"],
      locationText: "Amman · Riyadh · Dubai",
      urlText: "hirefound.com",
      sealText: "TEDx Speaker",
      cardRole: "Founder & Managing Director",
      cardStripLeft: "Executive Search",
      cardStripRight: "HireFound.com",
    });

    const homeOut = path.join(ROOT, "public/assets/og-image.png");
    await renderCard(browser, homeHtml, homeOut);

    // 2. Jobs Board OG Card
    const jobsHtml = buildTemplate({
      logoSvg,
      yasminDataUri,
      badgeText: "Open Roles",
      kickerText: "Curated Opportunities · Jordan & the Gulf",
      headlineHtml: 'Find Your Match.<br><span class="plum-accent">Discover open roles.</span>',
      subText: "Explore curated executive, hospitality, tech, and specialist positions matched with leading companies across the region.",
      pills: ["Hospitality & F&B", "Tech & Aviation", "Direct Recruiter Access"],
      locationText: "Amman · Regional Remote · Gulf",
      urlText: "hirefound.com/jobs",
      sealText: "Career Matchmaker",
      cardRole: "Founder & Talent Advisor",
      cardStripLeft: "Live Vacancies Board",
      cardStripRight: "Explore Roles ↗",
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
