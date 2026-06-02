import { z } from 'zod';

/** Full pending action schema — passed from working memory to action tools */
export const existingActionSchema = z.object({
  id: z.string(),
  protocol: z.string(),
  actionType: z.string(),
  description: z.string(),
  fuseActions: z.array(z.object({ fuse: z.string(), data: z.string() })),
});

export const treasuryExecutionSchema = z.object({
  kind: z.literal('treasury-execution'),
  target: z.string().describe('Target contract address to call from the treasury'),
  value: z.string().describe('Native value to forward in wei'),
  data: z.string().describe('Hex-encoded calldata'),
  protocol: z.string().describe('Protocol label for display'),
});

export const treasuryActionSchema = z.object({
  id: z.string(),
  protocol: z.string(),
  actionType: z.string(),
  description: z.string(),
  target: z.string(),
  value: z.string(),
  data: z.string(),
});

export const treasuryTransactionProposalOutputSchema = z.object({
  type: z.literal('treasury-transaction-proposal'),
  status: z.enum(['partial', 'ready']),
  actions: z.array(treasuryActionSchema),
  newAction: z.object({
    success: z.boolean(),
    protocol: z.string(),
    actionType: z.string(),
    description: z.string(),
    error: z.string().optional(),
  }),
  simulation: z
    .object({
      success: z.boolean(),
      message: z.string(),
      error: z.string().optional(),
    })
    .optional(),
  vaultAddress: z.string(),
  chainId: z.number(),
  execution: treasuryExecutionSchema,
  actionsCount: z.number(),
  actionsSummary: z.string(),
});

export type TreasuryTransactionProposalOutput = z.infer<typeof treasuryTransactionProposalOutputSchema>;
