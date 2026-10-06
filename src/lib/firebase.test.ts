import { describe, expect, it } from "vitest";
import { firebaseConfig } from "./firebase";

describe("firebase client config", () => {
  it("targets the hire-found Firebase project", () => {
    expect(firebaseConfig.projectId).toBe("hire-found");
    expect(firebaseConfig.authDomain).toBe("hire-found.firebaseapp.com");
    expect(firebaseConfig.appId).toBe(
      "1:812389969333:web:cbed15aa6153609a523dfc",
    );
  });
});
