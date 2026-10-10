import { exec } from "node:child_process";
import { promisify } from "node:util";
import http from "node:http";
import { chromium } from "@playwright/test";

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
  // Serve the static export from /out on 3100
  const serve = pexec("npx http-server out -p 3100 -s");
  await waitOnServer("http://127.0.0.1:3100/hire-found/");

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
      await page.goto(`http://127.0.0.1:3100${route.path}`);
      await page.waitForLoadState("networkidle");
      const outPath = `/opt/cursor/artifacts/hirefound-${route.name}-${size.suffix}.png`;
      await page.screenshot({ path: outPath, fullPage: true });
      await page.close();
      console.log(`Saved ${outPath}`);
    }
  }

  await browser.close();
  // Kill server
  try {
    const { pid } = await serve;
    if (pid) process.kill(pid);
  } catch {}
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

