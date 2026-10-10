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
import { getCelebrationToast } from "@/lib/yasmin/greeting";
import { withBasePath } from "@/lib/base-path";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { AuthViews } from "./auth-views";
import { YasminDashboard } from "./dashboard";
import { JobEditor, type JobEditorHandle } from "./job-editor";
import { DeleteJobDialog } from "./delete-job-dialog";
import { CelebrationButterfly } from "./celebration-butterfly";
import { ExternalLink, Sparkles } from "lucide-react";

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
  const [celebrating, setCelebrating] = useState(false);
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
          setCelebrating(true);
          toast.success(getCelebrationToast("create"));
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
      if (next) {
        setCelebrating(true);
        toast.success(getCelebrationToast("activate"));
      } else {
        toast.info("Listing is now quiet (inactive).");
      }
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
      {/* Celebratory Butterfly Flight on Create/Activate */}
      <CelebrationButterfly
        show={celebrating}
        onComplete={() => setCelebrating(false)}
      />

      {/* Atelier Navigation */}
      <nav
        className="nav-glass fixed top-0 right-0 left-0 z-50 border-b border-[#D4A574]/20 backdrop-blur-md pt-[env(safe-area-inset-top)]"
        aria-label="Admin navigation"
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (view === "dashboard") return;
                leaveEditor(handleCancelEditor);
              }}
              disabled={view !== "dashboard" && saving}
              className="flex items-center gap-2 font-accent text-xl font-normal text-[#7A1E4A] touch-manipulation select-none transition-transform duration-150 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60"
            >
              <span>Yasmin&apos;s Space</span>
            </button>
            <span className="hidden items-center gap-1 rounded-full border border-[#D4A574]/30 bg-[#FCF9F5] px-2.5 py-0.5 text-[11px] font-medium text-[#7A1E4A] sm:inline-flex">
              <Sparkles className="size-3 text-amber-500" aria-hidden="true" />
              <span>Personal Atelier</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={withBasePath("/")}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-[#5E534C] transition-colors hover:bg-[#F3EBE3] hover:text-[#7A1E4A] sm:inline-flex"
            >
              <ExternalLink className="size-3" aria-hidden="true" />
              <span>Live Site</span>
            </a>

            <button
              type="button"
              onClick={() => leaveEditor(() => void auth.signOut())}
              disabled={view !== "dashboard" && saving}
              className="inline-flex min-h-9 touch-manipulation items-center rounded-full border border-[#D4A574]/30 bg-white/80 px-3.5 text-xs font-semibold text-[#7A1E4A] shadow-2xs select-none transition-all duration-150 ease-out hover:border-[#D4A574] hover:bg-[#FCF9F5] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60"
              aria-label="Sign out"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-[calc(4.5rem+env(safe-area-inset-top,0px))]">
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

export default YasminPageClient;
