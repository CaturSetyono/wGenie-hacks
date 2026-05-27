# Yo-Protocol Removal Plan

## Konteks
Hackathon **The Turing Test 2026** — kita pakai **Mantle L2 (Chain 5000/5003)**.  
Semua kode terkait **yo-protocol** (YO vaults di Base chain) harus dihapus.

## Apa Itu yo-protocol?
- `@yo-protocol/core` & `@yo-protocol/react` — SDK untuk YO Protocol vaults (di Base chain)
- YO_TREASURY_ROLES, YO_VAULT_SLOTS — constants spesifik YO vaults
- yoRedeemFuseAbi, yoUniversalTokenSwapperFuseAbi — ABI untuk YO contracts
- YO_REDEEM_FUSE, YO_WETH, YO_CBBTC, MNTC — address constants untuk YO tokens
- "Mantle vaults" di UI — sebenarnya refers ke YO vaults di Base, **bukan** Mantle L2

## Yang Tetap Dipertahankan
| Area | Alasan |
|------|--------|
| Core PlasmaVault/Fusion framework | Framework utama, chain-agnostic |
| Ponder indexer | Indexing blockchain events |
| Mastra AI agents framework | Agent infrastructure |
| Next.js app structure | Frontend framework |
| wagmi/viem setup | Web3 layer |
| Supabase integration | Database |
| Mantle L2 resources/docs | Hackathon requirement |
| Chain-agnostic utilities | createChainAddresses, dll |

## Yang Dihapus

### Phase 1: Dependencies
- [ ] Hapus `"@yo-protocol/core": "1.0.9"` dari root `package.json`
- [ ] Hapus `"@yo-protocol/react": "^1.0.6"` dari `packages/web/package.json`
- [ ] Run `pnpm install` untuk update lockfile

### Phase 2: SDK Constants & ABIs
Files to delete:
- [ ] Hapus `packages/sdk/src/yo-treasury.constants.ts` (YO_TREASURY_ROLES, YO_VAULT_SLOTS, SWAP_MARKET_ID)
- [ ] Hapus `packages/sdk/src/abi/yo-redeem-fuse.abi.ts`

Files to edit:
- [ ] `packages/sdk/src/fusion.addresses.ts` — hapus semua YO-related addresses:
  - YO_REDEEM_FUSE_SLOT1-4_ADDRESS
  - YO_WETH_ADDRESS, YO_CBBTC_ADDRESS, MNTC_ADDRESS
  - ERC4626_SUPPLY/BALANCE_FUSE_SLOT1-4_ADDRESS (yo-specific slots)
  - USDY_ADDRESS, METH_ADDRESS, CMBTC_ADDRESS, MNT_ADDRESS (yo-specific tokens)
  - ZERO_BALANCE_FUSE_ADDRESS (if yo-specific)
  - ODOS_ROUTER, KYBER_SWAP_ROUTER, UNISWAP_SWAP_ROUTER (yo-specific routers)
  - SWAP_MARKET_ID (number constant)
- [ ] `packages/sdk/src/index.ts` — hapus exports:
  - YO_TREASURY_ROLES, YO_VAULT_SLOTS, SWAP_MARKET_ID
  - yoRedeemFuseAbi
  - erc4626SupplyFuseAbi (if yo-specific, otherwise keep)
  - YO_REDEEM_FUSE_SLOT1-4_ADDRESS
  - YO_WETH_ADDRESS, YO_CBBTC_ADDRESS, MNTC_ADDRESS
  - Token/router addresses

### Phase 3: Web Package — Components
Hooks to remove/rewrite:
- [ ] `packages/web/src/wgenie-cfo/hooks/use-vault-detail.ts` — hapus `createYoClient`, ganti dengan Mantle L2 client
- [ ] `packages/web/src/wgenie-cfo/hooks/use-vaults-data.ts` — hapus `useMantleVaultsData`, `useYoPrices`
- [ ] `packages/web/src/wgenie-cfo/hooks/use-treasury-positions.ts` — hapus YO_VAULTS

