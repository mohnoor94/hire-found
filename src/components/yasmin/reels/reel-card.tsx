"use client";

import { ExternalLink, Pencil, Play, Sparkles, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { getInstagramReelUrl } from "@/lib/reels/instagram-url";
import type { Reel } from "@/lib/reels/types";

interface ReelCardProps {
  reel: Reel;
  onEdit: (reel: Reel) => void;
  onDelete: (reel: Reel) => void;
  onToggleActive: (reel: Reel) => void;
  isToggling: boolean;
}

export function AdminReelCard({
  reel,
  onEdit,
  onDelete,
  onToggleActive,
  isToggling,
}: ReelCardProps) {
  const directUrl = reel.instagramUrl || getInstagramReelUrl(reel.shortcode);

  return (
    <article
      data-reel-id={reel.id}
      className={`group relative flex flex-col justify-between gap-5 rounded-2xl border p-4.5 sm:p-5 transition-all duration-200 ${
        reel.isActive
          ? "border-[#D4A574]/30 bg-white/90 shadow-2xs hover:border-[#D4A574]/60 hover:shadow-xs"
          : "border-border/60 bg-white/50 opacity-75 hover:opacity-95"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
        {/* Left: Mini 9:16 Preview Card */}
        <div className="relative flex aspect-[9/14] w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#D4A574]/25 bg-linear-to-br from-[#7A1E4A]/10 via-[#FDA4AF]/15 to-[#D4A574]/20 shadow-2xs">
          <div className="flex size-9 items-center justify-center rounded-full bg-white text-[#7A1E4A] shadow-xs ring-1 ring-[#D4A574]/40 transition-transform group-hover:scale-105">
            <Play className="size-4 fill-current translate-x-0.2" />
          </div>
          {reel.duration && (
            <span className="absolute bottom-1.5 inset-x-1.5 rounded-md bg-black/60 py-0.5 text-center text-[10px] font-semibold text-white backdrop-blur-xs">
              {reel.duration}
            </span>
          )}
        </div>

        {/* Middle: Editorial Details */}
        <div className="min-w-0 flex-1">
          {/* Header row: category, order, shortcode */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-[#7A1E4A]/20 bg-[#7A1E4A]/5 px-2.5 py-0.5 text-[11px] font-semibold text-[#7A1E4A]">
              <Sparkles className="size-2.5 text-[#D4A574]" />
              {reel.category}
            </span>

            {reel.order ? (
              <span className="rounded-full bg-[#F3EBE3] px-2 py-0.5 text-[10px] font-medium text-[#5E534C]">
                Priority #{reel.order}
              </span>
            ) : null}

            {reel.shortcode ? (
              <span className="font-mono text-[10px] text-muted">
                id: {reel.shortcode}
              </span>
            ) : null}
          </div>

          {/* Title */}
          <h3 className="font-accent mt-2.5 text-lg font-bold leading-snug text-[#7A1E4A]">
            {reel.title}
          </h3>

          {/* Takeaway / Quote */}
          {reel.takeaway && (
            <p className="mt-2 font-serif text-xs italic leading-relaxed text-[#5E534C] line-clamp-2">
              &ldquo;{reel.takeaway}&rdquo;
            </p>
          )}

          {/* Direct link */}
          {directUrl && (
            <div className="mt-3">
              <a
                href={directUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-medium text-[#5E534C]/80 hover:text-[#7A1E4A]"
              >
                <span>View on Instagram</span>
                <ExternalLink className="size-2.5" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Bar: Status Switch & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#D4A574]/15 pt-3.5">
        {/* Active Toggle Switch */}
        <div className="flex items-center gap-2.5">
          <Switch
            checked={reel.isActive}
            onCheckedChange={() => onToggleActive(reel)}
            disabled={isToggling}
            aria-label={`Toggle active state for ${reel.title}`}
          />
          <span className="text-xs font-semibold text-[#5E534C]">
            {reel.isActive ? (
              <span className="text-amber-800">Active (Staged)</span>
            ) : (
              <span className="text-[#5E534C]/60">Hidden</span>
            )}
          </span>
        </div>

        {/* Edit & Delete Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(reel)}
            className="inline-flex size-8.5 items-center justify-center rounded-lg border border-[#D4A574]/20 bg-white text-[#7A1E4A] shadow-2xs transition-colors hover:border-[#D4A574]/60 hover:bg-[#FCF9F5] active:scale-95"
            title="Edit Reel Details"
            aria-label={`Edit ${reel.title}`}
          >
            <Pencil className="size-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(reel)}
            className="inline-flex size-8.5 items-center justify-center rounded-lg border border-red-200/60 bg-white text-destructive shadow-2xs transition-colors hover:bg-red-50 hover:border-red-300 active:scale-95"
            title="Delete Reel"
            aria-label={`Delete ${reel.title}`}
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}
