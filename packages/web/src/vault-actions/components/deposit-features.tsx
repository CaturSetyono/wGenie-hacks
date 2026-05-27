'use client';

import { MantleVaultActionTabs } from './vault-action-tabs';
import type { ChainId } from '@/app/chains.config';
import type { Address } from 'viem';

interface Props {
  chainId: ChainId;
  vaultAddress: Address;
}

export function DepositFeatures({ chainId, vaultAddress }: Props) {
  return (
    <MantleVaultActionTabs
      chainId={chainId}
      vaultAddress={vaultAddress}
    />
  );
}
