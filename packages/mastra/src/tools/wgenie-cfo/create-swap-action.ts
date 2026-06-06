import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { encodeFunctionData, zeroAddress } from 'viem';
import { getPublicClient } from '../plasma-vault/utils/viem-clients';
import { buildTreasuryTransactionProposal } from './build-treasury-transaction-proposal';
import { existingActionSchema, treasuryTransactionProposalOutputSchema } from './types';

const MANTLE_MAINNET_CHAIN_ID = 5000;
const DEFAULT_MERCHANT_MOE_LB_ROUTER = '0x013e138EF6008ae5FDFDE29700e3f2Bc61d21E3a';

const lbRouterAbi = [
  {
    type: 'function' as const,
    name: 'getWNATIVE' as const,
    inputs: [],
    outputs: [{ name: '' as const, type: 'address' as const }],
    stateMutability: 'view' as const,
  },
  {
    type: 'function' as const,
    name: 'swapExactTokensForTokens' as const,
    inputs: [
      { name: 'amountIn' as const, type: 'uint256' as const },
      { name: 'amountOutMin' as const, type: 'uint256' as const },
      {
        name: 'path' as const,
        type: 'tuple' as const,
        components: [
          { name: 'pairBinSteps' as const, type: 'uint256[]' as const },
          { name: 'versions' as const, type: 'uint8[]' as const },
          { name: 'tokenPath' as const, type: 'address[]' as const },
        ],
      },
      { name: 'to' as const, type: 'address' as const },
      { name: 'deadline' as const, type: 'uint256' as const },
    ],
    outputs: [{ name: 'amountOut' as const, type: 'uint256' as const }],
    stateMutability: 'nonpayable' as const,
  },
  {
    type: 'function' as const,
    name: 'swapExactNATIVEForTokens' as const,
    inputs: [
      { name: 'amountOutMin' as const, type: 'uint256' as const },
      {
        name: 'path' as const,
        type: 'tuple' as const,
        components: [
          { name: 'pairBinSteps' as const, type: 'uint256[]' as const },
          { name: 'versions' as const, type: 'uint8[]' as const },
          { name: 'tokenPath' as const, type: 'address[]' as const },
        ],
      },
      { name: 'to' as const, type: 'address' as const },
      { name: 'deadline' as const, type: 'uint256' as const },
    ],
    outputs: [{ name: 'amountOut' as const, type: 'uint256' as const }],
    stateMutability: 'payable' as const,
  },
] as const;

const versionToEnum: Record<'V1' | 'V2' | 'V2_1', number> = {
  V1: 0,
  V2: 1,
  V2_1: 2,
};

