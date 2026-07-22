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

export const ethereumAlchemy =
  new Alchemy({
    apiKey,
    network: Network.ETH_MAINNET,
  });

export const baseAlchemy =
  new Alchemy({
    apiKey,
    network: Network.BASE_MAINNET,
  });

export const polygonAlchemy =
  new Alchemy({
    apiKey,
    network: Network.MATIC_MAINNET,
  });