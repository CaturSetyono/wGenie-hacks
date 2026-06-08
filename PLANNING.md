# WalletGenie CFO - Hackathon Execution Plan

> **Hackathon:** The Turing Test 2026 - Phase II: AI Awakening
> **Track:** Track 6 (Agentic Economy - Byreal Toolkit)
> **Network:** Mantle L2 (Sepolia testnet 5003 -> Mainnet 5000)
> **Deadline:** June 15, 2026

---

## Status Saat Ini

### Selesai

| Item | Detail |
|------|--------|
| WalletGenieTreasury contract | Deployed di Mantle Sepolia `0x3c13BDd505DE69bB0DF0a2e68A0Cd93a44beB0b4` |
| Foundry setup | `foundry.toml`, `forge build`, `forge script` deploy |
| Treasury funded | 1 MNT deposited |
| Mantle Sepolia infra | 5003 added di Mastra viem-clients, env, web chains.config, wagmi-provider, rpc/clients |
| Web build | Pass |
| Landing page | Link ke vault 5003 real address |
| Vault page | TreasuryOverview render (tags `wgenie-cfo`) |
| CFO agent tool | `readWalletGenieTreasuryTool` untuk baca MNT balance + user deposit |
| Chat route | Default chainId 5003 |
| Phase 1 - Byreal tools | `getTopPoolsTool`, `analyzePoolTool`, `simulateSwapTool`, `executeSwapTool` sudah diimplementasi |
| Phase 1 - Merchant Moe swap | `createMerchantMoeSwapActionTool` sudah bikin proposal treasury `execute(target, value, data)` |
| Phase 1 - Treasury proposal UI | Renderer proposal treasury + execute flow sudah ditambah di web |

### Belum / Kurang

| Item | Status | Notes |
|------|--------|-------|
| Agni Finance / Fluxion | Belum | Aave V3 sudah terintegrasi |
| Mainnet deploy | Belum | Treasury belum dipindah ke Mantle mainnet |

---

## Selesai (Updated)

| Item | Detail |
|------|--------|
| Aave V3 Integration | `createAaveAllocationActionTool` & `createAaveWithdrawActionTool` sudah ready |
| Ponder Indexer | Treasury events (`Deposited`, `Executed`) sudah di-index dan tampil di UI History |
| Treasury Positions | `MANTLE_VAULTS` sudah support Mantle Sepolia (5003) & Mainnet (5000) |
| Execute Flow UI | Tombol Execute di proposal card sudah fungsional dengan handle desimal USDC/MNT |
| Landing Page Content | Konten sudah diperbarui ke WalletGenie CFO Branding & Llama 3.3 focus |

---

## Critical - Wajib Ada di Demo

### 1. Byreal Toolkit Integration

> Why: Track 6 requirement. Byreal Agent Skills & RealClaw adalah inti track ini.

**Files affected:**
- `packages/mastra/src/tools/byreal/`
- `packages/mastra/src/agents/wgenie-cfo-agent.ts`

**What:**
- [x] Implement `getTopPoolsTool` - panggil `byreal-cli pools list --sort-field apr24h -o json`
- [x] Implement `analyzePoolTool` - panggil `byreal-cli pools analyze <address> -o json`
- [x] Implement `simulateSwapTool` - panggil `byreal-cli swap execute ... --dry-run -o json`
- [x] `executeSwapTool` - panggil `byreal-cli swap execute ... --confirm`
- [x] Update agent instructions supaya CFO bisa suggest cross-chain strategy

**Demo flow:**
1. User: "what pools are hot on Byreal?"
2. Agent: calls `getTopPoolsTool` -> "Top 3 pools: ..."

### 2. Merchant Moe Swap Action

> Why: Treasury `execute()` butuh calldata.

**Files affected:**
- `packages/mastra/src/tools/wgenie-cfo/create-swap-action.ts`
- `packages/mastra/src/tools/wgenie-cfo/types.ts`

**What:**
- [x] Generate `execute()` calldata
  ```solidity
  treasury.execute(
    merchantMoeRouter,
    0,
    abi.encodeWithSignature("swapExactTokensForTokens(...)")
  )
  ```
- [x] Output proposal treasury with `{ target, value, data }`

**Demo flow:**
1. User: "swap 0.5 MNT to USDC"
2. Agent: calls `createMerchantMoeSwapActionTool`
3. Returns calldata -> user bisa execute via UI

