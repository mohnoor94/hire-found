"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  ALLOWED_EMAILS,
  AUTO_SIGN_OUT_DELAY_MS,
  isEmailAllowed,
  type AdminAuthStatus,
} from "@/lib/yasmin/auth";

export type UseAdminAuthResult = {
  status: AdminAuthStatus;
  user: User | null;
  signInError: string | null;
  signingIn: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  retry: () => void;
};

function resolveStatus(nextUser: User | null): {
  status: Exclude<AdminAuthStatus, "loading" | "unavailable">;
  user: User | null;
} {
  if (!nextUser) {
    return { status: "signed-out", user: null };
  }
  if (isEmailAllowed(nextUser.email, ALLOWED_EMAILS)) {
    return { status: "authenticated", user: nextUser };
  }
  return { status: "denied", user: null };
}

export function useAdminAuth(): UseAdminAuthResult {
  const [status, setStatus] = useState<AdminAuthStatus>(() =>
    auth ? "loading" : "unavailable",
  );
  const [user, setUser] = useState<User | null>(null);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);
  const denyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const readyRef = useRef(false);

  const clearDenyTimer = useCallback(() => {
    if (denyTimerRef.current) {
      clearTimeout(denyTimerRef.current);
      denyTimerRef.current = null;
    }
  }, []);

  const applyUser = useCallback(
    (nextUser: User | null) => {
      clearDenyTimer();
      const resolved = resolveStatus(nextUser);
      setUser(resolved.user);
      setStatus(resolved.status);

      if (resolved.status === "authenticated") {
        setSignInError(null);
      }

      if (resolved.status === "denied" && auth) {
        denyTimerRef.current = setTimeout(() => {
          firebaseSignOut(auth).catch((err) => {
            console.error("Auto sign-out failed:", err);
          });
        }, AUTO_SIGN_OUT_DELAY_MS);
      }
    },
    [clearDenyTimer],
  );

  useEffect(() => {
    if (!auth) {
      return;
    }

    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    async function initAuth() {
      try {
        // Await persistence so restore isn't racing the first UI decision.
        await setPersistence(auth!, browserLocalPersistence);
        // Wait until Firebase has finished reading the persisted session.
        await auth!.authStateReady();
      } catch (error) {
        console.error("Failed to initialize auth persistence/state:", error);
        if (!cancelled) {
          setStatus("unavailable");
        }
        return;
      }

      if (cancelled) return;

      readyRef.current = true;
      // First paint decision only after authStateReady — fixes signed-in → sign-in flash.
      applyUser(auth!.currentUser);

      unsubscribe = onAuthStateChanged(
        auth!,
        (nextUser) => {
          if (!readyRef.current || cancelled) return;
          applyUser(nextUser);
        },
        (error) => {
          console.error("Auth state listener error:", error);
          if (!cancelled) setStatus("unavailable");
        },
      );
    }

    void initAuth();

    return () => {
      cancelled = true;
      unsubscribe?.();
      clearDenyTimer();
    };
  }, [applyUser, clearDenyTimer]);

  const signInWithGoogle = useCallback(async () => {
    if (!auth) {
      setStatus("unavailable");
      return;
    }

    setSigningIn(true);
    setSignInError(null);

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // onAuthStateChanged / authStateReady path applies the user
    } catch (error) {
      const code =
        error && typeof error === "object" && "code" in error
          ? String((error as { code: string }).code)
          : "";

      if (code === "auth/popup-blocked") {
        setSignInError(
          "Pop-up was blocked. Please allow pop-ups for this site.",
        );
      } else if (code === "auth/popup-closed-by-user") {
        // User closed popup — no error
      } else {
        console.error("Sign-in error:", error);
        setSignInError("Sign-in failed. Please try again.");
      }
    } finally {
      setSigningIn(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    if (!auth) return;
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  }, []);

  const retry = useCallback(() => {
    window.location.reload();
  }, []);

  return {
    status,
    user,
    signInError,
    signingIn,
    signInWithGoogle,
    signOut,
    retry,
  };
}
