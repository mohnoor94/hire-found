"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Job } from "@/lib/jobs/types";

const quietButton =
  "inline-flex min-h-11 flex-1 touch-manipulation items-center justify-center rounded-full border border-primary/25 bg-card px-4 text-sm font-semibold text-muted select-none active:bg-warm-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60";

const dangerButton =
  "inline-flex min-h-11 flex-1 touch-manipulation items-center justify-center rounded-full bg-destructive px-4 text-sm font-semibold text-white select-none active:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destructive disabled:opacity-60";

type DeleteJobDialogProps = {
  job: Job | null;
  open: boolean;
  deleting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function DeleteJobDialog({
  job,
  open,
  deleting,
  onOpenChange,
  onConfirm,
}: DeleteJobDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="rounded-2xl border border-primary/15 bg-card p-6 shadow-card sm:max-w-md"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="font-accent text-2xl leading-snug text-primary">
            Delete &quot;{job?.title || "Untitled"}&quot;?
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-muted">
            This action is permanent and cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="-mx-6 -mb-6 border-primary/15 bg-card p-6 sm:justify-stretch">
          <button
            type="button"
            disabled={deleting}
            onClick={() => onOpenChange(false)}
            className={quietButton}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={deleting}
            onClick={onConfirm}
            className={dangerButton}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
