'use client';

import { type Address } from 'viem';
import { Card } from '@/components/ui/card';

interface Props {
  chainId: number;
  vaultAddress: Address;
}

export function YoDepositForm({ chainId, vaultAddress }: Props) {
  return (
    <Card className="p-4">
      <p className="text-sm text-muted-foreground text-center">
        Deposit coming soon for this vault
      </p>
    </Card>
  );
}
