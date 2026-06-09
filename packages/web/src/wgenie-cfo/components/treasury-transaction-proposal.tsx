'use client';

import { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  Copy,
  Loader2,
  Wallet,
  WalletCards,
  Zap,
} from 'lucide-react';
import {
  useAccount,
  useConnect,
  usePublicClient,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import type { Address, Hex } from 'viem';
import { mantle, mantleSepoliaTestnet } from 'viem/chains';
import { TxHashLink } from '@/activity/components/tx-hash-link';
import { cn } from '@/lib/utils';
import type { TreasuryTransactionProposalOutput } from '@/lib/types/wgenie-cfo';

const CHAIN_NAMES: Record<number, string> = {
  [mantle.id]: 'Mantle',
  [mantleSepoliaTestnet.id]: 'Mantle Sepolia',
};

const treasuryExecuteAbi = [
  {
    type: 'function' as const,
    name: 'execute' as const,
    inputs: [
      { name: 'target' as const, type: 'address' as const },
      { name: 'value' as const, type: 'uint256' as const },
      { name: 'data' as const, type: 'bytes' as const },
    ],
    outputs: [{ name: '' as const, type: 'bytes' as const }],
    stateMutability: 'payable' as const,
  },
] as const;

function formatValue(value: string, target?: string) {
  try {
    const wei = BigInt(value);
    const isUsdc = target?.toLowerCase() === '0x0a268a0000000000000000000000000000000000';
    const decimals = isUsdc ? 6 : 18;
    const symbol = isUsdc ? 'USDC' : 'MNT';
    return `${(Number(wei) / Math.pow(10, decimals)).toFixed(4)} ${symbol}`;
  } catch {
    return value;
  }
}

function ActionRow({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3 space-y-1">
      <p className="text-[11px] uppercase tracking-wider text-wgenie-muted">{title}</p>
      <p className="text-sm font-medium break-all">{value}</p>
    </div>
  );
}

function ExecuteSection({
  vaultAddress,
  chainId,
  target,
  value,
  data,
}: {
  vaultAddress: string;
  chainId: number;
  target: string;
  value: string;
  data: string;
}) {
  const { isConnected, address, chain: walletChain } = useAccount();
  const { connect, connectors, isPending: isConnecting, error: connectError } = useConnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const publicClient = usePublicClient({ chainId });

  const isWrongChain = isConnected && walletChain?.id !== chainId;
  const isCorrectChain = isConnected && walletChain?.id === chainId;
  const targetChainName = CHAIN_NAMES[chainId] ?? `Chain ${chainId}`;
  const [simulationState, setSimulationState] = useState<'idle' | 'simulating' | 'success' | 'error'>('idle');
  const [simulationError, setSimulationError] = useState<string>();

  const {
    writeContract,
    data: txHash,
    isPending: isWriting,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  const handleConnect = useCallback(() => {
    const connector = connectors[0];
    if (connector) {
      connect({ connector });
    }
  }, [connect, connectors]);

  const handleExecute = useCallback(() => {
    writeContract({
      address: vaultAddress as Address,
      abi: treasuryExecuteAbi,
      functionName: 'execute',
      args: [target as Address, BigInt(value), data as Hex],
      value: BigInt(value),
      chainId,
    });
  }, [chainId, data, target, value, vaultAddress, writeContract]);

  const handleSimulate = useCallback(async () => {
    if (!publicClient || !address) return;
    setSimulationState('simulating');
    setSimulationError(undefined);
    try {
      await publicClient.simulateContract({
        account: address,
        address: vaultAddress as Address,
        abi: treasuryExecuteAbi,
        functionName: 'execute',
        args: [target as Address, BigInt(value), data as Hex],
        value: BigInt(value),
      });
      setSimulationState('success');
    } catch (error) {
      setSimulationState('error');
      setSimulationError(error instanceof Error ? error.message : String(error));
    }
  }, [address, data, publicClient, target, value, vaultAddress]);

  return (
    <div className="space-y-3 border-t border-white/10 pt-4">
      <div className="grid gap-2 md:grid-cols-2">
        <ActionRow title="Target" value={target} />
        <ActionRow title="Value" value={formatValue(value, target)} />
      </div>

      <div className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-2">
        <p className="text-[11px] uppercase tracking-wider text-wgenie-muted">Calldata</p>
        <pre className="overflow-auto text-xs break-all whitespace-pre-wrap">{data}</pre>
      </div>

      {!isConnected && (
        <>
          <Button
            onClick={handleConnect}
            disabled={isConnecting}
            variant="outline"
            size="sm"
            className="w-full"
          >
            {isConnecting ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Wallet className="w-4 h-4 mr-2" />
            )}
            Connect Wallet
          </Button>
          {connectError && (
            <p className="text-xs text-destructive">
              {connectError.message.slice(0, 160)}
            </p>
          )}
        </>
      )}

      {isConnected && (
        <>
          <div className="flex items-center gap-2 text-xs text-wgenie-muted">
            <WalletCards className="w-4 h-4" />
            <span>{address?.slice(0, 6)}...{address?.slice(-4)} on {walletChain?.name ?? 'Unknown chain'}</span>
          </div>

          {isWrongChain && (
            <Button
              onClick={() => switchChain({ chainId })}
              disabled={isSwitching}
              variant="outline"
              size="sm"
              className="w-full"
            >
              {isSwitching ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Wallet className="w-4 h-4 mr-2" />
              )}
              Switch to {targetChainName}
            </Button>
          )}

          {isCorrectChain && (
            <>
              <Button
                onClick={handleSimulate}
                variant="outline"
                size="sm"
                className="w-full"
              >
                {simulationState === 'simulating' ? 'Simulating...' : 'Simulate Treasury Execute'}
              </Button>
              {simulationState === 'success' && (
                <p className="text-xs text-green-500">Simulation succeeded.</p>
              )}
              {simulationState === 'error' && simulationError && (
                <p className="text-xs text-destructive">{simulationError.slice(0, 200)}</p>
              )}

              {!txHash && (
                <Button
                  onClick={handleExecute}
                  disabled={isWriting}
                  size="sm"
                  className="w-full"
                >
                  {isWriting ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Zap className="w-4 h-4 mr-2" />
                  )}
                  Execute Treasury Call
                </Button>
              )}
            </>
          )}
        </>
      )}

      {writeError && (
        <div className="space-y-1">
          <p className="text-xs text-destructive">
            Transaction failed: {writeError.message.slice(0, 200)}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => resetWrite()}
          >
            Try again
          </Button>
        </div>
      )}

      {isConfirming && (
        <p className="text-xs text-wgenie-muted">Waiting for on-chain confirmation...</p>
      )}

      {isConfirmed && txHash && (
        <div className="pt-2 border-t border-white/10">
          <div className="flex items-center gap-2 text-green-500">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm font-medium">Transaction confirmed</span>
          </div>
          <div className="mt-1">
            <TxHashLink txHash={txHash} chainId={chainId} />
          </div>
        </div>
      )}
    </div>
  );
}

