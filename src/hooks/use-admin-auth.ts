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

export function useAdminAuth(): UseAdminAuthResult {
  const [status, setStatus] = useState<AdminAuthStatus>(() =>
    auth ? "loading" : "unavailable",
  );
  const [user, setUser] = useState<User | null>(null);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);
  const denyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearDenyTimer = useCallback(() => {
    if (denyTimerRef.current) {
      clearTimeout(denyTimerRef.current);
      denyTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!auth) {
      return;
    }

    setPersistence(auth, browserLocalPersistence).catch((error) => {
      console.error("Failed to set auth persistence:", error);
    });

    const unsubscribe = onAuthStateChanged(
      auth,
      (nextUser) => {
        clearDenyTimer();

        if (!nextUser) {
          setUser(null);
          setStatus("signed-out");
          return;
        }

        if (isEmailAllowed(nextUser.email, ALLOWED_EMAILS)) {
          setUser(nextUser);
          setStatus("authenticated");
          setSignInError(null);
          return;
        }

        setUser(null);
        setStatus("denied");
        denyTimerRef.current = setTimeout(() => {
          firebaseSignOut(auth!).catch((err) => {
            console.error("Auto sign-out failed:", err);
          });
        }, AUTO_SIGN_OUT_DELAY_MS);
      },
      (error) => {
        console.error("Auth state listener error:", error);
        setStatus("unavailable");
      },
    );

    return () => {
      unsubscribe();
      clearDenyTimer();
    };
  }, [clearDenyTimer]);

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
