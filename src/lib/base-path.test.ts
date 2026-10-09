import { afterEach, describe, expect, it, vi } from "vitest";

describe("withBasePath", () => {
  afterEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it("prefixes root-absolute paths with the configured base path", async () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/hire-found");
    const { withBasePath } = await import("./base-path");
    expect(withBasePath("/assets/logo.svg")).toBe("/hire-found/assets/logo.svg");
    expect(withBasePath("/jobs/")).toBe("/hire-found/jobs/");
    expect(withBasePath("/")).toBe("/hire-found/");
  });

  it("leaves hashes, external URLs, and already-prefixed paths alone", async () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/hire-found");
    const { withBasePath } = await import("./base-path");
    expect(withBasePath("#about")).toBe("#about");
    expect(withBasePath("https://example.com/x")).toBe("https://example.com/x");
    expect(withBasePath("/hire-found/jobs/")).toBe("/hire-found/jobs/");
  });

  it("is a no-op when base path is empty (custom domain)", async () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "");
    const { withBasePath } = await import("./base-path");
    expect(withBasePath("/jobs/")).toBe("/jobs/");
    expect(withBasePath("/assets/x.png")).toBe("/assets/x.png");
  });
});
