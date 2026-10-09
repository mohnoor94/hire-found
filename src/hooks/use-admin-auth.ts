"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
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

/** Exported for unit tests. */
export function resolveAuthStatus(nextUser: User | null): {
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

type AuthSnapshot = {
  status: AdminAuthStatus;
  user: User | null;
  signInError: string | null;
  signingIn: boolean;
};

const SESSION_FLAG = "hf-yasmin-auth";

function writeSessionFlag(authenticated: boolean) {
  try {
    if (authenticated) sessionStorage.setItem(SESSION_FLAG, "1");
    else sessionStorage.removeItem(SESSION_FLAG);
  } catch {
    // Ignore quota / private-mode failures.
  }
}

function initialStatus(): AdminAuthStatus {
  if (!auth) return "unavailable";
  if (auth.currentUser) return resolveAuthStatus(auth.currentUser).status;
  return "loading";
}

let snapshot: AuthSnapshot = {
  status: initialStatus(),
  user: auth?.currentUser
    ? resolveAuthStatus(auth.currentUser).user
    : null,
  signInError: null,
  signingIn: false,
};

const storeListeners = new Set<() => void>();
let authStarted = false;
let denyTimer: ReturnType<typeof setTimeout> | null = null;
let persistenceStarted = false;

function emit(next: Partial<AuthSnapshot>) {
  snapshot = { ...snapshot, ...next };
  if (snapshot.status === "authenticated") writeSessionFlag(true);
  else if (
    snapshot.status === "signed-out" ||
    snapshot.status === "denied"
  ) {
    writeSessionFlag(false);
  }
  storeListeners.forEach((listener) => listener());
}

function clearDenyTimer() {
  if (denyTimer) {
    clearTimeout(denyTimer);
    denyTimer = null;
  }
}

function applyUser(nextUser: User | null) {
  clearDenyTimer();
  const resolved = resolveAuthStatus(nextUser);

  emit({
    user: resolved.user,
    status: resolved.status,
    signInError:
      resolved.status === "authenticated" ? null : snapshot.signInError,
  });

  if (resolved.status === "denied" && auth) {
    const authInstance = auth;
    denyTimer = setTimeout(() => {
      firebaseSignOut(authInstance).catch((err) => {
        console.error("Auto sign-out failed:", err);
      });
    }, AUTO_SIGN_OUT_DELAY_MS);
  }
}

function startAuthStore() {
  if (authStarted) return;
  authStarted = true;

  if (!auth) {
    emit({ status: "unavailable", user: null });
    return;
  }

  const authInstance = auth;

  void (async () => {
    if (!persistenceStarted) {
      persistenceStarted = true;
      try {
        await setPersistence(authInstance, browserLocalPersistence);
      } catch (error) {
        console.error("Failed to set auth persistence:", error);
      }
    }

    try {
      await authInstance.authStateReady();
    } catch (error) {
      console.error("Failed to await authStateReady:", error);
    }

    applyUser(authInstance.currentUser);

    onAuthStateChanged(
      authInstance,
      (nextUser) => {
        applyUser(nextUser);
      },
      (error) => {
        console.error("Auth state listener error:", error);
        emit({ status: "unavailable" });
      },
    );
  })();
}

function subscribe(listener: () => void) {
  storeListeners.add(listener);
  startAuthStore();
  return () => {
    storeListeners.delete(listener);
  };
}

function getSnapshot() {
  return snapshot;
}

function getServerSnapshot(): AuthSnapshot {
  return {
    status: "loading",
    user: null,
    signInError: null,
    signingIn: false,
  };
}

export function useAdminAuth(): UseAdminAuthResult {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    startAuthStore();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!auth) {
      emit({ status: "unavailable" });
      return;
    }

    emit({ signingIn: true, signInError: null });

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      const code =
        error && typeof error === "object" && "code" in error
          ? String((error as { code: string }).code)
          : "";

      if (code === "auth/popup-blocked") {
        emit({
          signInError:
            "Pop-up was blocked. Please allow pop-ups for this site.",
        });
      } else if (code === "auth/popup-closed-by-user") {
        // User closed popup - no error
      } else {
        console.error("Sign-in error:", error);
        emit({ signInError: "Sign-in failed. Please try again." });
      }
    } finally {
      emit({ signingIn: false });
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
    status: state.status,
    user: state.user,
    signInError: state.signInError,
    signingIn: state.signingIn,
    signInWithGoogle,
    signOut,
    retry,
  };
}

/** Test-only: reset module store between cases. */
export function __resetAdminAuthStoreForTests() {
  clearDenyTimer();
  authStarted = false;
  persistenceStarted = false;
  snapshot = {
    status: initialStatus(),
    user: auth?.currentUser
      ? resolveAuthStatus(auth.currentUser).user
      : null,
    signInError: null,
    signingIn: false,
  };
  storeListeners.clear();
}
