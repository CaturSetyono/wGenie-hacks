import { Coins, Calendar, ChevronDown, Clock } from 'lucide-react';
import { CHART_PATH, CHART_TOOLTIP } from './mock-data';

const Y_LABELS = ['60k', '45k', '30k', '15k', '0'];
const X_LABELS = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];

export function TreasuryChart() {
  return (
    <div className="flex flex-col border border-[#262626] bg-[#141414] p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Treasury value</h3>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex items-center gap-2 border border-[#262626] bg-[#0D0D0D] px-3 py-1.5 text-xs text-white"
          >
            <Coins className="size-4 text-[#8E8E8E]" />
            All assets
            <ChevronDown className="size-3 text-[#8E8E8E]" />
          </button>
          <button
            type="button"
            className="flex items-center gap-2 border border-[#262626] bg-[#0D0D0D] px-3 py-1.5 text-xs text-white"
          >
            <Calendar className="size-4 text-[#8E8E8E]" />
            Jun 12
            <ChevronDown className="size-3 text-[#8E8E8E]" />
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="relative mt-4 min-h-[300px] flex-1">
        {/* Y-axis */}
        <div className="absolute left-0 top-0 flex h-full flex-col justify-between py-2 text-[10px] tabular-nums text-[#8E8E8E]">
          {Y_LABELS.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>

        {/* Grid */}
        <div className="ml-10 flex h-full flex-col justify-between border-b border-[#262626] py-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-0 w-full border-t border-dashed border-[#262626]/50"
            />
          ))}
        </div>

        {/* Line */}
        <div className="pointer-events-none absolute inset-0 ml-10 overflow-hidden">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 800 300"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="cfoChartFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#C5FF4A" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#C5FF4A" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={`${CHART_PATH} L800,300 L0,300 Z`}
              fill="url(#cfoChartFill)"
            />
            <path
              d={CHART_PATH}
              fill="none"
              stroke="#C5FF4A"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Highlight + tooltip */}
        <div className="absolute inset-y-0 left-[60%] flex w-[12%] items-center justify-center border-x border-white/10 bg-white/5">
          <div className="relative z-10 -translate-y-12 translate-x-12 border border-[#262626] bg-black/80 p-3 shadow-2xl backdrop-blur-md">
            <div className="mb-1 flex items-center gap-1 text-[10px] text-[#8E8E8E]">
              <Clock className="size-3" />
              {CHART_TOOLTIP.range}
            </div>
            <div className="text-sm font-bold tabular-nums text-white">
              {CHART_TOOLTIP.valueLabel}
            </div>
            <div className="mt-1 flex items-center gap-1 text-[10px] text-[#C5FF4A]">
              <span className="size-1.5 rounded-full bg-[#C5FF4A]" />
              {CHART_TOOLTIP.changeLabel}
            </div>
          </div>
        </div>

        {/* X-axis */}
        <div className="absolute -bottom-6 left-10 right-0 flex justify-between text-[10px] tabular-nums text-[#8E8E8E]">
          {X_LABELS.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