export const createMerchantMoeSwapActionTool = createTool({
  id: 'create-merchant-moe-swap-action',
  description: `Create a Merchant Moe swap proposal for the WalletGenie Treasury on Mantle.
Generates calldata for the treasury manager to call WalletGenieTreasury.execute(target, value, data).
Use this for direct Treasury -> Merchant Moe swaps on Mantle mainnet.`,
  inputSchema: z.object({
    vaultAddress: z.string().describe('WalletGenieTreasury contract address'),
    chainId: z.number().default(MANTLE_MAINNET_CHAIN_ID).describe('Chain ID (5000 for Mantle mainnet)'),
    routerAddress: z.string().default(DEFAULT_MERCHANT_MOE_LB_ROUTER).describe('Merchant Moe LBRouter address'),
    tokenIn: z.string().describe('Input token address, or zeroAddress when swapping native MNT'),
    tokenOut: z.string().describe('Output token address'),
    amountIn: z.string().describe('Amount to swap in wei / smallest unit'),
    amountOutMin: z.string().default('0').describe('Minimum output amount in smallest unit'),
    pairBinStep: z.number().default(10).describe('Merchant Moe bin step for the route'),
    version: z.enum(['V1', 'V2', 'V2_1']).default('V2_1').describe('Merchant Moe route version'),
    useNativeInput: z.boolean().default(false).describe('Set true when swapping native MNT rather than an ERC-20'),
    deadlineMinutes: z.number().default(20).describe('Deadline window in minutes'),
    callerAddress: z.string().optional().describe('Optional caller wallet for simulation'),
    existingPendingActions: z.array(existingActionSchema).optional(),
    isReady: z.boolean().describe('true if this is the last action (show execute button), false if more actions follow'),
  }),
  outputSchema: treasuryTransactionProposalOutputSchema,
  execute: async ({
    vaultAddress,
    chainId,
    routerAddress,
    tokenIn,
    tokenOut,
    amountIn,
    amountOutMin,
    pairBinStep,
    version,
    useNativeInput,
    deadlineMinutes,
    callerAddress,
    existingPendingActions: _existingPendingActions,
    isReady,
  }) => {
    try {
      const resolvedChainId = chainId ?? MANTLE_MAINNET_CHAIN_ID;
      const publicClient = getPublicClient(resolvedChainId);
      const router = (routerAddress ?? DEFAULT_MERCHANT_MOE_LB_ROUTER) as `0x${string}`;
      const recipient = vaultAddress as `0x${string}`;
      const deadlineWindow = deadlineMinutes ?? 20;
      const resolvedAmountIn = amountIn ?? '0';
      const resolvedAmountOutMin = amountOutMin ?? '0';
      const resolvedPairBinStep = pairBinStep ?? 10;
      const resolvedVersion = version ?? 'V2_1';
      const nativeInput = useNativeInput ?? false;
      const deadline = BigInt(Math.floor(Date.now() / 1000) + deadlineWindow * 60);
      const amountInBigInt = BigInt(resolvedAmountIn);
      const amountOutMinBigInt = BigInt(resolvedAmountOutMin);
      const wnative = await publicClient.readContract({
        address: router,
        abi: lbRouterAbi,
        functionName: 'getWNATIVE',
      });

      const tokenPath = nativeInput || tokenIn === zeroAddress
        ? [wnative as `0x${string}`, (tokenOut ?? zeroAddress) as `0x${string}`]
        : [(tokenIn ?? zeroAddress) as `0x${string}`, (tokenOut ?? zeroAddress) as `0x${string}`];

      const path = {
        pairBinSteps: [BigInt(resolvedPairBinStep)],
        versions: [versionToEnum[resolvedVersion]],
        tokenPath,
      };

      const swapFunctionName = nativeInput || tokenIn === zeroAddress
        ? 'swapExactNATIVEForTokens'
        : 'swapExactTokensForTokens';

      const data = encodeFunctionData({
        abi: lbRouterAbi,
        functionName: swapFunctionName,
        args: nativeInput || tokenIn === zeroAddress
          ? [
              amountOutMinBigInt,
              path,
              recipient,
              deadline,
            ]
          : [
              amountInBigInt,
              amountOutMinBigInt,
              path,
              recipient,
              deadline,
            ],
      });

      const resolvedTokenIn = tokenIn ?? zeroAddress;
      const resolvedTokenOut = tokenOut ?? zeroAddress;
      const description = nativeInput || resolvedTokenIn === zeroAddress
        ? `Merchant Moe swap ${resolvedAmountIn} native MNT for ${resolvedTokenOut.slice(0, 10)}...`
        : `Merchant Moe swap ${resolvedAmountIn} from ${resolvedTokenIn.slice(0, 10)}... to ${resolvedTokenOut.slice(0, 10)}...`;

      return buildTreasuryTransactionProposal({
        newAction: {
          success: true,
          protocol: 'merchant-moe',
          actionType: 'swap',
          description,
          target: router,
          value: nativeInput || resolvedTokenIn === zeroAddress ? resolvedAmountIn : '0',
          data,
        },
        existingPendingActions: [],
        vaultAddress,
        chainId: resolvedChainId,
        callerAddress,
        isReady: isReady ?? true,
        execution: {
          target: router,
          value: nativeInput || resolvedTokenIn === zeroAddress ? resolvedAmountIn : '0',
          data,
          protocol: 'merchant-moe',
        },
      });
    } catch (error) {
      const data = '0x';
      return buildTreasuryTransactionProposal({
        newAction: {
          success: false,
          protocol: 'merchant-moe',
          actionType: 'swap',
          description: 'Failed: Merchant Moe swap',
          target: (routerAddress ?? DEFAULT_MERCHANT_MOE_LB_ROUTER) as `0x${string}`,
          value: '0',
          data,
          error: error instanceof Error ? error.message : String(error),
        },
        existingPendingActions: [],
        vaultAddress,
        chainId: chainId ?? MANTLE_MAINNET_CHAIN_ID,
        callerAddress,
        isReady: false,
        execution: {
          target: (routerAddress ?? DEFAULT_MERCHANT_MOE_LB_ROUTER) as `0x${string}`,
          value: '0',
          data,
          protocol: 'merchant-moe',
        },
      });
    }
  },
});
