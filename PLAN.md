# WalletGenie CFO — Hackathon Execution Plan

## Strategi: Keep Mastra, Fix Model Layer

Mastra kita pertahankan karena:
- Agent framework (memory, tools, streaming) sudah jalan — tinggal model doang yang error
- Tools udah ada: `readTreasuryBalances`, `createMerchantMoeSwapAction`, Byreal tools
- Chat route + API key middleware udah setup
- Build & dev server works

Yang dibuang cuma model abstraction yang ribet. Kita ganti panggil NVIDIA langsung via fetch.

## Phase 1: Fix Model ✅ (NOW)
**Tujuan**: CFO agent bisa ngobrol pake LLM

**Done**:
- env.ts → return `env.MODEL` string (simple)
- Menunggu test apakah Mastra gateway bisa handle `nvidia/meta/llama-3.1-70b-instruct`

**Kalau gateway gagal**:
- Buat `packages/mastra/src/models/nvidia-direct.ts`
- Model custom dengan `specificationVersion: "v2"` 
- `doStream()` → fetch langsung ke `https://integrate.api.nvidia.com/v1/chat/completions`
- `doGenerate()` → fetch langsung, return text
- Bypass `@ai-sdk/openai` + Mastra gateway entirely

## Phase 2: Merchant Moe Integration
**Tujuan**: Agent bisa generate swap calldata buat treasury `execute()`

- Dapetin Router address + ABI Merchant Moe di Mantle
- Tool: `encodeMerchantMoeSwap()` — encode `execute()` calldata
- Treasury manager verify → execute di UI

## Phase 3: Byreal Integration
**Tujuan**: Cross-chain swap via natural language

- Byreal CLI udah terinstall
- Tool: format Byreal quote + swap params
- Output: action card di chat (bisa approve/execute)

## Phase 4: UI Polish
**Tujuan**: Demo siap presentasi

- Treasury overview (balance, deposits)
- Chat interface dengan action cards
- Execute button untuk proposal
- Loading states + error handling

## Non-Goals (Skip buat hackathon)
- Benerin Mastra model gateway compatibility (terlalu dalam)
- Multi-agent orchestration (cukup 1 CFO agent)
- Production deployment (cukup localhost + Vercel preview)

## Timeline (Deadline: June 15)
| Phase | Target |
|-------|--------|
| Phase 1 (Model fix) | Hari ini |
| Phase 2 (Merchant Moe) | 2 hari |
| Phase 3 (Byreal) | 2 hari |
| Phase 4 (UI) | 2 hari |
| Buffer | 3 hari |
