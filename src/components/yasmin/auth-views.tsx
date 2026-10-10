"use client";

import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";

const primaryButton =
  "inline-flex min-h-11 w-full touch-manipulation items-center justify-center gap-2 rounded-full bg-[#7A1E4A] px-6 text-sm font-semibold text-[#FCF9F5] shadow-[0_4px_16px_rgba(122,30,74,0.22)] select-none transition-all duration-150 ease-out hover:bg-[#5E1639] hover:shadow-[0_6px_22px_rgba(122,30,74,0.3)] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60";

const quietButton =
  "inline-flex min-h-11 touch-manipulation items-center justify-center rounded-full border border-[#D4A574]/40 bg-white/80 px-6 text-sm font-semibold text-[#7A1E4A] shadow-xs select-none transition-all duration-150 ease-out hover:border-[#D4A574] hover:bg-[#FCF9F5] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

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
        <h1 className="font-accent text-3xl tracking-[-0.02em] text-[#7A1E4A]">
          Authentication Unavailable
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#5E534C]">
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
          className="mx-auto size-10 animate-spin rounded-full border-3 border-[#7A1E4A]/25 border-t-[#7A1E4A] motion-reduce:animate-none"
          aria-hidden="true"
        />
        <p
          className="mt-4 font-serif text-sm text-[#5E534C]"
          role="status"
          suppressHydrationWarning
        >
          Loading...
        </p>
      </AuthShell>
    );
  }

  if (status === "denied") {
    return (
      <AuthShell>
        <h1 className="font-accent text-3xl tracking-[-0.02em] text-[#7A1E4A] sm:text-4xl">
          Access Denied
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#5E534C]">
          This account is not authorized to access the admin panel.
        </p>
        <p className="mt-4 text-xs text-[#5E534C]/70">Signing out automatically...</p>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      {/* Delicate emblem */}
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-linear-to-br from-[#F3EBE3] to-[#C4B5FD]/30 shadow-xs ring-1 ring-[#D4A574]/40">
        <Sparkles className="size-6 text-[#7A1E4A]" aria-hidden="true" />
      </div>

      <h1 className="font-accent text-3xl tracking-[-0.02em] text-[#7A1E4A] sm:text-4xl">
        Yasmin&apos;s Space
      </h1>
      <div className="mx-auto mt-3 h-0.5 w-10 rounded-full bg-[#D4A574]" aria-hidden="true" />
      <p className="mt-3 font-serif text-sm leading-relaxed text-[#5E534C]">
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
    <div className="relative flex min-h-dvh items-center justify-center px-4 pb-[env(safe-area-inset-bottom)] sm:px-6">
      <div
        className="pointer-events-none absolute -top-16 -right-16 size-72 rounded-full bg-[#FDA4AF]/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-16 size-72 rounded-full bg-[#FCD34D]/15 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-sm rounded-3xl border border-[#D4A574]/30 bg-white/90 p-8 text-center shadow-[0_12px_40px_rgba(122,30,74,0.06)] backdrop-blur-xs sm:p-10">
        {children}
      </div>
    </div>
  );
}

export default AuthViews;
