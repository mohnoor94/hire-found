import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages (hirefound.com).
 * No Next.js server, API routes, or middleware — see docs/platform-plan.md.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // basePath defaults to "" (site root /) for the custom domain.
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
