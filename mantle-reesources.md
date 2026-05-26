# 📚 RESOURCES & TOOLKIT — The Turing Test Hackathon 2026
# Full Developer Resources Document

> **Generated:** 2026-05-26  
> **Hackathon:** The Turing Test Hackathon 2026 — Phase II: AI Awakening  
> **Deadline:** June 15, 2026  

---

## Table of Contents

1. [Mantle Network Resources](#1-mantle-network-resources)
2. [Mantle Testnet Setup](#2-mantle-testnet-setup)
3. [Mantle DeFi Protocols](#3-mantle-defi-protocols)
4. [Byreal Toolkit (Track 6)](#4-byreal-toolkit-track-6)
5. [Bybit API Resources (Track 1)](#5-bybit-api-resources-track-1)
6. [AI/ML Resources](#6-aiml-resources)
7. [Smart Contract Development](#7-smart-contract-development)
8. [Frontend & UI/UX Resources](#8-frontend--uiux-resources)
9. [Data Sources & Oracles](#9-data-sources--oracles)
10. [Deployment & DevOps](#10-deployment--devops)
11. [Submission Checklist](#11-submission-checklist)
12. [Community & Support](#12-community--support)
13. [Quick Start Templates](#13-quick-start-templates)

---

## 1. Mantle Network Resources

### Official Documentation
| Resource | URL | Description |
|----------|-----|-------------|
| **Mantle Docs** | https://docs.mantle.xyz | Official developer documentation |
| **Mantle v2 Docs** | https://docs-v2.mantle.xyz/ | Updated v2 documentation with Bedrock upgrade |
| **Mantle GitHub** | https://github.com/mantlenetworkio | Official repositories |
| **Mantle Developers** | https://www.mantle.xyz/developers | Developer portal |
| **Mantle Agent Scaffold** | https://github.com/mantle-xyz/mantle-agent-scaffold | Pre-built agent scaffold for Mantle |

### Network Configuration

#### Mantle Mainnet
```
Network Name:     Mantle
RPC URL:          https://rpc.mantle.xyz
Chain ID:         5000
Currency Symbol:  MNT
Block Explorer:   https://explorer.mantle.xyz
```

#### Mantle Sepolia Testnet (v2)
```
Network Name:     Mantle Sepolia Testnet
RPC URL:          https://rpc.sepolia.mantle.xyz
Chain ID:         5003
Currency Symbol:  MNT
Block Explorer:   https://explorer.sepolia.mantle.xyz
Faucet:           https://faucet.sepolia.mantle.xyz/
Bridge:           https://bridge.sepolia.mantle.xyz/
```

#### Mantle Testnet (Legacy v1)
```
Network Name:     Mantle Testnet
RPC URL:          https://rpc.testnet.mantle.xyz
Chain ID:         5001
Currency Symbol:  BIT (legacy) / MNT
Block Explorer:   https://explorer.testnet.mantle.xyz
```

### RPC Providers (Free Tiers)
| Provider | Mainnet RPC | Testnet RPC | Free Tier |
|----------|-------------|-------------|-----------|
| **Dwellir** | `https://api-mantle-mainnet.n.dwellir.com` | Available | Yes |
| **Chainstack** | Available via dashboard | Available | 3M requests |
| **Alchemy** | Available | `https://mantle-sepolia.g.alchemy.com` | Yes |
| **Thirdweb** | Available | Available | Yes |

### Mantle SDK
```bash
# Install Mantle SDK
npm install @mantleio/sdk

# Python
pip install mantle-sdk
```

### Key Mantle Features
- **Modular Architecture:** Execution + Settlement + Data Availability (EigenDA) + Consensus
- **EVM Compatible:** Full Ethereum JSON-RPC support
- **L2-Specific Methods:**
  - `eth_estimateL1Fee` — Calculate L1 data posting costs
  - `rollup_gasPrices` — Get current L1/L2 gas prices
  - `rollup_getInfo` — Query rollup configuration
- **Meta Transactions:** Fee abstraction for non-crypto-native users
- **EIP-1559 Support:** Dynamic fee market

---

## 2. Mantle Testnet Setup

### Step-by-Step Testnet Onboarding

#### Step 1: Add Mantle Sepolia to MetaMask
```
1. Open MetaMask → Settings → Networks → Add Network
2. Click "Add a network manually"
3. Enter:
   - Network Name: Mantle Sepolia Testnet
   - RPC URL: https://rpc.sepolia.mantle.xyz
   - Chain ID: 5003
   - Currency Symbol: MNT
   - Block Explorer: https://explorer.sepolia.mantle.xyz
4. Click Save
```

#### Step 2: Get Testnet MNT from Faucet
```
URL: https://faucet.sepolia.mantle.xyz/
1. Connect your wallet
2. Complete verification (if required)
3. Request MNT tokens
4. Wait for confirmation (usually instant)
```

#### Step 3: Bridge Assets (Optional)
```
URL: https://bridge.sepolia.mantle.xyz/
1. Connect wallet to Sepolia Ethereum
2. Select asset to bridge (ETH, USDC, etc.)
3. Enter amount
4. Confirm transaction
5. Wait for bridge completion
```

#### Step 4: Verify Connection
```javascript
// Using ethers.js
const provider = new ethers.JsonRpcProvider('https://rpc.sepolia.mantle.xyz');
const blockNumber = await provider.getBlockNumber();
console.log('Connected to Mantle Sepolia. Block:', blockNumber);

// Using web3.py
from web3 import Web3
w3 = Web3(Web3.HTTPProvider('https://rpc.sepolia.mantle.xyz'))
print(f'Connected: {w3.is_connected()}')
print(f'Block: {w3.eth.block_number}')
```

### Testnet Contract Verification
```bash
# Using Foundry
forge verify-contract   --chain-id 5003   --verifier-url https://explorer.sepolia.mantle.xyz/api   <CONTRACT_ADDRESS>   <CONTRACT_NAME>

# Using Hardhat
npx hardhat verify --network mantleSepolia <CONTRACT_ADDRESS> [constructor args]
```

---

## 3. Mantle DeFi Protocols

### Merchant Moe
> **Type:** DEX (Decentralized Exchange)  
> **Model:** Liquidity Book (CLMM — Concentrated Liquidity Market Maker)  
> **Docs:** https://docs.merchantmoe.com/

**Key Features:**
- Liquidity Book dengan discrete price bins (bukan curve AMM)
- Lower slippage untuk traders
- Higher fee capture untuk LPs
- $MOE governance token + $sMOE staking + $veMOE voting

**Contract Addresses (Mantle Mainnet):**
```
MOE Token:     0x4515A45337F461A11Ff0FE8aBF3c606AE5dC00c9
Router:        Check docs.merchantmoe.com for latest
Factory:       Check docs.merchantmoe.com for latest
```

**Python Price Fetching Example:**
```python
from web3 import Web3
from decimal import Decimal

# Config
RPC_URL = "https://rpc.mantle.xyz"
POOL = Web3.to_checksum_address("0x38E2a053E67697e411344B184B3aBAe4fab42cC2")

# Minimal LB Pool ABI
LB_POOL_ABI = [
    {"inputs":[],"name":"getActiveId","outputs":[{"internalType":"uint24","name":"activeId","type":"uint24"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"getBinStep","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"pure","type":"function"},
]

w3 = Web3(Web3.HTTPProvider(RPC_URL))
pool = w3.eth.contract(address=POOL, abi=LB_POOL_ABI)

# Calculate price from bin ID
def calculate_price(active_id, bin_step):
    BASE_BIN_ID = 8388608  # 2^23
    bin_step_decimal = Decimal(bin_step) / Decimal(10000)
    price = (Decimal(1) + bin_step_decimal) ** (Decimal(active_id) - Decimal(BASE_BIN_ID))
    return price

active_id = pool.functions.getActiveId().call()
bin_step = pool.functions.getBinStep().call()
price = calculate_price(active_id, bin_step)
print(f"Price: {price}")
```

**Integration for Hackathon:**
- Use Merchant Moe untuk LP positions, swaps, yield farming
- Fetch real-time prices untuk AI trading strategies
- Analyze pool data untuk anomaly detection

---

### Agni Finance
> **Type:** Lending/Borrowing Protocol  
> **Integration:** Part of Mantle Agent Scaffold

**Key Features:**
- Supply and borrow crypto assets
- Interest rate model berbasis utilization
- Collateral factor dan liquidation mechanism
- Flash loans

**For Hackathon:**
- Build AI-powered lending strategies
- Automated collateral management
- Risk assessment tools

---

### Fluxion
> **Type:** Yield Aggregator / Vault Protocol  
> **Integration:** Part of Mantle Agent Scaffold

**Key Features:**
- Auto-compounding yield vaults
- Strategy optimization
- Cross-protocol yield farming

**For Hackathon:**
- AI yield optimization across vaults
- Dynamic strategy switching
- Risk-adjusted return calculator

---

### Aave V3 on Mantle
> **Type:** Lending Protocol  
> **Integration:** Part of Mantle Agent Scaffold

**For Hackathon:**
- AI-powered borrowing strategies
- Interest rate prediction
- Liquidation bot

---

### Mantle RWA Infrastructure
**Supported Assets:**
- **USDY** — Yield-bearing stablecoin
- **mETH** — Mantle-staked ETH
- **Tokenized Real Estate** (via partner protocols)

**For Track 3 (AI x RWA):**
- Build yield strategies untuk USDY/mETH
- Automated risk management
- Dynamic allocation antara RWA assets

---

## 4. Byreal Toolkit (Track 6)

### Overview
Byreal adalah DEX (Concentrated Liquidity) di Solana yang dibangun dari awal sebagai **AI agent-native platform**. Byreal menyediakan toolkit lengkap untuk agen AI berinteraksi dengan on-chain trading stack melalui percakapan natural language.

### Three Core Components

#### 4.1 Byreal Agent Skills
> **GitHub:** https://github.com/byreal-git/byreal-agent-skills  
> **Install:** `npm install -g @byreal-io/byreal-cli`

**Capabilities:**
- **Pools:** List, search, inspect CLMM pools. View K-line, APR, TVL, volume
- **Tokens:** List tokens, search by symbol/name, get real-time prices
- **Swap:** Preview and execute token swaps dengan slippage control
- **Positions:** Open, close, manage CLMM positions. Claim fees and rewards
- **Wallet:** View address and balances, manage keypairs
- **Config:** Configure RPC URL, slippage tolerance, priority fees

**Quick Start:**
```bash
# First-time setup
byreal-cli setup

# View top pools by APR
byreal-cli pools list --sort-field apr24h

# Analyze a pool
byreal-cli pools analyze <pool-address>

# Swap preview (dry-run)
byreal-cli swap execute   --input-mint So11111111111111111111111111111111111111112   --output-mint EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v   --amount 0.1 --dry-run

# Copy top farmer's position
byreal-cli positions copy --position <address> --amount-usd 100 --confirm
```

**Auto Swap (Zap):**
```bash
# Open position with single token
byreal-cli positions open   --pool <POOL> --price-lower 140 --price-upper 180   --base MintB --amount 10 --auto-swap --confirm

# Close position, receive as USDC
byreal-cli positions close   --nft-mint <NFT> --auto-swap --output-mint <USDC_MINT> --confirm
```

**Hard Constraints (WAJIB PATUHI):**
1. `-o json` hanya untuk parsing — jangan re-draw charts
2. Jangan truncate on-chain data (txid, addresses)
3. Jangan display private keys — gunakan keypair paths
4. Preview dulu dengan `--dry-run`, baru `--confirm`
5. Amount >$1000 butuh explicit confirmation
6. Slippage >200 bps harus warn user
7. Check wallet sebelum write operations

---

#### 4.2 Byreal Perps CLI
> **Install:** `npm install -g @byreal-io/byreal-perps-cli`  
> **Docs:** https://docs.byreal.io/byreal-perps-agent-skills/

**Capabilities:**
- Perpetual futures trading
- Long/short positions
- Leverage management
- Funding rate monitoring

---

#### 4.3 RealClaw
> **Type:** OpenClaw-based Agent dengan Byreal Skills pre-installed  
> **Extensible:** Bisa di-extend ke non-DeFi scenarios

**Setup:**
```bash
# Step 1: Add skill ke Openclaw
# Tell your agent: "Add the byreal-cli skill from byreal-git/byreal-agent-skills"

# Step 2: Setup wallet
# Tell your agent: "Set up my Solana wallet for Byreal"

# Step 3: Start using
# "Show me the top-performing pools on Byreal"
# "Copy top farmer #2's MNT-USDC position"
# "Swap 50 USDC for XAUt0 on Byreal"
```

**For Track 6 (Agentic Economy):**
- Gunakan Byreal Agent Skills untuk DeFi operations
- Gunakan RealClaw sebagai base agent framework
- Extend ke real-world use cases (Personal CFO, Health Data, Event Management)

---

## 5. Bybit API Resources (Track 1)

### Official Documentation
| Resource | URL |
|----------|-----|
| **Bybit API Docs (V5)** | https://bybit-exchange.github.io/docs/v5/intro |
| **V5 Changelog** | https://bybit-exchange.github.io/docs/changelog/v5 |
| **SDKs** | Python, TypeScript, Java, Go, .NET |

### API Key Setup
```
1. Login ke bybit.com via desktop browser
2. Go to Account Settings → API Management
3. Click "Create New Key"
4. Pilih HMAC (retail) atau RSA (institutional)
5. Copy API Key dan Secret (secret hanya ditampilkan sekali!)
6. Tunggu 48 jam jika account baru
```

### Required Headers
```
X-BAPI-API-KEY:     your_api_key
X-BAPI-TIMESTAMP:   Unix time in milliseconds
X-BAPI-SIGN:        HMAC/RSA signature
X-BAPI-RECV-WINDOW: 5000 (recommended)
```

### Python SDK Example
```python
from pybit.unified_trading import HTTP

session = HTTP(
    testnet=True,
    api_key="YOUR_API_KEY",
    api_secret="YOUR_API_SECRET",
)

# Get wallet balance
balance = session.get_wallet_balance(accountType="UNIFIED")

# Place order
order = session.place_order(
    category="spot",
    symbol="BTCUSDT",
    side="Buy",
    orderType="Market",
    qty="0.01"
)
```

### Key 2026 Changes
| Date | Change | Impact |
|------|--------|--------|
| 2026-02-05 | Transaction Log rate limit: 50→25 req/s | Algo traders |
| 2026-02-10 | IP whitelist + fiat permissions via API disabled | Security |
| 2026-02-26 | Funding settlement auto-adjusted 1h intervals | Perp traders |
| 2026-03-23 | On-chain trading endpoints added | Web3 integration |
| 2026-04-27 | Strategy open APIs added | Algo strategies |
| 2026-05-21 | Get Order History fields added | Order tracking |

### On-Chain Trading Endpoints (New 2026)
```
GET /v5/trade/quote          # Get price quote
POST /v5/trade/purchase      # Execute buy
POST /v5/trade/redeem        # Execute sell
GET /v5/trade/payment-tokens # Available payment tokens
GET /v5/trade/biz-tokens     # On-chain tradable tokens
GET /v5/trade/token-prices   # Batch token prices
GET /v5/trade/orders         # Order history
```

---

## 6. AI/ML Resources

### LLM APIs
| Provider | Model | Use Case | Pricing |
|----------|-------|----------|---------|
| **OpenAI** | GPT-4o, GPT-4 | Sentiment analysis, NL generation, reasoning | Pay-per-token |
| **Anthropic** | Claude 3.5 Sonnet | Long context, code analysis, safety | Pay-per-token |
| **Google** | Gemini Pro | Multimodal, code, reasoning | Free tier available |
| **Mistral** | Mistral Large | Open-weight, self-hostable | Various |

### Python Libraries
```bash
# Core ML
pip install torch tensorflow scikit-learn

# NLP
pip install transformers openai anthropic langchain

# Data
pip install pandas numpy polars

# On-chain data
pip install web3 ethers

# APIs
pip install requests aiohttp
```

### Sentiment Analysis Stack
```python
# Twitter/X API (v2)
import tweepy
client = tweepy.Client(bearer_token="YOUR_BEARER_TOKEN")
tweets = client.search_recent_tweets(query="$MNT OR Mantle", max_results=100)

# Reddit API
import praw
reddit = praw.Reddit(client_id="", client_secret="", user_agent="")
posts = reddit.subreddit("Mantle").hot(limit=100)

# News API
import requests
news = requests.get("https://newsapi.org/v2/everything?q=Mantle+crypto&apiKey=KEY")

# Sentiment scoring
from transformers import pipeline
sentiment = pipeline("sentiment-analysis", model="finbert")
```

### On-Chain Data Analysis
```python
from web3 import Web3
import pandas as pd

# Connect to Mantle
w3 = Web3(Web3.HTTPProvider("https://rpc.mantle.xyz"))

# Get transaction data
def get_transactions(address, start_block, end_block):
    txs = []
    for block_num in range(start_block, end_block):
        block = w3.eth.get_block(block_num, full_transactions=True)
        for tx in block.transactions:
            if tx['to'] == address or tx['from'] == address:
                txs.append({
                    'hash': tx['hash'].hex(),
                    'from': tx['from'],
                    'to': tx['to'],
                    'value': w3.from_wei(tx['value'], 'ether'),
                    'gas': tx['gas'],
                    'gasPrice': tx['gasPrice'],
                })
    return pd.DataFrame(txs)

# Whale detection
whales = get_transactions("0x...", latest_block - 1000, latest_block)
large_txs = whales[whales['value'] > 100000]  # > $100K
```

### The Graph (Subgraphs)
```graphql
# Example query untuk Mantle DEX data
query {
  pools(first: 10, orderBy: volumeUSD, orderDirection: desc) {
    id
    token0 { symbol }
    token1 { symbol }
    volumeUSD
    tvlUSD
    feeTier
  }
}
```

---

## 7. Smart Contract Development

### Foundry (Recommended)
```bash
# Install
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Init project
forge init my-project
cd my-project

# Install dependencies
forge install OpenZeppelin/openzeppelin-contracts

# Build
forge build

# Test
forge test

# Deploy to Mantle Sepolia
forge create --rpc-url https://rpc.sepolia.mantle.xyz   --private-key $PRIVATE_KEY   src/MyContract.sol:MyContract

# Verify
forge verify-contract --chain-id 5003   --verifier-url https://explorer.sepolia.mantle.xyz/api   <ADDRESS> <CONTRACT_NAME>
```

### Hardhat
```bash
# Setup
npm init -y
npm install --save-dev hardhat
npx hardhat init

# Install plugins
npm install @nomicfoundation/hardhat-toolbox
npm install @mantleio/sdk

# hardhat.config.js
module.exports = {
  networks: {
    mantleSepolia: {
      url: "https://rpc.sepolia.mantle.xyz",
      chainId: 5003,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: {
      mantleSepolia: "no-api-key-needed"
    },
    customChains: [{
      network: "mantleSepolia",
      chainId: 5003,
      urls: {
        apiURL: "https://explorer.sepolia.mantle.xyz/api",
        browserURL: "https://explorer.sepolia.mantle.xyz"
      }
    }]
  }
};
```

### Smart Contract Templates

#### AI Agent Trigger Contract
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AIAgentTrigger {
    address public aiOracle;
    mapping(bytes32 => bool) public executedSignals;

    event SignalExecuted(
        bytes32 indexed signalId,
        string action,
        uint256 amount,
        uint256 timestamp
    );

    modifier onlyOracle() {
        require(msg.sender == aiOracle, "Only AI oracle");
        _;
    }

    function executeSignal(
        bytes32 signalId,
        string calldata action,
        uint256 amount
    ) external onlyOracle {
        require(!executedSignals[signalId], "Signal already executed");
        executedSignals[signalId] = true;

        // Execute action based on signal
        // ... implementation

        emit SignalExecuted(signalId, action, amount, block.timestamp);
    }
}
```

#### On-Chain AI Inference Registry
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AIInferenceRegistry {
    struct Inference {
        bytes32 modelHash;
        bytes input;
        bytes output;
        uint256 confidence;
        uint256 timestamp;
        address agent;
    }

    mapping(bytes32 => Inference) public inferences;
    bytes32[] public inferenceIds;

    event InferenceRecorded(
        bytes32 indexed id,
        bytes32 modelHash,
        uint256 confidence
    );

    function recordInference(
        bytes32 id,
        bytes32 modelHash,
        bytes calldata input,
        bytes calldata output,
        uint256 confidence
    ) external {
        inferences[id] = Inference({
            modelHash: modelHash,
            input: input,
            output: output,
            confidence: confidence,
            timestamp: block.timestamp,
            agent: msg.sender
        });
        inferenceIds.push(id);
        emit InferenceRecorded(id, modelHash, confidence);
    }
}
```

---

## 8. Frontend & UI/UX Resources

### Recommended Stack
| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Web3** | wagmi + viem |
| **State** | Zustand / Jotai |
| **Charts** | Recharts / TradingView Lightweight Charts |
| **Animation** | Framer Motion |

### Web3 Connection (wagmi)
```typescript
import { createConfig, http } from 'wagmi'
import { mantle, mantleSepoliaTestnet } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [mantle, mantleSepoliaTestnet],
  connectors: [injected()],
  transports: {
    [mantle.id]: http('https://rpc.mantle.xyz'),
    [mantleSepoliaTestnet.id]: http('https://rpc.sepolia.mantle.xyz'),
  },
})
```

### UI Component Libraries
```bash
# shadcn/ui (recommended)
npx shadcn-ui@latest init
npx shadcn add button card dialog table

# Thirdweb (Web3 components)
npm install @thirdweb-dev/react

# RainbowKit (wallet connection)
npm install @rainbow-me/rainbowkit
```

### Demo Video Guidelines
- **Duration:** Minimum 2 minutes (untuk 20 Deployment Award)
- **Content:**
  1. Problem statement (10s)
  2. Solution demo (60s)
  3. Technical highlights (20s)
  4. On-chain verification (20s)
  5. Future roadmap (10s)
- **Tools:** Loom, OBS, Screen Studio
- **Tips:**
  - Gunakan real data (bukan mock data)
  - Show on-chain transactions di explorer
  - Highlight AI decision-making process
  - Keep it under 5 minutes

---

## 9. Data Sources & Oracles

### On-Chain Data
| Source | URL | Use Case |
|--------|-----|----------|
| **Mantle Explorer** | https://explorer.mantle.xyz | Transaction history, contract verification |
| **Mantle Sepolia Explorer** | https://explorer.sepolia.mantle.xyz | Testnet exploration |
| **The Graph** | https://thegraph.com | Indexed subgraphs for DEX, lending data |
| **Dune Analytics** | https://dune.com | SQL queries for on-chain analytics |
| **Flipside Crypto** | https://flipsidecrypto.xyz | Alternative analytics platform |

### Off-Chain Data
| Source | API | Use Case |
|--------|-----|----------|
| **Twitter/X** | Twitter API v2 | Sentiment analysis |
| **Reddit** | PRAW | Community sentiment |
| **NewsAPI** | newsapi.org | News sentiment |
| **CoinGecko** | api.coingecko.com | Price data |
| **CoinMarketCap** | pro.coinmarketcap.com | Market data |

### Oracles
| Oracle | Network | Use Case |
|--------|---------|----------|
| **Chainlink** | Mantle | Price feeds, randomness, automation |
| **Pyth Network** | Multi-chain | High-frequency price feeds |
| **API3** | Multi-chain | First-party oracles |

### Chainlink Price Feeds (Mantle)
```solidity
// Chainlink Price Feed on Mantle
address constant MNT_USD_FEED = 0x...; // Check Chainlink docs for actual address

AggregatorV3Interface priceFeed = AggregatorV3Interface(MNT_USD_FEED);
(, int256 price, , , ) = priceFeed.latestRoundData();
```

---

## 10. Deployment & DevOps

### Deployment Checklist (20 Project Deployment Award)

#### Technical Deployment
- [ ] Smart contract deployed on **Mantle Mainnet atau Testnet**
- [ ] Contract **verified** di Mantle Explorer
- [ ] Minimal **satu fungsi AI-powered callable on-chain**
  - Agent trigger
  - Inference result written on-chain
  - Automated execution

#### Product Completeness
- [ ] Frontend demo **publicly accessible** (bukan localhost)
- [ ] Deployment address **included di DoraHacks submission**
- [ ] Demo video **≥ 2 menit** walking through core use case

#### Documentation
- [ ] **Open-source GitHub repo** dengan README
- [ ] Setup instructions
- [ ] Architecture overview
- [ ] Deployed contract address

### Hosting Options
| Platform | Type | Free Tier | Best For |
|----------|------|-----------|----------|
| **Vercel** | Frontend | Generous | Next.js apps |
| **Railway** | Full-stack | $5 credit | Backend + DB |
| **Render** | Full-stack | Generous | Web services |
| **Fly.io** | Full-stack | $5 credit | Global deployment |
| **IPFS** | Static | Free | Decentralized hosting |

### CI/CD Template (GitHub Actions)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Mantle

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Deploy contracts
        run: npx hardhat run scripts/deploy.js --network mantleSepolia
        env:
          PRIVATE_KEY: ${{ secrets.PRIVATE_KEY }}

      - name: Build frontend
        run: npm run build

      - name: Deploy to Vercel
        uses: vercel/action-deploy@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

---

## 11. Submission Checklist

### DoraHacks Submission
```
□ Project Name
□ One-line Pitch
□ Detailed Description
□ Track Selection (minimal 1)
□ Open-source Repository Link
□ Demo Video Link (≥ 2 min)
□ Live Demo URL (publicly accessible)
□ Deployed Contract Address(es)
□ Team Members
□ Tech Stack
```

### GitHub Repository Structure
```
my-project/
├── README.md                 # WAJIB: Setup, architecture, contract addresses
├── contracts/                # Solidity smart contracts
│   ├── src/
│   ├── test/
│   └── script/
├── frontend/                 # React/Next.js app
│   ├── src/
│   ├── public/
│   └── package.json
├── ai/                       # AI/ML models & scripts
│   ├── models/
│   ├── data/
│   └── inference.py
├── backend/                  # API server (if needed)
│   ├── src/
│   └── package.json
├── docs/                     # Additional documentation
├── demo/                     # Demo video
└── .github/
    └── workflows/            # CI/CD
```

### README.md Template
```markdown
# [Project Name]

## One-line Pitch
[Describe your project in one sentence]

## Problem
[What problem are you solving?]

## Solution
[How does your project solve it?]

## Track
[Which track(s) are you competing in?]

## Tech Stack
- Smart Contracts: [Foundry/Hardhat + Solidity version]
- Frontend: [React/Next.js + styling]
- AI: [Python + models]
- Blockchain: [Mantle Network]

## Architecture
[Diagram or description of system architecture]

## Deployed Contracts
| Contract | Address | Network |
|----------|---------|---------|
| ContractName | 0x... | Mantle Sepolia |

## Setup Instructions
### Prerequisites
- Node.js v20+
- Python 3.11+
- Foundry/Hardhat

### Installation
\`\`\`bash
git clone https://github.com/yourusername/project.git
cd project
npm install
# etc.
\`\`\`

### Deployment
\`\`\`bash
# Deploy contracts
npx hardhat run scripts/deploy.js --network mantleSepolia

# Start frontend
npm run dev
\`\`\`

## Demo
[Link to demo video]
[Link to live demo]

## Team
- [Name] - [Role]
- [Name] - [Role]

## License
MIT
```

---

## 12. Community & Support

### Official Channels
| Platform | Link | Purpose |
|----------|------|---------|
| **Mantle Discord** | https://discord.gg/mantle | Developer support |
| **Mantle Twitter/X** | @0xMantle | Announcements |
| **Mantle Telegram** | Search "Mantle Developer" | Real-time chat |
| **DoraHacks Discord** | Check hackathon page | Hackathon support |
| **Byreal Discord** | Check byreal.io | Byreal toolkit support |

### Useful Discord Channels (Mantle)
- `#developers` — Technical questions
- `#hackathons` — Hackathon-specific
- `#showcase` — Share your project

### Getting Help
1. **Search docs first** — docs.mantle.xyz
2. **Check GitHub issues** — github.com/mantlenetworkio
3. **Ask in Discord** — dengan detail (error message, code snippet, tx hash)
4. **Tag mentors** — jika ada mentor program di hackathon

---

## 13. Quick Start Templates

### Template A: AI Trading Bot (Track 1)
```bash
# Clone scaffold
git clone https://github.com/mantle-xyz/mantle-agent-scaffold.git
cd mantle-agent-scaffold

# Install
npm install

# Configure
export PRIVATE_KEY="your_key"
export MANTLE_RPC="https://rpc.sepolia.mantle.xyz"
export BYBIT_API_KEY="your_key"
export BYBIT_SECRET="your_secret"

# Run
npm run start:trading-bot
```

### Template B: Byreal Agent (Track 6)
```bash
# Install Byreal CLI
npm install -g @byreal-io/byreal-cli

# Setup
byreal-cli setup

# Test connection
byreal-cli wallet address
byreal-cli pools list --sort-field apr24h

# Create agent script
cat > agent.js << 'EOF'
const { execSync } = require('child_process');

function getTopPools() {
  const output = execSync('byreal-cli pools list --sort-field apr24h -o json');
  return JSON.parse(output);
}

function analyzeAndTrade() {
  const pools = getTopPools();
  const topPool = pools[0];
  console.log(`Top pool: ${topPool.address} with APR ${topPool.apr24h}%`);
  // Add your AI logic here
}

analyzeAndTrade();
EOF

node agent.js
```

### Template C: On-Chain AI Inference (All Tracks)
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

contract AIAutomatedStrategy is AutomationCompatibleInterface {
    address public aiOracle;
    uint256 public lastExecution;
    uint256 public interval = 3600; // 1 hour

    struct Strategy {
        string action;      // "swap", "rebalance", "claim"
        address target;     // Target contract
        uint256 amount;     // Amount
        bytes data;         // Encoded call data
    }

    mapping(bytes32 => Strategy) public pendingStrategies;
    bytes32[] public strategyQueue;

    event StrategyProposed(bytes32 id, string action, uint256 amount);
    event StrategyExecuted(bytes32 id, bool success);

    function proposeStrategy(
        bytes32 id,
        string calldata action,
        address target,
        uint256 amount,
        bytes calldata data
    ) external {
        require(msg.sender == aiOracle, "Only AI oracle");

        pendingStrategies[id] = Strategy({
            action: action,
            target: target,
            amount: amount,
            data: data
        });
        strategyQueue.push(id);

        emit StrategyProposed(id, action, amount);
    }

    function checkUpkeep(bytes calldata) external view override returns (
        bool upkeepNeeded,
        bytes memory performData
    ) {
        upkeepNeeded = (block.timestamp - lastExecution) > interval 
                      && strategyQueue.length > 0;
        performData = abi.encode(strategyQueue[0]);
    }

    function performUpkeep(bytes calldata performData) external override {
        bytes32 id = abi.decode(performData, (bytes32));
        Strategy memory strategy = pendingStrategies[id];

        // Execute strategy
        (bool success, ) = strategy.target.call{value: strategy.amount}(strategy.data);

        // Remove from queue
        // ... (queue management logic)

        lastExecution = block.timestamp;
        emit StrategyExecuted(id, success);
    }

    receive() external payable {}
}
```

### Template D: Frontend + Web3 Connection
```typescript
// app/providers.tsx
'use client'

import { WagmiProvider, createConfig, http } from 'wagmi'
import { mantle, mantleSepoliaTestnet } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { injected } from 'wagmi/connectors'

const config = createConfig({
  chains: [mantleSepoliaTestnet, mantle],
  connectors: [injected()],
  transports: {
    [mantleSepoliaTestnet.id]: http('https://rpc.sepolia.mantle.xyz'),
    [mantle.id]: http('https://rpc.mantle.xyz'),
  },
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

// app/page.tsx
'use client'

import { useAccount, useBalance, useConnect } from 'wagmi'

export default function Home() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { data: balance } = useBalance({ address })

  return (
    <div>
      {!isConnected ? (
        <button onClick={() => connect({ connector: injected() })}>
          Connect Wallet
        </button>
      ) : (
        <div>
          <p>Address: {address}</p>
          <p>Balance: {balance?.formatted} {balance?.symbol}</p>
        </div>
      )}
    </div>
  )
}
```

---

## 📌 Quick Reference Card

```
╔══════════════════════════════════════════════════════════════╗
║           TURING TEST HACKATHON 2026 — QUICK REF            ║
╠══════════════════════════════════════════════════════════════╣
║ DEADLINE: June 15, 2026                                      ║
║ TOTAL PRIZE: $100,000 (Phase II)                             ║
║                                                              ║
║ MANTLE MAINNET                                               ║
║   RPC: https://rpc.mantle.xyz                                ║
║   Chain ID: 5000                                             ║
║   Explorer: https://explorer.mantle.xyz                      ║
║                                                              ║
║ MANTLE SEPOLIA TESTNET                                       ║
║   RPC: https://rpc.sepolia.mantle.xyz                        ║
║   Chain ID: 5003                                             ║
║   Faucet: https://faucet.sepolia.mantle.xyz/                 ║
║   Bridge: https://bridge.sepolia.mantle.xyz/                 ║
║   Explorer: https://explorer.sepolia.mantle.xyz              ║
║                                                              ║
║ BYREAL CLI                                                   ║
║   Install: npm install -g @byreal-io/byreal-cli              ║
║   Setup: byreal-cli setup                                    ║
║   Docs: https://docs.byreal.io                               ║
║                                                              ║
║ BYBIT API                                                    ║
║   Docs: https://bybit-exchange.github.io/docs/v5/intro       ║
║   SDKs: Python, TypeScript, Java, Go, .NET                   ║
║                                                              ║
║ MERCHANT MOE                                                 ║
║   Docs: https://docs.merchantmoe.com                         ║
║   Model: Liquidity Book (CLMM)                               ║
║                                                              ║
║ SUBMISSION REQUIREMENTS                                      ║
║   ✅ Deploy on Mantle (or Solana for Track 6)                ║
║   ✅ Open-source GitHub repo + README                        ║
║   ✅ Runnable frontend demo (public)                         ║
║   ✅ Demo video ≥ 2 minutes                                  ║
║   ✅ Contract verified on Explorer                           ║
║   ✅ At least one AI function callable on-chain              ║
╚══════════════════════════════════════════════════════════════╝
```

---

*Document compiled from official sources. Always verify latest information at official documentation pages.*
