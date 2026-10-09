import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import type { Job } from "@/lib/jobs";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

const authState = vi.hoisted(() => ({
  status: "signed-out" as
    | "loading"
    | "signed-out"
    | "denied"
    | "authenticated"
    | "unavailable",
  user: null as null | {
    uid: string;
    displayName: string;
    email: string;
    photoURL: string | null;
  },
  signInError: null as string | null,
  signingIn: false,
  signInWithGoogle: vi.fn(async () => undefined),
  signOut: vi.fn(async () => undefined),
  retry: vi.fn(),
}));

vi.mock("@/hooks/use-admin-auth", () => ({
  useAdminAuth: () => ({
    status: authState.status,
    user: authState.user,
    signInError: authState.signInError,
    signingIn: authState.signingIn,
    signInWithGoogle: authState.signInWithGoogle,
    signOut: authState.signOut,
    retry: authState.retry,
  }),
}));

const { sampleJobs, mockFetchAll } = vi.hoisted(() => {
  const jobs: Job[] = [
    {
      id: "1",
      title: "Senior Barista",
      slug: "senior-barista",
      category: "fnb",
      location: "Jordan",
      employmentType: "full-time",
      companyName: "Cafe",
      isActive: true,
      createdAt: new Date("2026-01-01"),
      updatedAt: null,
      expiresAt: null,
    },
    {
      id: "2",
      title: "Inactive Role",
      slug: "inactive-role",
      category: "tech",
      location: "UAE",
      employmentType: "contract",
      isActive: false,
      createdAt: new Date("2026-01-02"),
      updatedAt: null,
      expiresAt: null,
    },
  ];
  return {
    sampleJobs: jobs,
    mockFetchAll: vi.fn(async () => jobs),
  };
});

vi.mock("@/lib/jobs/admin", () => ({
  fetchAllJobs: () => mockFetchAll(),
  createJob: vi.fn(async () => ({ id: "3", slug: "new-job" })),
  updateJob: vi.fn(async () => undefined),
  deleteJob: vi.fn(async () => undefined),
  toggleJobActive: vi.fn(async () => undefined),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("@/components/yasmin/rich-text-editor", () => ({
  RichTextEditor: ({
    value,
    onChange,
    "aria-label": ariaLabel,
  }: {
    value: string;
    onChange: (v: string) => void;
    "aria-label"?: string;
  }) =>
    React.createElement("textarea", {
      "aria-label": ariaLabel,
      value,
      onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
        onChange(e.target.value),
    }),
  createYasminEditorExtensions: () => [],
}));

import { YasminPageClient } from "./yasmin-page-client";

describe("YasminPageClient", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    vi.clearAllMocks();
    authState.status = "signed-out";
    authState.user = null;
    authState.signInError = null;
    authState.signingIn = false;
    mockFetchAll.mockResolvedValue(sampleJobs);

    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it("shows sign-in when signed out", () => {
    act(() => {
      root.render(<YasminPageClient />);
    });
    expect(container.textContent).toContain("Yasmin's Space");
    expect(container.textContent).toContain("Sign in with Google");
  });

  it("shows access denied state", () => {
    authState.status = "denied";
    act(() => {
      root.render(<YasminPageClient />);
    });
    expect(container.textContent).toContain("Access Denied");
  });

  it("shows loading state", () => {
    authState.status = "loading";
    act(() => {
      root.render(<YasminPageClient />);
    });
    expect(container.textContent).toContain("Loading...");
  });

  it("loads dashboard jobs when authenticated", async () => {
    authState.status = "authenticated";
    authState.user = {
      uid: "u1",
      displayName: "Yasmin Blasi",
      email: "yasmin@hirefound.com",
      photoURL: null,
    };

    await act(async () => {
      root.render(<YasminPageClient />);
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(mockFetchAll).toHaveBeenCalled();
    expect(container.textContent).toContain("Senior Barista");
    expect(container.textContent).toContain("Inactive Role");
    expect(container.textContent).toContain("Quick Actions");
    expect(container.textContent).toContain("Sign Out");
  });

  it("opens create editor from New Job", async () => {
    authState.status = "authenticated";
    authState.user = {
      uid: "u1",
      displayName: "Yasmin",
      email: "yasmin@hirefound.com",
      photoURL: null,
    };

    await act(async () => {
      root.render(<YasminPageClient />);
    });
    await act(async () => {
      await Promise.resolve();
    });

    const newJobBtn = container.querySelector(
      '[aria-label="Create new job post"]',
    ) as HTMLButtonElement;
    expect(newJobBtn).toBeTruthy();

    await act(async () => {
      newJobBtn.click();
    });

    expect(container.textContent).toContain("Create New Job Post");
    expect(container.querySelector("#field-title")).toBeTruthy();
  });

  it("filters the desk to inactive listings", async () => {
    authState.status = "authenticated";
    authState.user = {
      uid: "u1",
      displayName: "Yasmin",
      email: "yasmin@hirefound.com",
      photoURL: null,
    };

    await act(async () => {
      root.render(<YasminPageClient />);
    });
    await act(async () => {
      await Promise.resolve();
    });

    const group = container.querySelector('[aria-label="Filter by status"]');
    expect(group).toBeTruthy();
    const inactiveBtn = group!.querySelector(
      '[data-status="inactive"]',
    ) as HTMLButtonElement | null;
    expect(inactiveBtn).toBeTruthy();

    await act(async () => {
      inactiveBtn!.click();
    });

    expect(container.textContent).not.toContain("Senior Barista");
    expect(container.textContent).toContain("Inactive Role");
  });
});
