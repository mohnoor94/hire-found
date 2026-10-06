"use client";

import { ButterflyIcon } from "./butterfly-icon";

type AuthViewsProps = {
  status: "loading" | "signed-out" | "denied" | "unavailable";
  signInError: string | null;
  signingIn: boolean;
  onSignIn: () => void;
  onRetry: () => void;
};

export function AuthViews({
  status,
  signInError,
  signingIn,
  onSignIn,
  onRetry,
}: AuthViewsProps) {
  if (status === "unavailable") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <svg
              className="h-8 w-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="font-accent mb-2 text-xl font-bold text-text-main">
            Authentication Unavailable
          </h2>
          <p className="mb-6 text-sm text-[#6B6560]">
            Unable to connect to the authentication service. Please try again.
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-primary-light"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="admin-loading-spinner mx-auto mb-4">
            <ButterflyIcon size={48} />
          </div>
          <p className="text-sm text-[#6B6560]">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="mx-auto w-full max-w-sm px-6 text-center">
          <ButterflyIcon size={64} className="mx-auto mb-6" />
          <h1 className="font-accent mb-2 text-3xl font-bold text-butterfly-rose">
            Access Denied
          </h1>
          <p className="mb-4 text-sm text-[#6B6560]">
            This account is not authorized to access the admin panel.
          </p>
          <p className="text-xs text-[#6B6560]">Signing out automatically...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="relative mx-auto w-full max-w-sm px-6 text-center">
        <ButterflyIcon size={64} className="mx-auto mb-6" />
        <h1 className="font-accent mb-2 text-3xl font-bold text-primary">
          Yasmin&apos;s Space
        </h1>
        <p className="mb-8 text-sm text-[#6B6560]">Welcome back, beautiful ✨</p>
        <button
          type="button"
          onClick={onSignIn}
          disabled={signingIn}
          className="inline-flex min-h-[44px] min-w-[44px] w-full items-center justify-center rounded-full bg-butterfly-lavender px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-butterfly-lavender/30 transition-all duration-300 hover:bg-butterfly-rose disabled:opacity-60"
        >
          {signingIn ? "Signing in..." : "Sign in with Google"}
        </button>
        {signInError ? (
          <p className="mt-4 text-sm text-butterfly-rose" role="alert">
            {signInError}
          </p>
        ) : null}
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 min-h-[44px] text-xs text-[#6B6560] underline underline-offset-2 transition-colors duration-200 hover:text-primary"
        >
          Already signed in? Tap to refresh
        </button>
      </div>
    </div>
  );
}
