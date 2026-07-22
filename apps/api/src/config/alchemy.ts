import {
  Alchemy,
  Network,
} from 'alchemy-sdk';

const apiKey =
  process.env.ALCHEMY_API_KEY;

if (!apiKey) {
  throw new Error(
    'ALCHEMY_API_KEY is not configured',
  );
}

export const alchemy =
  new Alchemy({
    apiKey,
    network: Network.ETH_MAINNET,
  });