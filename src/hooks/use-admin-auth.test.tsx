/**
 * @vitest-environment jsdom
 */
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { resolveAuthStatus } from "./use-admin-auth";
import { AUTO_SIGN_OUT_DELAY_MS } from "@/lib/yasmin/auth";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

const authMocks = vi.hoisted(() => {
  const listeners: Array<(user: unknown) => void> = [];
  const state = {
    currentUser: null as null | { email: string; uid: string },
    readyShouldFail: false,
  };

  return {
    listeners,
    state,
    authStateReady: vi.fn(async () => {
      if (state.readyShouldFail) {
        throw new Error("ready failed");
      }
    }),
    onAuthStateChanged: vi.fn(
      (_auth: unknown, next: (user: unknown) => void) => {
        listeners.push(next);
        return () => {
          const i = listeners.indexOf(next);
          if (i >= 0) listeners.splice(i, 1);
        };
      },
    ),
    signOut: vi.fn(async () => {
      state.currentUser = null;
      listeners.forEach((cb) => cb(null));
    }),
    signInWithPopup: vi.fn(),
    GoogleAuthProvider: vi.fn(),
  };
});

vi.mock("firebase/auth", () => ({
  GoogleAuthProvider: authMocks.GoogleAuthProvider,
  onAuthStateChanged: authMocks.onAuthStateChanged,
  signInWithPopup: authMocks.signInWithPopup,
  signOut: authMocks.signOut,
}));

vi.mock("@/lib/firebase", () => ({
  auth: {
    get currentUser() {
      return authMocks.state.currentUser;
    },
    authStateReady: () => authMocks.authStateReady(),
  },
}));

import { __resetAdminAuthStoreForTests, useAdminAuth } from "./use-admin-auth";

function HookProbe({
  onUpdate,
}: {
  onUpdate: (value: ReturnType<typeof useAdminAuth>) => void;
}) {
  const value = useAdminAuth();
  onUpdate(value);
  return null;
}

describe("resolveAuthStatus", () => {
  it("authenticates allowlisted emails", () => {
    expect(
      resolveAuthStatus({
        email: "yasmin@hirefound.com",
        uid: "1",
      } as never).status,
    ).toBe("authenticated");
  });

  it("denies non-allowlisted emails with null user", () => {
    const result = resolveAuthStatus({
      email: "stranger@example.com",
      uid: "2",
    } as never);
    expect(result.status).toBe("denied");
    expect(result.user).toBeNull();
  });

  it("returns signed-out for null", () => {
    expect(resolveAuthStatus(null).status).toBe("signed-out");
  });
});

describe("useAdminAuth", () => {
  let container: HTMLDivElement;
  let root: Root;
  let latest: ReturnType<typeof useAdminAuth> | null;

  beforeEach(() => {
    vi.useFakeTimers();
    authMocks.listeners.length = 0;
    authMocks.state.currentUser = null;
    authMocks.state.readyShouldFail = false;
    authMocks.authStateReady.mockClear();
    authMocks.onAuthStateChanged.mockClear();
    authMocks.signOut.mockClear();
    __resetAdminAuthStoreForTests();
    latest = null;
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    vi.useRealTimers();
  });

  async function mount() {
    await act(async () => {
      root.render(
        <HookProbe
          onUpdate={(value) => {
            latest = value;
          }}
        />,
      );
    });
    // Flush initAuth promise chain
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
  }

  it("stays authenticated when authStateReady restores an allowlisted user", async () => {
    authMocks.state.currentUser = {
      email: "moh.noor94@gmail.com",
      uid: "u1",
    };
    await mount();
    expect(latest?.status).toBe("authenticated");
    expect(latest?.user?.email).toBe("moh.noor94@gmail.com");
  });

  it("still registers the listener when authStateReady fails", async () => {
    authMocks.state.readyShouldFail = true;
    authMocks.state.currentUser = {
      email: "yasmin@hirefound.com",
      uid: "u2",
    };
    await mount();
    expect(authMocks.onAuthStateChanged).toHaveBeenCalled();
    expect(latest?.status).toBe("authenticated");
  });

  it("auto-signs out denied users after the delay", async () => {
    authMocks.state.currentUser = {
      email: "stranger@example.com",
      uid: "u3",
    };
    await mount();
    expect(latest?.status).toBe("denied");

    await act(async () => {
      vi.advanceTimersByTime(AUTO_SIGN_OUT_DELAY_MS);
      await Promise.resolve();
    });

    expect(authMocks.signOut).toHaveBeenCalled();
  });
});
