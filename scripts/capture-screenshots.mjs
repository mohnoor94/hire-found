import { exec, spawn } from "node:child_process";
import { promisify } from "node:util";
import http from "node:http";
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const pexec = promisify(exec);

function waitOnServer(url, timeoutMs = 15000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      http
        .get(url, (res) => {
          res.resume();
          resolve();
        })
        .on("error", () => {
          if (Date.now() - start > timeoutMs) reject(new Error("server wait timeout"));
          else setTimeout(check, 300);
        });
    };
    check();
  });
}

async function main() {
  // Ensure fresh build
  await pexec("npm run -s build", { cwd: process.cwd() });

  // Stage a static root so that pages live under /hire-found/
  const root = "/tmp/hirefound-static-root";
  const base = path.join(root, "hire-found");
  fs.rmSync(root, { recursive: true, force: true });
  fs.mkdirSync(base, { recursive: true });
  // Copy everything from out/ into /tmp/hirefound-static-root/hire-found/
  await pexec(`cp -R out/* "${base}/"`);

  // Serve the parent of /hire-found on 3100
  const port = 3123;
  const serve = spawn("npx", ["http-server", root, "-p", String(port)], {
    stdio: "ignore",
  });
  await waitOnServer(`http://127.0.0.1:${port}/hire-found/`);

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ deviceScaleFactor: 1 });

  const routes = [
    { path: "/hire-found/", name: "en" },
    { path: "/hire-found/ar/", name: "ar" },
  ];
  const sizes = [
    { width: 1440, height: 900, suffix: "desktop" },
    { width: 390, height: 844, suffix: "mobile" },
  ];

  for (const route of routes) {
    for (const size of sizes) {
      const page = await ctx.newPage();
      await page.setViewportSize({ width: size.width, height: size.height });
      await page.goto(`http://127.0.0.1:${port}${route.path}`, {
        waitUntil: "domcontentloaded",
      });
      await page.waitForSelector("#markets", { timeout: 15000 });
      // Basic runtime checks
      const ok = await page.evaluate(() => {
        const html = document.documentElement;
        const body = document.body;
        const noOverflow =
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth + 1;
        return {
          lang: html.lang,
          dir: html.dir || body.dir || "",
          noOverflow,
          hasMarkets: !!document.getElementById("markets"),
        };
      });
      console.log(`Checked ${route.path}`, ok);
      const outPath = `/opt/cursor/artifacts/hirefound-${route.name}-${size.suffix}.png`;
      await page.screenshot({ path: outPath, fullPage: true });
      await page.close();
      console.log(`Saved ${outPath}`);
    }
  }

  await browser.close();
  // Kill server
  try { serve.kill(); } catch {}
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

