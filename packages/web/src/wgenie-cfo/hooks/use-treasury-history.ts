import { useQuery } from '@tanstack/react-query';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { Database } from '@wgenie/fusion-supabase-ponder';

export type TreasuryActivity = {
  id: string;
  type: 'deposit' | 'execution' | 'manager-update';
  chainId: number;
  timestamp: number;
  transactionHash: string;
  amount?: string;
  user?: string;
  target?: string;
  value?: string;
  data?: string;
  manager?: string;
};

export function useTreasuryHistory(treasuryAddress: string, chainId: number) {
  const supabase = createSupabaseBrowserClient();

  return useQuery({
    queryKey: ['treasury-history', treasuryAddress, chainId],
    queryFn: async () => {
      // Fetch deposits
      const { data: deposits, error: depositError } = await supabase
        .from('treasury_deposit')
        .select('*')
        .eq('treasury_address', treasuryAddress.toLowerCase())
        .eq('chain_id', chainId)
        .order('timestamp', { ascending: false })
        .limit(20);

      if (depositError) throw depositError;

      // Fetch executions
      const { data: executions, error: executionError } = await supabase
        .from('treasury_execution')
        .select('*')
        .eq('treasury_address', treasuryAddress.toLowerCase())
        .eq('chain_id', chainId)
        .order('timestamp', { ascending: false })
        .limit(20);

      if (executionError) throw executionError;

      // Combine and sort
      const combined: TreasuryActivity[] = [
        ...(deposits || []).map((d) => ({
          id: d.id,
          type: 'deposit' as const,
          chainId: d.chain_id,
          timestamp: d.timestamp,
          transactionHash: d.transaction_hash,
          amount: d.amount,
          user: d.user,
        })),
        ...(executions || []).map((e) => ({
          id: e.id,
          type: 'execution' as const,
          chainId: e.chain_id,
          timestamp: e.timestamp,
          transactionHash: e.transaction_hash,
          target: e.target,
          value: e.value,
          data: e.data,
        })),
      ].sort((a, b) => b.timestamp - a.timestamp);

      return combined;
    },
    enabled: !!treasuryAddress,
  });
}
