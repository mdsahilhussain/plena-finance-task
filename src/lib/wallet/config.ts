import { mainnet, polygon, optimism, arbitrum, sepolia } from 'wagmi/chains';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';

const appName = import.meta.env.VITE_APP_NAME ?? 'TokenPortfolio';
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID as string;

export const wagmiConfig = getDefaultConfig({
  appName,
  projectId,
  chains: [mainnet, polygon, optimism, arbitrum, sepolia],
  ssr: false,
});
