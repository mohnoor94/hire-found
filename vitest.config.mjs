import { defineConfig } from "vitest/config";
import path from "path";

const root = import.meta.dirname;

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    environment: "jsdom",
  },
  resolve: {
    alias: {
      "@": path.resolve(root, "./src"),
    },
  },
});
