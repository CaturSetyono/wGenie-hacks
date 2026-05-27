'use client';

import type { Address } from 'viem';

export function useMantleVaultDetail(chainId: number, vaultAddress: Address) {
  return {
    snapshot: undefined,
    yieldHistory: undefined,
    tvlHistory: undefined,
    sharePriceHistory: undefined,
    performance: undefined,
    isLoading: false,
    isChartsLoading: false,
  };
}