### 3. Agent Workflow - Read -> Propose -> Simulate

> Why: Agent harus bisa ngasih proposal yang actionable, bukan cuma ngomong.

**Files affected:**
- `packages/mastra/src/tools/wgenie-cfo/create-swap-action.ts`
- `packages/web/src/wgenie-cfo/components/treasury-overview.tsx`
- `packages/web/src/wgenie-cfo/components/treasury-transaction-proposal.tsx`
- `packages/web/src/wgenie-cfo/tools/tool-renderer.tsx`

**What:**
- [x] Agent returns structured treasury proposal: `{ target, value, data, protocol, ... }`
- [x] UI renders proposal as action card
- [x] "Execute" button on the card calls `treasury.execute(target, value, data)`

**UI components needed:**
- [x] `TransactionProposalCard` - show what will happen
- [x] `ExecuteButton` - calls wallet to sign + send

---

## High - Demo Jadi Lebih Kuat

### 4. Yield Protocol Integration

> Why: Hackathon brief mentions Agni Finance, Fluxion, Aave V3. Need at least one working.

**Option A - Aave V3 on Mantle (termudah):**
- Aave V3 sudah deployed di Mantle
- Generate calldata buat `supply()` via treasury `execute()`

**Option B - Agni Finance:**
- Part of Mantle Agent Scaffold
- Lending protocol - deposit/borrow

**Files affected:**
- `packages/mastra/src/tools/wgenie-cfo/create-allocation-action.ts`
- New address constants untuk Aave / Agni

### 5. Treasury Dashboard - Real Positions

> Why: UI sekarang kosong karena `MANTLE_VAULTS` cuma support 8453.

**Files affected:**
- `packages/web/src/wgenie-cfo/hooks/use-treasury-positions.ts`

**What:**
- Tambah Mantle mainnet (5000) entries di `MANTLE_VAULTS`
- Atau deploy mock vault addresses untuk demo Sepolia

### 6. Execute Flow dari Agent ke Treasury

> Why: User harus bisa execute proposal dari UI.

**Files affected:**
- `packages/web/src/wgenie-cfo/components/treasury-chat.tsx` atau file chat baru
- `packages/web/src/wgenie-cfo/hooks/use-treasury-actions.ts`

**What:**
- Backend manager wallet: EOA yang punya `MANAGER_ROLE`
- Atau demo pakai user/manager yang sesuai permission treasury

---

## Medium - Polish

### 7. Ponder Indexer

> Why: Index treasury events biar dashboard bisa show history.

**Files affected:**
- `packages/ponder/ponder.config.ts`
- `packages/ponder/ponder.schema.ts`
- `packages/ponder/src/` - new event handler

### 8. Landing Page Content

> Why: Landing page harus match capability yang real.

**Files affected:**
- `packages/web/src/wgenie-cfo/components/landing-page.tsx`

### 9. Deploy ke Mantle Mainnet

> Why: Judge bakal lihat testnet, tapi mainnet lebih impressive.

**Files affected:**
- `packages/hardhat-tests/script/Deploy.s.sol`
- `packages/hardhat-tests/.env`
- SDK addresses

---

## Resource Dependencies

| Resource | Status | Sumber |
|----------|--------|--------|
| Byreal CLI | Sudah ada di workspace | `node_modules/.bin/byreal-cli` |
| Merchant Moe Router ABI | Sudah dipakai | `mantle-reesources.md` -> docs.merchantmoe.com |
| Aave V3 Mantle address | Belum | docs.aave.com / mantle-reesources.md |
| Agni Finance address | Belum | mantle-reesources.md |
| Manager EOA + private key | Belum | Generate baru |
| MNT mainnet buat deploy | Belum | Bridge dari ETH |

---

## Recommended Order

```text
Phase 1 (Critical - Demo Flow)
  -> 1. Byreal tools: fetch pools, simulate swap
  -> 2. Merchant Moe: generate execute() calldata
  -> 3. Agent workflow: proposal card + execute button

Phase 2 (High - Demo Quality)
  -> 4. Aave V3 or Agni: deposit yield
  -> 5. Treasury dashboard positions
  -> 6. Execute from UI

Phase 3 (Medium - Polish)
  -> 7. Ponder indexer
  -> 8. Landing page
  -> 9. Mainnet deploy
```
