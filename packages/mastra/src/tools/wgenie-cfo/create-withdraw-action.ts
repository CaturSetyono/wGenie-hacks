import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { encodeFunctionData } from 'viem';
import { buildTreasuryTransactionProposal } from './build-treasury-transaction-proposal';
import { existingActionSchema, treasuryTransactionProposalOutputSchema } from './types';

const MANTLE_SEPOLIA_CHAIN_ID = 5003;
const AAVE_V3_POOL_MANTLE_SEPOLIA = '0xCF69666666666666666666666666666666666666';

const aavePoolAbi = [
  {
    inputs: [
      { internalType: 'address', name: 'asset', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'address', name: 'to', type: 'address' },
    ],
    name: 'withdraw',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export const createAaveWithdrawActionTool = createTool({
  id: 'create-withdraw-action',
  description: `Create an Aave V3 withdraw proposal for the WalletGenie Treasury on Mantle.
Generates calldata for the treasury manager to call WalletGenieTreasury.execute(target, value, data).
Use this to withdraw assets from Aave V3 back to the treasury.`,
  inputSchema: z.object({
    vaultAddress: z.string().describe('WalletGenieTreasury contract address'),
    chainId: z.number().default(MANTLE_SEPOLIA_CHAIN_ID).describe('Chain ID (5003 for Mantle Sepolia)'),
    poolAddress: z.string().default(AAVE_V3_POOL_MANTLE_SEPOLIA).describe('Aave V3 Pool address'),
    asset: z.string().describe('Asset address to withdraw (e.g. USDC, WETH)'),
    amount: z.string().describe('Amount to withdraw in smallest unit (wei)'),
    recipient: z.string().optional().describe('Recipient address (defaults to vaultAddress)'),
    callerAddress: z.string().optional().describe('Optional caller wallet for simulation'),
    existingPendingActions: z.array(existingActionSchema).optional(),
    isReady: z.boolean().describe('true if this is the last action (show execute button), false if more actions follow'),
  }),
  outputSchema: treasuryTransactionProposalOutputSchema,
  execute: async ({
    vaultAddress,
    chainId,
    poolAddress,
    asset,
    amount,
    recipient,
    callerAddress,
    isReady,
  }) => {
    const resolvedChainId = chainId ?? MANTLE_SEPOLIA_CHAIN_ID;
    const pool = (poolAddress ?? AAVE_V3_POOL_MANTLE_SEPOLIA) as `0x${string}`;
    const amountBigInt = BigInt(amount);
    const targetRecipient = (recipient ?? vaultAddress) as `0x${string}`;

    const data = encodeFunctionData({
      abi: aavePoolAbi,
      functionName: 'withdraw',
      args: [asset as `0x${string}`, amountBigInt, targetRecipient],
    });

    const description = `Aave V3 withdraw ${amount} of ${asset.slice(0, 10)}...`;

    return buildTreasuryTransactionProposal({
      newAction: {
        success: true,
        protocol: 'aave-v3',
        actionType: 'withdraw',
        description,
        target: pool,
        value: '0',
        data,
      },
      existingPendingActions: [],
      vaultAddress,
      chainId: resolvedChainId,
      callerAddress,
      isReady: isReady ?? true,
      execution: {
        target: pool,
        value: '0',
        data,
        protocol: 'aave-v3',
      },
    });
  },
});
