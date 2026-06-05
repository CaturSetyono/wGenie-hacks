'use client';

export interface MantleVaultData {
  id: string;
  name: string;
  vaultAddress: string;
  underlying: string;
  underlyingDecimals: number;
  apy7d: string | null;
  /** TVL in underlying token amount (human-readable, e.g. 7695.3 WETH) */
  tvlAmount: number | null;
  sharePriceFormatted: string | null;
  chainId: number;
}

export function useMantleVaultsData(_chainId: number) {
  // Mock data for hackathon demo
  const mockData: Record<string, MantleVaultData> = {
    USDC: {
      id: 'USDC',
      name: 'USDC Vault',
      vaultAddress: '0x0a268A0000000000000000000000000000000000',
      underlying: 'USDC',
      underlyingDecimals: 6,
      apy7d: '12.4%',
      tvlAmount: 1250000,
      sharePriceFormatted: '1.05',
      chainId: _chainId,
    },
    MNT: {
      id: 'MNT',
      name: 'MNT Vault',
      vaultAddress: '0x65e37b558f64e2be5768db46df22f93d85741a9e',
      underlying: 'MNT',
      underlyingDecimals: 18,
      apy7d: '8.2%',
      tvlAmount: 5000000,
      sharePriceFormatted: '1.02',
      chainId: _chainId,
    },
    mETH: {
      id: 'mETH',
      name: 'mETH Vault',
      vaultAddress: '0xdEAddEaDdeadDEadDEADDEAddEAddEAddead1111',
      underlying: 'WETH',
      underlyingDecimals: 18,
      apy7d: '4.1%',
      tvlAmount: 850,
      sharePriceFormatted: '1.08',
      chainId: _chainId,
    },
    USDY: {
      id: 'USDY',
      name: 'USDY',
      vaultAddress: '0x5b3B637651061C1D71542fF1c6628A6B0A89c256',
      underlying: 'USDC',
      underlyingDecimals: 6,
      apy7d: '9.5%',
      tvlAmount: 2400000,
      sharePriceFormatted: '1.01',
      chainId: _chainId,
    },
  };

  return { data: mockData, isLoading: false };
}

const MOCK_PRICES: Record<string, number> = {
  // Mantle Sepolia (5003)
  '0x0a268a0000000000000000000000000000000000': 1.0, // USDC
  '0x65e37b558f64e2be5768db46df22f93d85741a9e': 0.72, // MNT
  '0x67f1bf597478f9c37c8d7b27d93f277181154483': 0.72, // WMNT
  '0xdEAddEaDdeadDEadDEADDEAddEAddEAddead1111': 3250.0, // WETH/mETH

  // Base (8453)
  '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913': 1.0, // USDC
  '0x4200000000000000000000000000000000000006': 3250.0, // WETH
  '0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf': 95000.0, // cbBTC
  '0x60a3e35cc302bfa44cb288bc5a4f316fdb1adb42': 1.05, // EURC

  // Mantle Mainnet (5000)
  '0x09bc4e0d864851411267c6aabd1c217ef5b28394': 1.0, // USDC
  '0xdeaddeaddeaddeaddeaddeaddeaddeaddead1111': 3250.0, // WMNT or WETH dummy
};

export function useYoPrices(_chainId: number) {
  return { data: MOCK_PRICES, isLoading: false };
}
