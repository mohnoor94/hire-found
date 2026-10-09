import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages.
 * Interim host: mohnoor94.github.io/hire-found (project Pages) → basePath /hire-found.
 * When hirefound.com DNS is attached, set basePath and NEXT_PUBLIC_BASE_PATH to "".
 * No Next.js server, API routes, or middleware — see docs/platform-plan.md.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/hire-found";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
