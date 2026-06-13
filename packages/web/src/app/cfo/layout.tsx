import { CfoShell } from '@/wgenie-cfo/components/dashboard/cfo-shell';
import { AppProviders } from '@/app/app-providers';

export const metadata = {
  title: 'WalletGenie · CFO',
};

export default function CfoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProviders>
      <CfoShell>{children}</CfoShell>
    </AppProviders>
  );
}

