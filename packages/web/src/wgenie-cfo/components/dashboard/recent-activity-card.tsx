import {
  ArrowDownLeft,
  ArrowUpRight,
  Repeat,
  Activity,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ACTIVITY, type ActivityKind } from './mock-data';

const KIND_STYLE: Record<
  ActivityKind,
  { icon: LucideIcon; className: string }
> = {
  deposit: {
    icon: ArrowDownLeft,
    className: 'bg-[#C5FF4A]/10 text-[#C5FF4A]',
  },
  supply: { icon: ArrowUpRight, className: 'bg-[#8E8E8E]/10 text-[#8E8E8E]' },
  withdraw: {
    icon: ArrowUpRight,
    className: 'bg-[#8E8E8E]/10 text-[#8E8E8E]',
  },
  swap: { icon: Repeat, className: 'bg-[#4E6FFF]/10 text-[#4E6FFF]' },
};

const FILTERS = ['All', 'Deposit', 'Withdraw'] as const;

export function RecentActivityCard() {
  return (
    <div className="flex flex-col border border-[#262626] bg-[#141414] p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Recent activity</h3>
        <div className="flex gap-3 text-[10px] font-bold uppercase tracking-wider">
          {FILTERS.map((f, i) => (
            <button
              key={f}
              type="button"
              className={cn(
                'transition-colors',
                i === 0 ? 'text-white' : 'text-[#8E8E8E] hover:text-white',
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-6">
        {ACTIVITY.map((group) => (
          <div key={group.date} className="space-y-3">
            <p className="px-1 text-[11px] text-[#8E8E8E]">{group.date}</p>
            {group.items.map((item, idx) => {
              const { icon: Icon, className } = KIND_STYLE[item.kind];
              return (
                <div
                  key={idx}
                  className="flex items-center gap-4 border border-[#262626] bg-[#0D0D0D]/50 p-3"
                >
                  <div
                    className={cn(
                      'flex size-10 items-center justify-center rounded-full',
                      className,
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-0.5 flex items-center justify-between">
                      <p className="text-sm font-bold tabular-nums text-white">
                        {item.title}
                      </p>
                      <span className="text-[10px] tabular-nums text-[#8E8E8E]">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#8E8E8E]">{item.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <button
        type="button"
        className="mt-6 flex w-full items-center justify-between border border-[#262626] bg-[#0D0D0D] px-6 py-3 text-xs font-bold text-white transition-colors hover:bg-[#262626]"
      >
        <span className="flex items-center gap-3">
          <Activity className="size-5 text-[#8E8E8E]" />
          See all activity
        </span>
        <ChevronRight className="size-4 text-[#8E8E8E]" />
      </button>
    </div>
  );
}
