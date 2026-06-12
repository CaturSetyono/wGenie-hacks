import { MoreVertical, ArrowUpRight } from 'lucide-react';
import { HOLDINGS, ALLOCATIONS } from './mock-data';

export function HoldingsCard() {
  return (
    <div className="flex flex-col border border-[#262626] bg-[#141414] p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Treasury holdings</h3>
        <button
          type="button"
          className="flex items-center gap-1 rounded-full border border-[#262626] px-3 py-1 text-xs text-[#8E8E8E] transition-colors hover:text-white"
        >
          Go to Treasury
          <ArrowUpRight className="size-3" />
        </button>
      </div>

      {/* Token cards */}
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        {HOLDINGS.map((h) => (
          <div
            key={h.symbol}
            className="flex items-center gap-4 border border-[#262626] p-3"
          >
            <div
              className="flex size-10 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: h.color }}
            >
              {h.symbol.slice(0, 3)}
            </div>
            <div className="min-w-0">
              <p className="truncate font-bold text-white">
                {h.name}
                <span className="ml-1 text-sm text-[#8E8E8E]">{h.symbol}</span>
              </p>
            </div>
            <button
              type="button"
              aria-label="More"
              className="ml-auto text-[#8E8E8E] transition-colors hover:text-white"
            >
              <MoreVertical className="size-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Distribution */}
      <div className="space-y-4">
        <span className="text-xs text-[#8E8E8E]">Allocation by protocol</span>
        <div className="flex h-1.5 w-full overflow-hidden rounded-full">
          {ALLOCATIONS.map((a) => (
            <div
              key={a.label}
              className="h-full"
              style={{ width: `${a.weightPct}%`, backgroundColor: a.color }}
            />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4 pt-2">
          {ALLOCATIONS.map((a) => (
            <div key={a.label} className="flex flex-col">
              <div className="mb-1 flex items-center gap-2">
                <div
                  className="size-2 rounded-sm"
                  style={{ backgroundColor: a.color }}
                />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8E8E]">
                  {a.label}
                </span>
                <span className="ml-auto text-[10px] tabular-nums text-[#8E8E8E]">
                  {a.weightPct}%
                </span>
              </div>
              <span className="text-sm font-bold tabular-nums text-white">
                {a.valueLabel}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