Components to rewrite/remove:
- [ ] `packages/web/src/wgenie-cfo/components/treasury-dashboard.tsx` — hapus referensi Mantle vaults
- [ ] `packages/web/src/wgenie-cfo/components/vault-overview.tsx` — hapus @yo-protocol/react hooks
- [ ] `packages/web/src/wgenie-cfo/components/vault-metrics.tsx` — hapus @yo-protocol/react
- [ ] `packages/web/src/wgenie-cfo/components/vault-charts.tsx` — hapus @yo-protocol/core types
- [ ] `packages/web/src/wgenie-cfo/components/share-price-chart.tsx` — hapus @yo-protocol/core types
- [ ] `packages/web/src/wgenie-cfo/components/portfolio-summary.tsx` — hapus @yo-protocol/react
- [ ] `packages/web/src/wgenie-cfo/components/allocation-table.tsx` — hapus @yo-protocol/react
- [ ] `packages/web/src/wgenie-cfo/components/merkl-rewards.tsx` — hapus @yo-protocol/react
- [ ] `packages/web/src/wgenie-cfo/components/performance-benchmark.tsx` — hapus @yo-protocol/react
- [ ] `packages/web/src/wgenie-cfo/components/user-snapshots.tsx` — hapus @yo-protocol/react

Vault actions (remove/replace):
- [ ] `packages/web/src/vault-actions/components/vault-action-tabs.tsx` — hapus `useVaultState` dari @yo-protocol
- [ ] `packages/web/src/vault-actions/components/deposit-form.tsx` — hapus @yo-protocol/react hooks
- [ ] `packages/web/src/vault-actions/components/withdraw-form.tsx` — hapus @yo-protocol/react hooks
- [ ] `packages/web/src/vault-actions/components/vault-sidebar.tsx` — hapus YieldProvider
- [ ] `packages/web/src/vault-actions/components/pending-redemption-banner.tsx` — hapus @yo-protocol/react

Storybook files (remove/update):
- [ ] `packages/web/src/wgenie-cfo/components/deposit-form.stories.tsx`
- [ ] `packages/web/src/wgenie-cfo/components/withdraw-form.stories.tsx`
- [ ] `packages/web/src/wgenie-cfo/components/treasury-chat.stories.tsx`

### Phase 4: Web Package — RPC & Config
- [ ] `packages/web/src/lib/rpc/vault-rpc-data.ts` — hapus `createYoClient`, ganti fallback price
- [ ] `packages/web/src/lib/app-config.ts` — hapus entry `yo` dari configs & APP_THEME_CLASS
- [ ] `packages/web/src/lib/vaults-registry.ts` — hapus `'yo'` dari APP_IDS (tapi cek dulu apakah masih dipake plasma-vaults.json)
- [ ] `packages/web/src/app/cfo/create/vault-creation.constants.ts` — hapus imports YO_TREASURY_ROLES, YO_VAULT_SLOTS, dll

### Phase 5: Mastra Package — AI Agent Tools
- [ ] `packages/mastra/src/tools/wgenie-cfo/create-allocation-action.ts` — hapus YO_VAULT_SLOTS, erc4626SupplyFuseAbi
- [ ] `packages/mastra/src/tools/wgenie-cfo/create-withdraw-action.ts` — hapus yoRedeemFuseAbi, YO_VAULT_SLOTS
- [ ] `packages/mastra/src/tools/wgenie-cfo/create-swap-action.ts` — hapus yoUniversalTokenSwapperFuseAbi
- [ ] `packages/mastra/src/tools/wgenie-cfo/vault-metadata.ts` — hapus YO_UNDERLYING, getYoUnderlyingAddresses
- [ ] `packages/mastra/src/tools/wgenie-cfo/read-treasury-balances.ts` — hapus referensi YO
- [ ] `packages/mastra/src/tools/wgenie-cfo/map-to-market-balances.ts` — hapus mapMantlePositionsToMarkets
- [ ] `packages/mastra/src/agents/wgenie-cfo-agent.ts` — hapus tool registrations YO-related

### Phase 6: Plasma Vaults JSON
- [ ] `plasma-vaults.json` — hapus vault entries dengan app `"yo"` (indices 73-77: YO Treasury, yoUSD, yoETH, yoBTC, yoEUR) ATAU ganti app mereka ke yang valid seperti "wgenie"

### Phase 7: Build & Verify
- [ ] Build SDK: `pnpm build:sdk`
- [ ] Build web: `pnpm build:web`
- [ ] Build mastra: `pnpm --filter @wgenie/fusion-mastra build`

## Catatan Penting
1. **`plasma-vaults.json`** — Jika hapus entry yo, pastikan APP_IDS di vaults-registry juga disesuaikan
2. **`erc4626SupplyFuseAbi`** — Ini ada di ponder/abis dan sudah dicopy ke SDK. Perlu cek apakah ini yo-specific atau generic
3. **Naming**: "Mantle" di code ini confusing — MantleVault* sebenarnya yo vaults. Saat rewrite, pastikan tidak bingung dengan Mantle L2 chain
4. **Prioritas**: Phase 1-2 dulu (dependencies & SDK) baru sisanya, karena SDK changes mempengaruhi semuanya
