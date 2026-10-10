"use client";

import { Plus, Sparkles } from "lucide-react";
import { AdminReelCard } from "./reel-card";
import { ButterflyMicro } from "@/components/illustrations/butterfly-micro";
import type { Reel } from "@/lib/reels/types";

interface ReelsManagerProps {
  reels: Reel[];
  loading: boolean;
  onNewReel: () => void;
  onEditReel: (reel: Reel) => void;
  onDeleteReel: (reel: Reel) => void;
  onToggleActive: (reel: Reel) => void;
  togglingId: string | null;
}

export function ReelsManager({
  reels,
  loading,
  onNewReel,
  onEditReel,
  onDeleteReel,
  onToggleActive,
  togglingId,
}: ReelsManagerProps) {
  const activeCount = reels.filter((r) => r.isActive).length;

  return (
    <section aria-label="Featured Reels Management" className="mt-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#D4A574]/25 bg-white/70 p-4 shadow-2xs backdrop-blur-xs sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-[#F3EBE3] text-[#7A1E4A]">
            <ButterflyMicro className="size-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-accent text-lg font-bold text-[#7A1E4A]">
                Featured Reel Notes
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-600/20 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-900">
                <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
                {activeCount} staged in studio
              </span>
            </div>
            <p className="text-xs text-[#5E534C]/80">
              Curate and test the video insights before public launch.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onNewReel}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#7A1E4A] px-5 text-xs font-semibold text-white shadow-warm transition-all duration-150 hover:bg-[#5E1639] hover:shadow-glow active:scale-95"
        >
          <Plus className="size-3.5" />
          <span>Add Featured Reel</span>
        </button>
      </div>

      {/* Feature In-Progress Staging Notice */}
      <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-500/25 bg-amber-50/70 p-4 shadow-2xs backdrop-blur-xs">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
          <Sparkles className="size-4" />
        </div>
        <div className="text-xs leading-relaxed text-[#5E534C]">
          <strong className="font-semibold text-amber-950">
            Feature in progress:
          </strong>{" "}
          This space is currently in testing mode. You can add, edit, and
          curate reels here in your studio, but they remain hidden from the
          live public homepage while backend verification is underway.
        </div>
      </div>

      {/* Reel Cards Shelf */}
      {reels.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#D4A574]/35 bg-white/40 p-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-warm/80 text-[#7A1E4A] ring-1 ring-[#D4A574]/30 shadow-xs mb-4">
            <Sparkles className="size-6 text-[#D4A574]" />
          </div>
          <h3 className="font-accent text-xl font-bold text-[#7A1E4A]">
            No Featured Reels Yet
          </h3>
          <p className="mt-2 max-w-md text-xs leading-relaxed text-[#5E534C]">
            Curate Yasmin&apos;s best Instagram moments. Paste a link to showcase
            executive recruitment perspectives on the public homepage.
          </p>
          <button
            type="button"
            onClick={onNewReel}
            className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#7A1E4A] px-6 text-xs font-semibold text-white shadow-xs hover:bg-[#5E1639] active:scale-95"
          >
            <Plus className="size-3.5" />
            <span>Add Your First Reel</span>
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:gap-5">
          {reels.map((reel) => (
            <AdminReelCard
              key={reel.id}
              reel={reel}
              onEdit={onEditReel}
              onDelete={onDeleteReel}
              onToggleActive={onToggleActive}
              isToggling={togglingId === reel.id}
            />
          ))}
        </div>
      )}
    </section>
  );
}
