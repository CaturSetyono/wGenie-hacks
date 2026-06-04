'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Bot,
  GitFork,
  Layers,
  Lock,
  Shield,
  Sparkles,
  Wallet,
  Zap,
} from 'lucide-react';

const VAULT_URL = '/vaults/5003/0x3c13BDd505DE69bB0DF0a2e68A0Cd93a44beB0b4';
const FEATURES = [
  {
    icon: Zap,
    title: 'One-Sign Batch Execution',
    description:
      'Swap, deposit, and rebalance across multiple Mantle vaults in a single atomic transaction. One signature, one gas payment — it either all succeeds or all reverts.',
  },
  {
    icon: Bot,
    title: 'AI Copilot',
    description:
      'Tell the agent what you want in natural language. It encodes the calldata, chains fuse actions, and presents a ready-to-sign proposal.',
  },
  {
    icon: GitFork,
    title: 'Fork Simulation',
    description:
      'Every transaction is simulated on a temporary blockchain fork before you sign. See exact balance changes — no surprises.',
  },
  {
    icon: Shield,
    title: 'Role-Based Security',
    description:
      'The AI never touches private keys. Only whitelisted actions through whitelisted fuses to whitelisted markets. You control the strategy.',
  },
];

const STEPS = [
  {
    number: '01',
    title: 'Deploy Your Vault',
    description:
      'A guided 6-step wizard deploys your personal PlasmaVault on Mantle with all roles, fuses, and market configurations ready.',
  },
  {
    number: '02',
    title: 'Deposit USDC',
    description:
      'Fund your vault with a single deposit. Standard ERC-4626 flow — approve and deposit. Your capital is ready to allocate.',
  },
  {
    number: '03',
    title: 'Let AI Allocate',
    description:
      'Open the chat and say "Put 500 in USDY" or "Swap 200 to WETH and allocate to mETH." The agent handles the rest.',
  },
];

const VAULTS = [
  { name: 'USDY', asset: 'USDC', color: '#00FF8B' },
  { name: 'mETH', asset: 'WETH', color: '#627EEA' },
  { name: 'Aave V3', asset: 'Multi-Asset', color: '#2EBAC6' },
  { name: 'MNT', asset: 'Native', color: '#4E6FFF' },
];

export function WalletGenieLandingPage() {
  return (
    <div className="min-h-screen bg-wgenie-black font-sans text-white relative overflow-hidden">
      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-24 pb-20 md:pt-32 md:pb-28 text-center">
        {/* Atmospheric glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-6 max-w-4xl">
          <div className="flex items-center gap-3 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest animate-pulse">
            <Bot className="w-3 h-3" />
            AI-Powered Treasury Manager
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tight leading-[1.1]">
            Your Personal Web3 CFO <br />
            <span className="text-primary">Powered by Llama 3.3</span>
          </h1>

          <p className="text-base md:text-lg text-wgenie-muted max-w-2xl leading-relaxed">
            Stop juggling multiple protocols and manual swaps. WalletGenie AI Agent manages your treasury on Mantle — from yield optimization in Aave to liquidity on Merchant Moe — all through a single natural language interface.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Link
              href={VAULT_URL}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-primary text-black font-semibold text-base hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,255,139,0.3)]"
            >
              Enter Treasury
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Problem → Solution ── */}
      <section className="relative px-6 py-16 md:py-24">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16">
          <div className="space-y-4">
            <span className="text-[11px] font-medium tracking-wider uppercase text-wgenie-muted">
              The Problem
            </span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Treasury management is complex and time-consuming
            </h2>
            <ul className="space-y-3 text-wgenie-muted text-sm leading-relaxed">
              <li className="flex gap-3">
                <span className="text-white/30 shrink-0">—</span>
                Fragmented liquidity across multiple Mantle protocols
              </li>
              <li className="flex gap-3">
                <span className="text-white/30 shrink-0">—</span>
                Manual execution of multi-step yield strategies
              </li>
              <li className="flex gap-3">
                <span className="text-white/30 shrink-0">—</span>
                Lack of real-time insights and automated analysis
              </li>
              <li className="flex gap-3">
                <span className="text-white/30 shrink-0">—</span>
                Managing risk and slippage on every manual swap
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <span className="text-[11px] font-medium tracking-wider uppercase text-primary">
              The Solution
            </span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              A Unified AI Execution Hub
            </h2>
            <ul className="space-y-3 text-wgenie-muted text-sm leading-relaxed">
              <li className="flex gap-3">
                <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                Conversational interface for complex DeFi operations
              </li>
              <li className="flex gap-3">
                <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                Atomic batch execution for swaps and deposits
              </li>
              <li className="flex gap-3">
                <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                Automated yield farming via Aave V3 integration
              </li>
              <li className="flex gap-3">
                <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                Real-time dashboard with positions, APY, and history
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="relative px-6 py-16 md:py-24">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[11px] font-medium tracking-wider uppercase text-wgenie-muted">
              Engineered for Mantle
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Smarter, Faster, On-Chain
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="group relative bg-wgenie-dark rounded-lg border border-white/5 p-6 space-y-3 overflow-hidden backdrop-blur-sm"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-primary/[0.05]" />
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 ring-1 ring-primary/20 shadow-[0_0_15px_rgba(0,255,139,0.1)]">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-wgenie-muted leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Built With ── */}
      <section className="px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <span className="text-[11px] font-medium tracking-wider uppercase text-wgenie-muted">
              Powered By
            </span>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Cutting-edge AI and DeFi Stack
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {[
              'Mastra AI v1.2',
              'NVIDIA Llama 3.3',
              'Aave V3',
              'Merchant Moe',
              'Mantle Network',
              'Ponder Indexer',
              'wGenie Fusion SDK',
              'React 19',
              'TailwindCSS 4',
            ].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-wgenie-muted hover:text-primary hover:border-primary/30 transition-all cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative px-6 py-20 md:py-28">
        <div className="absolute inset-0 bg-primary/[0.02]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
            Start managing your treasury
          </h2>
          <p className="text-wgenie-muted text-base md:text-lg max-w-lg mx-auto">
            One vault for all your wgenie positions. AI-managed allocation. Atomic
            batch execution. Full on-chain transparency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
            <Link
              href={VAULT_URL}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-primary text-black font-semibold text-base hover:bg-primary/90 transition-colors"
            >
              Open App
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-wgenie-muted">
          <div className="flex items-center gap-2">
            <img
              src="/assets/wgenie/wgenie_no_bg.svg"
              alt="wgenie"
              className="h-5 w-auto opacity-50"
            />
            <span>WalletGenie Treasury</span>
          </div>
          <span>
            Built with wgenie Protocol SDK & wGenie Fusion — Deployed on Mantle
          </span>
        </div>
      </footer>
    </div>
  );
}
