export interface MarketPosition {
  substrate: string;
  underlyingToken: string;
  underlyingSymbol: string;
  label?: string;
  supplyFormatted: string;
  supplyValueUsd: string;
  borrowFormatted: string;
  borrowValueUsd: string;
  totalValueUsd: string;
}

export interface MarketAllocation {
  marketId: string;
  protocol: string;
  positions: MarketPosition[];
  totalValueUsd: string;
}

export interface BalanceSnapshot {
  assets: Array<{
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    balance: string;
    balanceFormatted: string;
    priceUsd: string;
    valueUsd: string;
  }>;
  markets: MarketAllocation[];
  totalValueUsd: string;
}

export type TransactionProposalOutput = {
  type: 'transaction-proposal';
  status: 'partial' | 'ready';
  actions: Array<{
    id: string;
    protocol: string;
    actionType: string;
    description: string;
    fuseActions: Array<{ fuse: string; data: string }>;
  }>;
  newAction: {
    success: boolean;
    protocol: string;
    actionType: string;
    description: string;
    error?: string;
  };
  simulation?: {
    success: boolean;
    message: string;
    actionsCount: number;
    fuseActionsCount: number;
    balancesBefore?: BalanceSnapshot;
    balancesAfter?: BalanceSnapshot;
    error?: string;
  };
  vaultAddress: string;
  chainId: number;
  flatFuseActions: Array<{ fuse: string; data: string }>;
  actionsCount: number;
  fuseActionsCount: number;
  actionsSummary: string;
};

export type BalanceCheckOutput = {
  type: 'balance-check';
  success: boolean;
  assets: Array<{
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    balance: string;
    balanceFormatted: string;
    priceUsd: string;
    valueUsd: string;
  }>;
  markets: MarketAllocation[];
  totalValueUsd: string;
  error?: string;
};

export type AlphaToolOutput = TransactionProposalOutput | BalanceCheckOutput;
