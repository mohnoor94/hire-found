"use client";

import type { ReactNode } from "react";

const primaryButton =
  "inline-flex min-h-11 w-full touch-manipulation items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground select-none active:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60";

const quietButton =
  "inline-flex min-h-11 touch-manipulation items-center justify-center rounded-full border border-primary/25 bg-white px-6 text-sm font-semibold text-primary select-none active:bg-warm-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

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
      <AuthShell>
        <h1 className="font-accent text-3xl tracking-[-0.02em] text-primary">
          Authentication Unavailable
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Unable to connect to the authentication service. Please try again.
        </p>
        <button type="button" onClick={onRetry} className={`${quietButton} mt-8`}>
          Retry
        </button>
      </AuthShell>
    );
  }

  if (status === "loading") {
    return (
      <AuthShell>
        <div
          className="mx-auto size-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary motion-reduce:animate-none"
          aria-hidden="true"
        />
        <p className="mt-4 text-sm text-muted" role="status">
          Loading...
        </p>
      </AuthShell>
    );
  }

  if (status === "denied") {
    return (
      <AuthShell>
        <h1 className="font-accent text-4xl tracking-[-0.02em] text-primary">
          Access Denied
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          This account is not authorized to access the admin panel.
        </p>
        <p className="mt-4 text-xs text-muted">Signing out automatically...</p>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <h1 className="font-accent text-4xl tracking-[-0.02em] text-primary">
        Yasmin&apos;s Space
      </h1>
      <div className="mx-auto mt-4 h-px w-12 bg-secondary" aria-hidden="true" />
      <p className="mt-4 text-sm leading-relaxed text-muted">
        Sign in to manage listings.
      </p>
      <button
        type="button"
        onClick={onSignIn}
        disabled={signingIn}
        className={`${primaryButton} mt-8`}
      >
        {signingIn ? "Signing in..." : "Sign in with Google"}
      </button>
      {signInError ? (
        <p className="mt-4 text-sm text-destructive" role="alert">
          {signInError}
        </p>
      ) : null}
    </AuthShell>
  );
}

function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh items-center justify-center px-6 pb-[env(safe-area-inset-bottom)]">
      <div className="w-full max-w-sm text-center">{children}</div>
    </div>
  );
}
