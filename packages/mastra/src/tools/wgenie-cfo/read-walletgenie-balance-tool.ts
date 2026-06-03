import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { type Address, formatEther } from 'viem';
import { getPublicClient } from '../plasma-vault/utils/viem-clients';

const treasuryAbi = [
  {
    type: 'function',
    name: 'balances',
    inputs: [{ name: '', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'manager',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'paused',
    inputs: [],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
] as const;

export const readWalletGenieTreasuryTool = createTool({
  id: 'read-walletgenie-treasury',
  description: `Read the WalletGenie Treasury vault's native MNT balance and user deposit balances.
Returns the treasury's total MNT, owner, manager, and the caller's deposited balance.
Use this for the WalletGenie Treasury vault (0x3c13BDd5... on Mantle Sepolia 5003).`,
  inputSchema: z.object({
    vaultAddress: z.string().describe('WalletGenieTreasury contract address'),
    chainId: z.number().describe('Chain ID (5003 for Mantle Sepolia)'),
    callerAddress: z.string().optional().describe('User wallet address to check deposited balance for'),
  }),
  outputSchema: z.object({
    type: z.literal('treasury-balance'),
    success: z.boolean(),
    data: z.object({
      treasuryMnt: z.string(),
      treasuryMntFormatted: z.string(),
      callerBalance: z.string(),
      callerBalanceFormatted: z.string(),
      owner: z.string(),
      manager: z.string(),
      paused: z.boolean(),
    }).optional(),
    error: z.string().optional(),
  }),
  execute: async ({ vaultAddress, chainId, callerAddress }) => {
    try {
      const publicClient = getPublicClient(chainId);
      const addr = vaultAddress as Address;

      const [treasuryMnt, owner, manager, paused] = await Promise.all([
        publicClient.getBalance({ address: addr }),
        publicClient.readContract({ address: addr, abi: treasuryAbi, functionName: 'owner' }),
        publicClient.readContract({ address: addr, abi: treasuryAbi, functionName: 'manager' }),
        publicClient.readContract({ address: addr, abi: treasuryAbi, functionName: 'paused' }),
      ]);

      let callerBalance = 0n;
      if (callerAddress) {
        callerBalance = await publicClient.readContract({
          address: addr,
          abi: treasuryAbi,
          functionName: 'balances',
          args: [callerAddress as Address],
        });
      }

      return {
        type: 'treasury-balance' as const,
        success: true,
        data: {
          treasuryMnt: treasuryMnt.toString(),
          treasuryMntFormatted: formatEther(treasuryMnt),
          callerBalance: callerBalance.toString(),
          callerBalanceFormatted: formatEther(callerBalance),
          owner,
          manager,
          paused,
        },
      };
    } catch (error) {
      return {
        type: 'treasury-balance' as const,
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },
});
