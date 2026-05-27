import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { buildTransactionProposal, transactionProposalOutputSchema } from '../alpha/build-transaction-proposal';
import { existingActionSchema } from './types';

export const createMantleAllocationActionTool = createTool({
  id: 'create-allocation-action',
  description: `Create a fuse action to allocate tokens from the treasury to a Mantle vault (USDY, mETH, cmBTC, MNT).
Uses Erc4626SupplyFuse.enter() to deposit the underlying asset into the Mantle vault.
The treasury must hold the correct underlying token (e.g., USDC for USDY, WETH for mETH).
Returns a unified transaction proposal with simulation.
Set isReady=true when this is the last action, false if more actions follow.`,
  inputSchema: z.object({
    vaultAddress: z.string().describe('Treasury PlasmaVault address'),
    chainId: z.number().describe('Chain ID (8453 for Base)'),
    mantleVaultId: z.enum(['USDY', 'mETH', 'cmBTC', 'MNT', 'yoGOLD', 'USDYT']).describe('Which Mantle vault to allocate to'),
    mantleVaultAddress: z.string().describe('Mantle vault contract address'),
    amount: z.string().describe('Amount in underlying token smallest unit (e.g., "50000000" for 50 USDC)'),
    callerAddress: z.string().optional().describe('Caller with ALPHA_ROLE for simulation'),
    existingPendingActions: z.array(existingActionSchema).optional(),
    isReady: z.boolean().describe('true if this is the last action (show execute button), false if more actions follow'),
  }),
  outputSchema: transactionProposalOutputSchema,
  execute: async (_args) => {
    throw new Error('not implemented');
  },
});
