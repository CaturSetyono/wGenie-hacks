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
      { internalType: 'address', name: 'onBehalfOf', type: 'address' },
      { internalType: 'uint16', name: 'referralCode', type: 'uint16' },
    ],
    name: 'supply',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export const createAaveAllocationActionTool = createTool({
  id: 'create-allocation-action',
  description: `Create an Aave V3 supply proposal for the WalletGenie Treasury on Mantle.
Generates calldata for the treasury manager to call WalletGenieTreasury.execute(target, value, data).
Use this to deposit assets like USDC or WETH into Aave V3 to earn yield.`,
  inputSchema: z.object({
    vaultAddress: z.string().describe('WalletGenieTreasury contract address'),
    chainId: z.number().default(MANTLE_SEPOLIA_CHAIN_ID).describe('Chain ID (5003 for Mantle Sepolia)'),
    poolAddress: z.string().default(AAVE_V3_POOL_MANTLE_SEPOLIA).describe('Aave V3 Pool address'),
    asset: z.string().describe('Asset address to supply (e.g. USDC, WETH)'),
    amount: z.string().describe('Amount to supply in smallest unit (wei)'),
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
    callerAddress,
    isReady,
  }) => {
    const resolvedChainId = chainId ?? MANTLE_SEPOLIA_CHAIN_ID;
    const pool = (poolAddress ?? AAVE_V3_POOL_MANTLE_SEPOLIA) as `0x${string}`;
    const amountBigInt = BigInt(amount);

    const data = encodeFunctionData({
      abi: aavePoolAbi,
      functionName: 'supply',
      args: [asset as `0x${string}`, amountBigInt, vaultAddress as `0x${string}`, 0],
    });

    const description = `Aave V3 supply ${amount} of ${asset.slice(0, 10)}...`;

    return buildTreasuryTransactionProposal({
      newAction: {
        success: true,
        protocol: 'aave-v3',
        actionType: 'supply',
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
