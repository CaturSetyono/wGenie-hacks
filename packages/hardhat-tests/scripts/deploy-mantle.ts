import 'dotenv/config';
import { createWalletClient, createPublicClient, http, parseEther, type Address, type Hex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mantleSepoliaTestnet } from 'viem/chains';
import * as fs from 'fs';
import * as path from 'path';

// =============================================================================
// Config
// =============================================================================
const CHAIN = mantleSepoliaTestnet;
const RPC_URL = process.env.RPC_URL_MANTLE_SEPOLIA;
const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;

const DEPLOY_OUTPUT = path.resolve(__dirname, '../../deployed-mantle.json');

// =============================================================================
// Clients
// =============================================================================
if (!RPC_URL) throw new Error('RPC_URL_MANTLE_SEPOLIA not set');
if (!PRIVATE_KEY) throw new Error('DEPLOYER_PRIVATE_KEY not set');

const publicClient = createPublicClient({ chain: CHAIN, transport: http(RPC_URL) });
const walletClient = createWalletClient({
  chain: CHAIN,
  transport: http(RPC_URL),
  account: privateKeyToAccount(PRIVATE_KEY as Hex),
});

// =============================================================================
// Helpers
// =============================================================================
async function deploy(name: string, abi: unknown[], bytecode: Hex, args: unknown[] = []): Promise<Address> {
  console.log(`\n  Deploying ${name}...`);
  const hash = await walletClient.deployContract({
    abi,
    bytecode,
    args,
  });
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  if (!receipt.contractAddress) throw new Error(`Deploy ${name} failed: no contractAddress`);
  console.log(`  ✓ ${name}: ${receipt.contractAddress} (tx: ${hash})`);
  return receipt.contractAddress;
}

function loadJson(path: string): Record<string, unknown> {
  try { return JSON.parse(fs.readFileSync(path, 'utf-8')); }
  catch { return {}; }
}

// =============================================================================
// Merge external contract ABIs & bytecodes
// =============================================================================
// Contracts are in external/wgenie-fusion/. If missing, run:
//   git submodule update --init --recursive
//
// For now, we require the contract artifacts to be built first:
//   cd external/wgenie-fusion && forge build

function requireContract(contractName: string): { abi: unknown[]; bytecode: Hex } {
  // Try multiple paths for the artifact
  const paths = [
    `../../external/wgenie-fusion/out/${contractName}.sol/${contractName}.json`,
    `../../external/wgenie-fusion/out/${contractName}.sol/${contractName}.json`,
    `../../node_modules/@wgenie/fusion-contracts/out/${contractName}.sol/${contractName}.json`,
  ];
  for (const p of paths) {
    try {
      const artifact = JSON.parse(fs.readFileSync(path.resolve(__dirname, p), 'utf-8'));
      return { abi: artifact.abi, bytecode: artifact.bytecode.object as Hex };
    } catch { continue; }
  }
  throw new Error(
    `Cannot find artifact for ${contractName}. Build contracts first:\n` +
    `  cd external/wgenie-fusion && forge build`
  );
}

// =============================================================================
// Main
// =============================================================================
async function main() {
  const deployer = walletClient.account.address;
  const balance = await publicClient.getBalance({ address: deployer });
  console.log(`\nChain:       ${CHAIN.name} (${CHAIN.id})`);
  console.log(`Deployer:    ${deployer}`);
  console.log(`Balance:     ${balance / 10n ** 18n} ${CHAIN.nativeCurrency.symbol}\n`);

  const deployed = loadJson(DEPLOY_OUTPUT);

  // ───────────────────────────────────────────────────────────────────────────
  // 1. FusionFactory
  // ───────────────────────────────────────────────────────────────────────────
  if (!deployed.FusionFactory) {
    const { abi, bytecode } = requireContract('FusionFactory');
    deployed.FusionFactory = await deploy('FusionFactory', abi, bytecode);
  } else {
    console.log(`  ✓ FusionFactory (cached): ${deployed.FusionFactory}`);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 2. Supply Fuses (ERC4626SupplyFuse slots 1-4)
  // ───────────────────────────────────────────────────────────────────────────
  const SUPPLY_SLOTS = ['Slot1', 'Slot2', 'Slot3', 'Slot4'];
  for (const slot of SUPPLY_SLOTS) {
    const key = `ERC4626SupplyFuse${slot}`;
    if (!deployed[key]) {
      const { abi, bytecode } = requireContract('ERC4626SupplyFuse');
      deployed[key] = await deploy(key, abi, bytecode, [deployed.FusionFactory]);
    } else {
      console.log(`  ✓ ${key} (cached): ${deployed[key]}`);
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 3. Balance Fuses (ERC4626BalanceFuse slots 1-4)
  // ───────────────────────────────────────────────────────────────────────────
  const BALANCE_SLOTS = ['Slot1', 'Slot2', 'Slot3', 'Slot4'];
  for (const slot of BALANCE_SLOTS) {
    const key = `ERC4626BalanceFuse${slot}`;
    if (!deployed[key]) {
      const { abi, bytecode } = requireContract('ERC4626BalanceFuse');
      deployed[key] = await deploy(key, abi, bytecode, [deployed.FusionFactory]);
    } else {
      console.log(`  ✓ ${key} (cached): ${deployed[key]}`);
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 4. UniversalTokenSwapperFuse
  // ───────────────────────────────────────────────────────────────────────────
  if (!deployed.UniversalTokenSwapperFuse) {
    const { abi, bytecode } = requireContract('UniversalTokenSwapperFuse');
    deployed.UniversalTokenSwapperFuse = await deploy('UniversalTokenSwapperFuse', abi, bytecode, [deployed.FusionFactory]);
  } else {
    console.log(`  ✓ UniversalTokenSwapperFuse (cached): ${deployed.UniversalTokenSwapperFuse}`);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 5. ZeroBalanceFuse
  // ───────────────────────────────────────────────────────────────────────────
  if (!deployed.ZeroBalanceFuse) {
    const { abi, bytecode } = requireContract('ZeroBalanceFuse');
    deployed.ZeroBalanceFuse = await deploy('ZeroBalanceFuse', abi, bytecode, [deployed.FusionFactory]);
  } else {
    console.log(`  ✓ ZeroBalanceFuse (cached): ${deployed.ZeroBalanceFuse}`);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Save
  // ───────────────────────────────────────────────────────────────────────────
  fs.writeFileSync(DEPLOY_OUTPUT, JSON.stringify(deployed, null, 2));
  console.log(`\n✓ Addresses saved to ${DEPLOY_OUTPUT}\n`);

  // Print summary
  console.log('\n=== Deployed Addresses (Mantle Sepolia) ===\n');
  for (const [name, addr] of Object.entries(deployed)) {
    console.log(`  ${name}: ${addr}`);
  }
  console.log();
}

main().catch((err) => {
  console.error('Deploy failed:', err);
  process.exit(1);
});
