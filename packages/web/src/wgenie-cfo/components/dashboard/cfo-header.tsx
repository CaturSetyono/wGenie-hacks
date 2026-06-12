import { Plus, RefreshCw, Bell, ChevronDown } from 'lucide-react';
import { TREASURY } from './mock-data';

export function CfoHeader({ title }: { title: string }) {
  return (
    <header className="flex items-center justify-between border-b border-[#262626] bg-[#0D0D0D] p-6">
      <h1 className="text-2xl font-bold text-white">{title}</h1>

      <div className="flex items-center gap-4">
        {/* Network selector */}
        <div className="flex items-center border border-[#262626] bg-[#141414] px-3 py-1.5 text-xs font-medium text-white">
          <span className="mr-2 flex size-4 items-center justify-center rounded-full bg-[#C5FF4A] text-[10px] text-black">
            M
          </span>
          {TREASURY.chainName}
          <ChevronDown className="ml-2 size-3 text-[#8E8E8E]" />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="New proposal"
            className="p-2 text-[#8E8E8E] transition-colors hover:text-white"
          >
            <Plus className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Refresh"
            className="p-2 text-[#8E8E8E] transition-colors hover:text-white"
          >
            <RefreshCw className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Notifications"
            className="relative p-2 text-[#8E8E8E] transition-colors hover:text-white"
          >
            <Bell className="size-5" />
            <span className="absolute right-2.5 top-2 size-1.5 rounded-full bg-red-500" />
          </button>
        </div>

        {/* Profile */}
        <div className="flex size-9 items-center justify-center rounded-full border-2 border-[#C5FF4A]/20 bg-[#141414] text-sm font-bold text-[#C5FF4A]">
          W
        </div>
      </div>
    </header>
  );
}
