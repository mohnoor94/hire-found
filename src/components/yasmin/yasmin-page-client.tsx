"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Job } from "@/lib/jobs/types";
import type { JobFormData } from "@/lib/jobs/validation";
import {
  createJob,
  deleteJob,
  fetchAllJobs,
  toggleJobActive,
  updateJob,
} from "@/lib/jobs/admin";
import {
  shouldSuppressShortcut,
  type ShortcutViewState,
} from "@/lib/jobs/shortcuts";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { AuthViews } from "./auth-views";
import { YasminDashboard } from "./dashboard";
import { JobEditor, type JobEditorHandle } from "./job-editor";
import { DeleteJobDialog } from "./delete-job-dialog";

type ViewMode = "dashboard" | "create" | "edit";

export function YasminPageClient() {
  const auth = useAdminAuth();
  const [view, setView] = useState<ViewMode>("dashboard");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Job | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const loadedRef = useRef(false);
  const editorRef = useRef<JobEditorHandle>(null);
  const prevAuthStatus = useRef(auth.status);

  const refreshInFlight = useRef(false);

  const isEditorOpen = view !== "dashboard";
  const isModalOpen = Boolean(deleteTarget);

  const refreshJobs = useCallback(async () => {
    if (refreshInFlight.current) return;
    refreshInFlight.current = true;
    setLoading(true);
    setError(false);
    try {
      const next = await fetchAllJobs();
      setJobs(next);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setError(true);
    } finally {
      setLoading(false);
      refreshInFlight.current = false;
    }
  }, []);

  useEffect(() => {
    const prev = prevAuthStatus.current;
    prevAuthStatus.current = auth.status;

    // Drop in-memory admin data when leaving an authenticated session.
    if (prev === "authenticated" && auth.status !== "authenticated") {
      loadedRef.current = false;
      setJobs([]);
      setEditingJob(null);
      setDeleteTarget(null);
      setView("dashboard");
      setError(false);
      setLoading(false);
      return;
    }

    if (auth.status !== "authenticated") {
      loadedRef.current = false;
      return;
    }
    if (loadedRef.current) return;
    loadedRef.current = true;
    void refreshJobs();
  }, [auth.status, refreshJobs]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "n" && event.key !== "N") return;
      const viewState: ShortcutViewState = { isEditorOpen, isModalOpen };
      if (shouldSuppressShortcut(event, viewState)) return;
      setEditingJob(null);
      setView("create");
    }

    if (auth.status !== "authenticated") return;
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [auth.status, isEditorOpen, isModalOpen]);

  const handleNewJob = useCallback(() => {
    setEditingJob(null);
    setView("create");
  }, []);

  const handleEdit = useCallback((job: Job) => {
    setEditingJob(job);
    setView("edit");
  }, []);

  const handleCancelEditor = useCallback(() => {
    setView("dashboard");
    setEditingJob(null);
  }, []);

  const leaveEditor = useCallback(
    (action: () => void) => {
      if (view !== "dashboard" && editorRef.current) {
        editorRef.current.requestLeave(action);
        return;
      }
      action();
    },
    [view],
  );

  const handleSave = useCallback(
    async (formData: JobFormData, jobId: string | null) => {
      setSaving(true);
      try {
        if (jobId) {
          await updateJob(jobId, formData);
          toast.success("Listing saved.");
          setJobs((prev) =>
            prev.map((j) =>
              j.id === jobId
                ? ({
                    ...j,
                    ...formData,
                    slug: String(formData.slug || j.slug),
                  } as Job)
                : j,
            ),
          );
          setView("dashboard");
          setEditingJob(null);
        } else {
          await createJob(formData);
          toast.success("Listing published.");
          setView("dashboard");
          await refreshJobs();
        }
      } catch (err) {
        console.error("Failed to save job:", err);
        toast.error(
          jobId
            ? "Couldn't save this listing. Try again."
            : "Couldn't publish this listing. Try again.",
        );
      } finally {
        setSaving(false);
      }
    },
    [refreshJobs],
  );

  const handleToggleActive = useCallback(async (job: Job) => {
    setTogglingId(job.id);
    const next = !job.isActive;
    try {
      await toggleJobActive(job.id, next);
      setJobs((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, isActive: next } : j)),
      );
    } catch (err) {
      console.error("Failed to toggle job active status:", err);
      toast.error("Failed to update job status. Please try again.");
    } finally {
      setTogglingId(null);
    }
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteJob(deleteTarget.id);
      setJobs((prev) => prev.filter((j) => j.id !== deleteTarget.id));
      toast.success("Job post deleted successfully.");
      setDeleteTarget(null);
    } catch (err) {
      console.error("Failed to delete job:", err);
      toast.error("Failed to delete job post. Please try again.");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget]);

  if (auth.status !== "authenticated" || !auth.user) {
    return (
      <AuthViews
        status={
          auth.status === "authenticated" ? "loading" : auth.status
        }
        signInError={auth.signInError}
        signingIn={auth.signingIn}
        onSignIn={() => void auth.signInWithGoogle()}
        onRetry={auth.retry}
      />
    );
  }

  return (
    <>
      <nav
        className="nav-glass fixed top-0 right-0 left-0 z-50 pt-[env(safe-area-inset-top)]"
        aria-label="Admin navigation"
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <button
            type="button"
            onClick={() => {
              if (view === "dashboard") return;
              leaveEditor(handleCancelEditor);
            }}
            disabled={view !== "dashboard" && saving}
            className="font-accent text-xl text-primary touch-manipulation select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60"
          >
            Yasmin&apos;s Space
          </button>
          <button
            type="button"
            onClick={() => leaveEditor(() => void auth.signOut())}
            disabled={view !== "dashboard" && saving}
            className="inline-flex min-h-11 touch-manipulation items-center px-3 text-sm font-semibold text-primary select-none active:bg-warm-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60"
            aria-label="Sign out"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <div className="pt-[var(--site-nav-offset)]">
        {view === "dashboard" ? (
          <YasminDashboard
            user={auth.user}
            jobs={jobs}
            loading={loading}
            error={error}
            onRefresh={() => void refreshJobs()}
            onNewJob={handleNewJob}
            onEdit={handleEdit}
            onDelete={setDeleteTarget}
            onToggleActive={(job) => void handleToggleActive(job)}
            togglingId={togglingId}
          />
        ) : (
          <JobEditor
            ref={editorRef}
            key={view === "edit" ? editingJob?.id ?? "edit" : "create"}
            job={view === "edit" ? editingJob : null}
            saving={saving}
            onSave={handleSave}
            onCancel={handleCancelEditor}
          />
        )}
      </div>

      <DeleteJobDialog
        job={deleteTarget}
        open={Boolean(deleteTarget)}
        deleting={deleting}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onConfirm={() => void handleConfirmDelete()}
      />
    </>
  );
}
