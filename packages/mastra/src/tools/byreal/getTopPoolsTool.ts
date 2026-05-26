import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const getTopPoolsTool = createTool({
  id: 'get-top-pools',
  description: `Fetch the top-performing liquidity pools on Byreal (Solana DEX).
Returns raw pool data including APR, TVL, and Volume.
Use this to analyze which pools are currently providing the best yield.`,
  inputSchema: z.object({
    sortField: z.enum(['apr24h', 'tvl', 'volume24h']).default('apr24h').describe('Field to sort the pools by'),
    limit: z.number().default(10).describe('Number of pools to return'),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    pools: z.array(z.any()),
    error: z.string().optional(),
  }),
  execute: async ({ sortField, limit }) => {
    try {
      // Assuming Byreal CLI supports JSON output format as required by RealClaw instructions
      const { stdout } = await execAsync(`byreal-cli pools list --sort-field ${sortField} -o json`);
      const pools = JSON.parse(stdout);
      
      return {
        success: true,
        pools: Array.isArray(pools) ? pools.slice(0, limit) : pools,
      };
    } catch (error) {
      return {
        success: false,
        pools: [],
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },
});
