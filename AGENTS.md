# WalletGenie Mantle Hacks - Agent Guide

## Essential Commands

### Database (Supabase)
```bash
# Start local Supabase (required for Ponder)
pnpm db:start
# Stop when done
pnpm db:stop
# Check status
pnpm db:status
```

### Development Servers
```bash
# Web app (Next.js) - http://localhost:3000
pnpm dev:web

# Mastra AI agents - http://localhost:4111
pnpm dev:mastra

# Ponder indexer - http://localhost:42069
pnpm dev:ponder
```

### Type Generation
When modifying `packages/ponder/ponder.schema.ts`:
```bash
# Regenerate Supabase types
pnpm --filter @wgenie/fusion-supabase-ponder gen:types
```

## Project Structure
- `packages/web` - Next.js frontend
- `packages/ponder` - Blockchain event indexer
- `packages/mastra` - AI agents (WalletGenie CFO)
- `packages/supabase-ponder` - Supabase client for Ponder data
- `packages/sdk` - Shared ABIs and helpers

## Key Conventions
1. **Always start database first**: `pnpm db:start` before running Ponder
2. **Ponder auto-migrates**: Schema changes in `ponder.schema.ts` apply automatically on restart
3. **Environment setup**: Copy `.env.example` to `.env.local`/`.env` in each package
4. **Monorepo commands**: Use `pnpm --filter <package> <script>` for package-specific operations

## Known Build Issues & Fixes Applied
During build, encountered multiple issues:

1. **Missing component import**: 
   - Error: `Can't resolve '@/wgenie-cfo/components/wgenie-cfo-overview'`
   - Fix: Changed import in `packages/web/src/app/vaults/[chainId]/[address]/page.tsx` from 
     `@/wgenie-cfo/components/wgenie-cfo-overview` to `@/wgenie-cfo/components/treasury-overview`

2. **Missing protocol package**:
   - Error: `Can't resolve '@walletgenie-protocol/core'` and similar
   - These imports appear throughout the codebase (e.g., in `wgenie-cfo` components and hooks, `lib/rpc/vault-rpc-data.ts`)
   - The package `@walletgenie-protocol` is not found in dependencies or as a local package
   - **Fix applied**: Replaced all `@walletgenie-protocol` imports with `@yo-protocol` and added `@yo-protocol/core@1.0.9` as a dependency
   - **Note for agents**: When seeing `@walletgenie-protocol` imports, use `@yo-protocol` instead and ensure `@yo-protocol/core` is installed

3. **Missing SDK constants**:
   - Error: `Export CMBTC_ADDRESS doesn't exist in target module` and similar errors for `FUSION_FACTORY_ADDRESS`, `ERC4626_SUPPLY_FUSE_SLOT1_ADDRESS`, etc.
   - These constants are imported in `packages/web/src/app/cfo/create/vault-creation.constants.ts` from `@wgenie/fusion-sdk` but are not exported by the SDK
   - **Current status**: Issue not resolved - these constants need to be either:
     * Added to the SDK (`packages/sdk/src/fusion.addresses.ts` or similar)
     * Generated from a data source (possibly `plasma-vaults.json`)
     * The import path needs to be corrected if they exist elsewhere

## Testing
```bash
# SDK tests
pnpm test:sdk

# Hardhat tests
pnpm test:hardhat
```

## Important Notes
- Docker required for Supabase CLI
- Node.js >= 22.13.0, pnpm >= 10.28.2
- LLM API keys needed in `packages/mastra/.env`
- Ponder handles DB schema - no manual migrations needed
- This project integrates with Mantle network (Chain ID: 5000 for mainnet, 5003 for Sepolia testnet)
- Uses yo-protocol (formerly Byreal protocol) for DeFi interactions - see mantle-reesources.md for Mantle ecosystem details
- When working with Mantle-specific features, refer to mantle-reesources.md for network configuration, DeFi protocols (Merchant Moe, Agni Finance, Fluxion), and RWA assets (USDY, mETH)
- The missing SDK constants (FUSION_FACTORY_ADDRESS, ERC4626_SUPPLY_FUSE_SLOT*, CMBTC_ADDRESS, etc.) currently prevent full builds - refer to the Known Build Issues section for details