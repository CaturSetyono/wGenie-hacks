import { ArrowUpRight, TrendingUp } from 'lucide-react';
import { OVERVIEW } from './mock-data';

/** Lime hero card — total treasury value, 24h P&L, blended APY. */
export function OverviewCard() {
  return (
    <div className="flex flex-col justify-between bg-[linear-gradient(135deg,#C5FF4A_0%,#A3E635_100%)] p-6 text-black">
      <div className="flex items-start justify-between">
        <span className="text-sm font-semibold opacity-70">
          Total Treasury Value
        </span>
        <span className="flex size-8 items-center justify-center rounded-full bg-black/10">
          <ArrowUpRight className="size-4" />
        </span>
      </div>

      <div className="mt-8">
        <p className="text-4xl font-bold tracking-tight tabular-nums">
          {OVERVIEW.totalValueLabel}
        </p>
        <div className="mt-2 flex items-center gap-2 text-sm font-semibold">
          <TrendingUp className="size-4" />
          <span className="tabular-nums">+{OVERVIEW.change24hPct}%</span>
          <span className="opacity-60 tabular-nums">
            {OVERVIEW.change24hUsd} · 24h
          </span>
        </div>
      </div>

      <div className="mt-8 flex items-end justify-between border-t border-black/10 pt-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider opacity-60">
            Blended APY
          </p>
          <p className="text-2xl font-bold tabular-nums">
            {OVERVIEW.blendedApyPct}%
          </p>
        </div>
        <button
          type="button"
          className="bg-black px-4 py-2 text-xs font-bold text-[#C5FF4A] transition-opacity hover:opacity-90"
        >
          Ask the Agent
        </button>
      </div>
    </div>
  );
}
