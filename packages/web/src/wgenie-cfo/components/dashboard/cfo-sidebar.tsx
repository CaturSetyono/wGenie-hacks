import Link from 'next/link';
import { Settings, Search, PanelLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CFO_NAV, isNavActive } from './cfo-nav';

export function CfoSidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-[#262626] bg-[#0D0D0D] p-6 lg:flex">
      {/* Brand */}
      <div className="mb-8 flex items-center justify-between">
        <Link href="/cfo" className="flex items-center gap-2">
          <div className="size-6 rounded-full bg-[#C5FF4A]" />
          <span className="text-xl font-bold tracking-tight text-white">
            WalletGenie
          </span>
        </Link>
        <button
          type="button"
          aria-label="Collapse sidebar"
          className="text-[#8E8E8E] transition-colors hover:text-white"
        >
          <PanelLeft className="size-5" />
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8E8E8E]" />
        <input
          type="text"
          placeholder="Search"
          className="w-full border-none bg-[#141414] py-2 pl-10 pr-4 text-sm text-white placeholder-[#8E8E8E] focus:outline-none focus:ring-1 focus:ring-[#C5FF4A]"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-[#262626] bg-[#0D0D0D] px-1 text-xs text-[#8E8E8E]">
          /
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {CFO_NAV.map(({ label, href, icon: Icon }) => {
          const active = isNavActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 text-sm transition-colors',
                active
                  ? 'bg-[#141414] font-medium text-white'
                  : 'text-[#8E8E8E] hover:text-white',
              )}
            >
              <Icon className="size-5" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="mt-auto pt-6">
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 text-sm text-[#8E8E8E] transition-colors hover:text-white"
        >
          <Settings className="size-5" />
          Settings
        </a>
      </div>
    </aside>
  );
}
