import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { buildTransactionProposal, transactionProposalOutputSchema } from '../alpha/build-transaction-proposal';
import { existingActionSchema } from './types';

export const createMantleWithdrawActionTool = createTool({
  id: 'create-withdraw-action',
  description: `Create a fuse action to withdraw from a Mantle vault back to the treasury.
Uses YoRedeemFuse.exit() which calls redeem() — NOT withdraw() (withdraw is disabled on Mantle vaults).
Reads the vault's current wgenie share balance and redeems all or a specified amount.
Returns a unified transaction proposal with simulation.
Set isReady=true when this is the last action, false if more actions follow.`,
  inputSchema: z.object({
    vaultAddress: z.string().describe('Treasury PlasmaVault address'),
    chainId: z.number().describe('Chain ID'),
    mantleVaultId: z.enum(['USDY', 'mETH', 'cmBTC', 'MNT', 'yoGOLD', 'USDYT']).describe('Mantle vault to withdraw from'),
    mantleVaultAddress: z.string().describe('Mantle vault contract address'),
    shares: z.string().optional().describe('Share amount to redeem. If omitted, redeems all shares.'),
    callerAddress: z.string().optional(),
    existingPendingActions: z.array(existingActionSchema).optional(),
    isReady: z.boolean().describe('true if this is the last action (show execute button), false if more actions follow'),
  }),
  outputSchema: transactionProposalOutputSchema,
  execute: async (_args) => {
    throw new Error('not implemented');
  },
});
