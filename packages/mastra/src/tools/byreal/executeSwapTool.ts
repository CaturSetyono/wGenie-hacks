import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const executeSwapTool = createTool({
  id: 'execute-swap',
  description: `Execute a token swap on Byreal.
Requires prior simulation and confirmation.`,
  inputSchema: z.object({
    inputMint: z.string().describe('Mint address of the token to swap from'),
    outputMint: z.string().describe('Mint address of the token to swap to'),
    amount: z.number().describe('Amount of input token to swap'),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    txSignature: z.string().optional(),
    error: z.string().optional(),
  }),
  execute: async ({ inputMint, outputMint, amount }) => {
    try {
      const { stdout } = await execAsync(`byreal-cli swap execute --input-mint ${inputMint} --output-mint ${outputMint} --amount ${amount} --confirm -o json`);
      const result = JSON.parse(stdout);
      
      return {
        success: true,
        txSignature: result.signature || result.txid,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },
});
