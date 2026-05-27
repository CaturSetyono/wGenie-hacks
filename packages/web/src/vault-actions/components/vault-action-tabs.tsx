'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { YoDepositForm } from './deposit-form';
import { YoWithdrawForm } from './withdraw-form';
import type { ChainId } from '@/app/chains.config';
import type { Address } from 'viem';

interface Props {
  chainId: ChainId;
  vaultAddress: Address;
}

type Tab = 'deposit' | 'withdraw';

export function MantleVaultActionTabs({ chainId, vaultAddress }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('deposit');

  return (
    <Card className="p-4 space-y-4">
      {/* Tab bar */}
      <div className="flex border-b">
        {(['deposit', 'withdraw'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex-1 pb-2 text-sm font-medium capitalize transition-colors',
              activeTab === tab
                ? 'border-b-2 border-primary text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Form */}
      {activeTab === 'deposit' ? (
        <YoDepositForm chainId={chainId} vaultAddress={vaultAddress} />
      ) : (
        <YoWithdrawForm chainId={chainId} vaultAddress={vaultAddress} />
      )}
    </Card>
  );
}
