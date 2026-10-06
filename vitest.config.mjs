import { defineConfig } from "vitest/config";
import path from "path";

const root = import.meta.dirname;

export default defineConfig({
  test: {
    include: [
      "yasmin/__tests__/**/*.test.js",
      "__tests__/**/*.test.js",
      "src/**/*.test.ts",
      "src/**/*.test.tsx",
    ],
    environment: "jsdom",
  },
  resolve: {
    alias: {
      "@": path.resolve(root, "./src"),
      "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js":
        path.resolve(root, "yasmin/__tests__/__mocks__/firebase-firestore.js"),
      "../../js/firebase-config.js": path.resolve(
        root,
        "yasmin/__tests__/__mocks__/firebase-config.js",
      ),
      "../js/firebase-config.js": path.resolve(
        root,
        "yasmin/__tests__/__mocks__/firebase-config.js",
      ),
      "./firebase-config.js": path.resolve(
        root,
        "yasmin/__tests__/__mocks__/firebase-config.js",
      ),
    },
  },
});
