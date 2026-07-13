"use client";

import { useState } from "react";
import { scoreTier } from "@/lib/scoring";

export function LeaderboardRow({
  entry,
  creatorName,
  rank,
}: {
  entry: {
    id: string;
    takerName: string;
    scorePercent: string;
  };
  creatorName: string;
  rank: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const score = parseFloat(entry.scorePercent);
  const tier = scoreTier(score);

  return (
    <div className="border border-border bg-surface-raised rounded-lg overflow-hidden transition-all duration-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 hover:bg-white/[0.02] text-left transition-colors cursor-pointer focus:outline-none"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-mono text-[12px] text-accent-soft w-5 shrink-0">
            {rank}
          </span>
          <span className="text-[13.5px] text-text font-medium truncate">
            {entry.takerName}
          </span>
          <svg
            className={`w-3.5 h-3.5 text-text-muted transition-transform duration-200 ${
              isOpen ? "rotate-90" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
        <span className="font-mono text-[13px] font-semibold text-text shrink-0 ml-3">
          {Math.round(score)}%
        </span>
      </button>

      {isOpen && (
        <div className="px-4 pb-5 pt-2 border-t border-border/50 bg-[#16121f]/50 flex justify-center">
          <div
            className="relative w-full max-w-[260px] overflow-hidden rounded-2xl p-3.5 shadow-lg"
            style={{
              aspectRatio: "9 / 16",
              background:
                "radial-gradient(120% 70% at 15% 5%, rgba(124,58,237,0.55) 0%, transparent 50%), radial-gradient(120% 70% at 95% 100%, rgba(76,29,149,0.6) 0%, transparent 50%), linear-gradient(160deg, #1a1033 0%, #2d1b69 48%, #0d0a1f 100%)",
            }}
          >
            <div
              className="absolute left-[-20%] top-[34%] h-[1.5px] w-[140%] -rotate-6"
              style={{
                background: "linear-gradient(90deg, transparent, #a78bfa, transparent)",
                boxShadow: "0 0 8px 1px rgba(167,139,250,0.8)",
              }}
            />

            <div className="relative z-10 flex h-full w-full flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 py-6 text-center">
              <div className="mb-4 text-[9px] font-bold uppercase tracking-[0.16em] text-accent-soft">
                WhoKnowsMe
              </div>

              <div
                className="mb-2 text-[64px] font-extrabold leading-none text-white"
                style={{ textShadow: "0 0 20px rgba(124,58,237,0.7)" }}
              >
                {Math.round(score)}%
              </div>

              <p className="mb-5 text-[12px] text-white/80 leading-snug">
                {entry.takerName} on {creatorName}&apos;s quiz
              </p>

              <div className="inline-block rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 text-[11px] font-medium text-white max-w-full truncate">
                {tier}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
