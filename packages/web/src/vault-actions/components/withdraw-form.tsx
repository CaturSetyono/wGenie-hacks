'use client';

import { type Address } from 'viem';
import { Card } from '@/components/ui/card';

interface Props {
  chainId: number;
  vaultAddress: Address;
}

export function YoWithdrawForm({ chainId, vaultAddress }: Props) {
  return (
    <Card className="p-4">
      <p className="text-sm text-muted-foreground text-center">
        Withdraw coming soon for this vault
      </p>
    </Card>
  );
}
