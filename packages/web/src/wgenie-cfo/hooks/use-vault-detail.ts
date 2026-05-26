'use client';

import { useQuery } from '@tanstack/react-query';
import { createMantleClient } from '@walletgenie-protocol/core';
import {
  useVaultHistory,
  useSharePriceHistory,
  useVaultPerformance,
} from '@walletgenie-protocol/react';
import type { Address } from 'viem';

/**
 * Fetches detailed Mantle vault data.
 * Snapshot uses createMantleClient directly (no useVaultSnapshot hook in @walletgenie-protocol/react).
 * History and performance use SDK React hooks. Requires YieldProvider ancestor.
 */
export function useMantleVaultDetail(chainId: number, vaultAddress: Address) {
  // Snapshot — no SDK hook available, use direct client
  const client = createMantleClient({
    chainId: chainId as 1 | 8453 | 42161,
  });

  const snapshot = useQuery({
    queryKey: ['wgenie-vault-snapshot', vaultAddress, chainId],
    queryFn: () => client.getVaultSnapshot(vaultAddress),
    staleTime: 60_000,
    refetchInterval: 120_000,
  });

  // History + performance — SDK React hooks
  const { yieldHistory, tvlHistory, isLoading: isHistoryLoading } =
    useVaultHistory(vaultAddress);

  const { history: sharePriceHistory, isLoading: isSharePriceLoading } =
    useSharePriceHistory(vaultAddress);

  const { performance } = useVaultPerformance(vaultAddress);

  return {
    snapshot: snapshot.data,
    yieldHistory,
    tvlHistory,
    sharePriceHistory,
    performance,
    isLoading: snapshot.isLoading,
    isChartsLoading: isHistoryLoading || isSharePriceLoading,
  };
}