export function TreasuryTransactionProposal({
  status,
  actions,
  newAction,
  simulation,
  vaultAddress,
  chainId,
  execution,
  actionsCount,
}: TreasuryTransactionProposalOutput) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      JSON.stringify({ target: execution.target, value: execution.value, data: execution.data }, null, 2),
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Zap className="w-5 h-5 text-primary" />
        <p className="text-sm font-medium">
          Treasury Proposal - {actionsCount} action{actionsCount === 1 ? '' : 's'}
        </p>
      </div>

      {actions.map((action) => (
        <div key={action.id} className="rounded-lg border border-white/10 p-3 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm font-medium">{action.description}</p>
              <p className="text-xs text-wgenie-muted">
                {action.protocol} &middot; {action.actionType}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleCopy} className="shrink-0">
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      ))}

      {!newAction.success && newAction.error && (
        <p className="text-sm text-destructive">{newAction.error}</p>
      )}

      {simulation && (
        <div className={cn('rounded-lg border p-3 text-sm', simulation.success ? 'border-green-500/30 bg-green-500/5' : 'border-destructive/30 bg-destructive/5')}>
          {simulation.success ? simulation.message : `Simulation failed: ${simulation.error ?? simulation.message}`}
        </div>
      )}

      {status === 'partial' && newAction.success && (
        <p className="text-sm text-wgenie-muted">Preparing the treasury call...</p>
      )}

      {status === 'ready' && (
        <ExecuteSection
          vaultAddress={vaultAddress}
          chainId={chainId}
          target={execution.target}
          value={execution.value}
          data={execution.data}
        />
      )}
    </Card>
  );
}
