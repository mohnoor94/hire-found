"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { extractInstagramShortcode } from "@/lib/reels/instagram-url";
import { REEL_CATEGORIES, type Reel, type ReelFormData } from "@/lib/reels/types";
import { ButterflyMicro } from "@/components/illustrations/butterfly-micro";
import { Check, Sparkles } from "lucide-react";

interface ReelEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reel: Reel | null;
  onSave: (data: ReelFormData) => Promise<void>;
  saving: boolean;
}

export function ReelEditorDialog({
  open,
  onOpenChange,
  reel,
  onSave,
  saving,
}: ReelEditorDialogProps) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("Executive Search");
  const [takeaway, setTakeaway] = useState("");
  const [duration, setDuration] = useState("");
  const [order, setOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (reel) {
      setUrl(reel.instagramUrl || (reel.shortcode ? `https://www.instagram.com/reel/${reel.shortcode}/` : ""));
      setTitle(reel.title || "");
      setCategory(reel.category || "Executive Search");
      setTakeaway(reel.takeaway || "");
      setDuration(reel.duration || "");
      setOrder(typeof reel.order === "number" ? reel.order : 1);
      setIsActive(reel.isActive !== false);
    } else {
      setUrl("");
      setTitle("");
      setCategory("Executive Search");
      setTakeaway("");
      setDuration("0:45");
      setOrder(1);
      setIsActive(true);
    }
    setError(null);
  }, [reel, open]);

  const extractedShortcode = extractInstagramShortcode(url);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError("Please provide an Instagram Reel URL.");
      return;
    }
    if (!extractedShortcode) {
      setError("Could not extract a valid Reel ID from the link. Check the format.");
      return;
    }
    if (!title.trim()) {
      setError("Please provide an editorial title for this reel.");
      return;
    }

    try {
      setError(null);
      await onSave({
        instagramUrl: url.trim(),
        title: title.trim(),
        category: category.trim(),
        takeaway: takeaway.trim(),
        duration: duration.trim(),
        order: Number(order) || 1,
        isActive,
      });
      onOpenChange(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save reel";
      setError(msg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl overflow-hidden rounded-3xl border border-[#D4A574]/30 bg-[#FCF9F5] p-6 shadow-2xl sm:p-8"
        showCloseButton={true}
      >
        {/* Soft Ambient Radiance */}
        <div
          className="pointer-events-none absolute -top-20 -right-20 size-60 rounded-full bg-linear-to-br from-[#FDA4AF]/20 via-[#FCD34D]/10 to-transparent blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-20 size-60 rounded-full bg-linear-to-tr from-[#C4B5FD]/20 via-[#D4A574]/15 to-transparent blur-3xl"
          aria-hidden="true"
        />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-[#D4A574]/15 pb-4">
            <div className="flex size-10 items-center justify-center rounded-xl border border-[#D4A574]/30 bg-white/80 text-[#7A1E4A] shadow-xs">
              <ButterflyMicro className="size-5" />
            </div>
            <div>
              <DialogTitle className="font-accent text-2xl font-bold text-[#7A1E4A]">
                {reel ? "Edit Featured Reel" : "Curate a New Reel"}
              </DialogTitle>
              <DialogDescription className="text-xs text-[#5E534C]/80">
                Blend Yasmin&apos;s Instagram insight into HireFound&apos;s editorial voice.
              </DialogDescription>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs font-semibold text-destructive">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4.5">
            {/* Instagram Link Field */}
            <div>
              <label
                htmlFor="reel-url"
                className="block text-xs font-bold uppercase tracking-wider text-[#7A1E4A]"
              >
                Instagram Reel Link
              </label>
              <input
                id="reel-url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.instagram.com/reel/C8f01.../"
                className="mt-1.5 h-11 w-full rounded-xl border border-[#D4A574]/30 bg-white px-3.5 text-sm text-[#2D2926] shadow-2xs placeholder:text-[#5E534C]/50 focus:border-[#7A1E4A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A1E4A]"
                required
              />
              <div className="mt-1.5 flex items-center justify-between text-[11px]">
                <span className="text-[#5E534C]/70">
                  Accepts reel, post, or mobile share URLs.
                </span>
                {extractedShortcode ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                    <Check className="size-3" />
                    ID: {extractedShortcode}
                  </span>
                ) : url ? (
                  <span className="text-amber-700">Checking link format...</span>
                ) : null}
              </div>
            </div>

            {/* Editorial Title */}
            <div>
              <label
                htmlFor="reel-title"
                className="block text-xs font-bold uppercase tracking-wider text-[#7A1E4A]"
              >
                Editorial Headline
              </label>
              <input
                id="reel-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Why 90% of job posts fail to attract senior talent"
                className="mt-1.5 h-11 w-full rounded-xl border border-[#D4A574]/30 bg-white px-3.5 text-sm text-[#2D2926] shadow-2xs placeholder:text-[#5E534C]/50 focus:border-[#7A1E4A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A1E4A]"
                required
              />
            </div>

            {/* Category Select Chips */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7A1E4A]">
                Category
              </label>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {REEL_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                      category === cat
                        ? "bg-[#7A1E4A] text-white shadow-xs"
                        : "border border-[#D4A574]/30 bg-white/80 text-[#5E534C] hover:border-[#7A1E4A]/40"
                    }`}
                  >
                    <Sparkles className="size-2.5" />
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Executive Takeaway Note */}
            <div>
              <label
                htmlFor="reel-takeaway"
                className="block text-xs font-bold uppercase tracking-wider text-[#7A1E4A]"
              >
                Executive Perspective (Key Takeaway)
              </label>
              <textarea
                id="reel-takeaway"
                rows={3}
                value={takeaway}
                onChange={(e) => setTakeaway(e.target.value)}
                placeholder="The short takeaway quote displayed beside the video in the cinema player..."
                className="mt-1.5 w-full rounded-xl border border-[#D4A574]/30 bg-white p-3 text-sm text-[#2D2926] shadow-2xs placeholder:text-[#5E534C]/50 focus:border-[#7A1E4A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A1E4A]"
              />
            </div>

            {/* Duration, Priority Order, Active Switch */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label
                  htmlFor="reel-duration"
                  className="block text-xs font-bold uppercase tracking-wider text-[#7A1E4A]"
                >
                  Duration
                </label>
                <input
                  id="reel-duration"
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="0:45"
                  className="mt-1.5 h-11 w-full rounded-xl border border-[#D4A574]/30 bg-white px-3 text-sm text-[#2D2926] shadow-2xs focus:border-[#7A1E4A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A1E4A]"
                />
              </div>

              <div>
                <label
                  htmlFor="reel-order"
                  className="block text-xs font-bold uppercase tracking-wider text-[#7A1E4A]"
                >
                  Display Order
                </label>
                <input
                  id="reel-order"
                  type="number"
                  min={1}
                  max={99}
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className="mt-1.5 h-11 w-full rounded-xl border border-[#D4A574]/30 bg-white px-3 text-sm text-[#2D2926] shadow-2xs focus:border-[#7A1E4A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A1E4A]"
                />
              </div>

              <div className="flex flex-col justify-end pb-1">
                <div className="flex items-center gap-2">
                  <Switch
                    id="reel-active"
                    checked={isActive}
                    onCheckedChange={setIsActive}
                  />
                  <label
                    htmlFor="reel-active"
                    className="text-xs font-semibold text-[#5E534C] cursor-pointer"
                  >
                    Active on Site
                  </label>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex items-center justify-end gap-3 border-t border-[#D4A574]/15 pt-4">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#D4A574]/30 bg-white px-5 text-xs font-semibold text-[#5E534C] transition-colors hover:bg-[#FCF9F5]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#7A1E4A] px-6 text-xs font-semibold text-white shadow-warm transition-all hover:bg-[#5E1639] active:scale-95 disabled:opacity-60"
              >
                <ButterflyMicro className="size-3.5" />
                <span>{saving ? "Saving..." : reel ? "Update Reel" : "Save to Studio"}</span>
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
