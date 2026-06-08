import { z } from 'zod';
import { type Address } from 'viem';
import { getPublicClient } from '../plasma-vault/utils/viem-clients';
import { treasuryTransactionProposalOutputSchema } from './types';

type TreasuryExecution = {
  target: string;
  value: string;
  data: string;
  protocol: string;
};

interface PendingAction {
  id: string;
  protocol: string;
  actionType: string;
  description: string;
  target: string;
  value: string;
  data: string;
}

interface BuildTreasuryProposalParams {
  newAction: {
    success: boolean;
    protocol: string;
    actionType: string;
    description: string;
    target: string;
    value: string;
    data: string;
    error?: string;
  };
  existingPendingActions?: PendingAction[];
  vaultAddress: string;
  chainId: number;
  callerAddress?: string;
  isReady: boolean;
  execution: TreasuryExecution;
}

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

/**
 * Build a treasury transaction proposal for direct `WalletGenieTreasury.execute(...)` calls.
 */
export async function buildTreasuryTransactionProposal({
  newAction,
  existingPendingActions = [],
  vaultAddress,
  chainId,
  callerAddress,
  isReady,
  execution,
}: BuildTreasuryProposalParams): Promise<z.infer<typeof treasuryTransactionProposalOutputSchema>> {
  const allActions: PendingAction[] = newAction.success
    ? [
        ...existingPendingActions,
        {
          id: String(existingPendingActions.length + 1),
          protocol: newAction.protocol,
          actionType: newAction.actionType,
          description: newAction.description,
          target: newAction.target,
          value: newAction.value,
          data: newAction.data,
        },
      ]
    : existingPendingActions;

  const actionsSummary = allActions
    .map((action) => `${action.actionType} on ${action.protocol}: ${action.description}`)
    .join('\n');

  const proposalBase = {
    type: 'treasury-transaction-proposal' as const,
    status: isReady ? ('ready' as const) : ('partial' as const),
    actions: allActions,
    newAction: {
      success: newAction.success,
      protocol: newAction.protocol,
      actionType: newAction.actionType,
      description: newAction.description,
      error: newAction.error,
    },
    vaultAddress,
    chainId,
    execution: {
      kind: 'treasury-execution' as const,
      target: execution.target,
      value: execution.value,
      data: execution.data,
      protocol: execution.protocol,
    },
    actionsCount: allActions.length,
    actionsSummary,
  };

  if (!newAction.success) {
    return {
      ...proposalBase,
      simulation: undefined,
    };
  }

  let simulation:
    | {
        success: boolean;
        message: string;
        error?: string;
      }
    | undefined;

  if (callerAddress) {
    try {
      const publicClient = getPublicClient(chainId);
      await publicClient.simulateContract({
        account: callerAddress as Address,
        address: vaultAddress as Address,
        abi: treasuryExecuteAbi,
        functionName: 'execute',
        args: [execution.target as Address, BigInt(execution.value), execution.data as `0x${string}`],
        value: BigInt(execution.value),
      });
      simulation = {
        success: true,
        message: 'Treasury execute simulation succeeded.',
      };
    } catch (error) {
      simulation = {
        success: false,
        message: 'Treasury execute simulation failed.',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  return {
    ...proposalBase,
    simulation,
  };
}

export const treasuryExecuteFunctionAbi = treasuryExecuteAbi;
