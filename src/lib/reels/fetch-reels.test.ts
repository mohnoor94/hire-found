import { describe, it, expect } from "vitest";
import { fetchReels } from "./fetch-reels";
import { SEED_REELS } from "./seed";

describe("fetchReels public query", () => {
  it("falls back to SEED_REELS when db is undefined", async () => {
    const list = await fetchReels({ db: undefined });
    expect(list).toEqual(SEED_REELS);
    expect(list.length).toBeGreaterThanOrEqual(4);
  });

  it("respects limit option on fallback seed reels", async () => {
    const list = await fetchReels({ db: undefined, limit: 2 });
    expect(list).toHaveLength(2);
    expect(list[0].id).toBe("seed-1");
  });
});
