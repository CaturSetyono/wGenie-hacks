import type { Meta, StoryObj } from '@storybook/react';
import { WalletDecorator } from '@/app/wallet.decorator';
import { TreasuryOverview } from './treasury-overview';

const meta: Meta<typeof TreasuryOverview> = {
  title: 'WalletGenie Treasury / Chat',
  component: TreasuryOverview,
  decorators: [WalletDecorator],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof TreasuryOverview>;

export const Default: Story = {
  args: {
    chainId: 8453,
    vaultAddress: '0x09d1C2E03F73853916Ee86b4e1A729F9FbAA960D',
  },
};
