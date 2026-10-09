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
        className="max-w-sm rounded-2xl border-gray-100 bg-white p-6 shadow-xl"
        showCloseButton={false}
      >
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <svg
              className="h-6 w-6 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
          <DialogTitle className="font-accent text-lg font-bold text-text-main">
            Delete &quot;{job?.title || "Untitled"}&quot;?
          </DialogTitle>
          <DialogDescription className="text-sm text-[#6B6560]">
            This action is permanent and cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-2 flex flex-row gap-3 sm:justify-stretch">
          <button
            type="button"
            disabled={deleting}
            onClick={() => onOpenChange(false)}
            className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-text-main transition-all duration-200 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={deleting}
            onClick={onConfirm}
            className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-red-700 disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
