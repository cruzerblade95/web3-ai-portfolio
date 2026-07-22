import { createConfig, http } from 'wagmi';
import { injected } from 'wagmi/connectors';
import {
  mainnet,
  base,
  polygon,
} from 'wagmi/chains';

export const config = createConfig({
  chains: [
    mainnet,
    base,
    polygon,
  ],

  connectors: [
    injected(),
  ],

  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [polygon.id]: http(),
  },
});