'use client';

import { usePathname } from 'next/navigation';
import { CfoSidebar } from './cfo-sidebar';
import { CfoHeader } from './cfo-header';
import { titleForPath } from './cfo-nav';

/**
 * Shared CFO app shell — sidebar + header around routed page content.
 * Dark palette is applied explicitly so it renders identically under any
 * NEXT_PUBLIC_APP_CONFIG theme. Each page owns its own padding/scroll inside
 * the content area (dashboards scroll; the agent chat is full-height).
 */
export function CfoShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '/cfo';

  return (
    <div className="flex h-screen overflow-hidden bg-[#0D0D0D] font-sans text-white">
      <CfoSidebar pathname={pathname} />
      <main className="flex flex-1 flex-col overflow-hidden">
        <CfoHeader title={titleForPath(pathname)} />
        <div className="flex-1 overflow-hidden">{children}</div>
      </main>
    </div>
  );
}
