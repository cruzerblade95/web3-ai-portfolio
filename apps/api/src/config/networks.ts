import {
  ethereumAlchemy,
  baseAlchemy,
  polygonAlchemy,
} from './alchemy.js';

export interface NetworkConfig {
  id: string;
  name: string;
  nativeSymbol: string;
  client: typeof ethereumAlchemy;
}

export const networks: NetworkConfig[] = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    nativeSymbol: 'ETH',
    client: ethereumAlchemy,
  },

  {
    id: 'base',
    name: 'Base',
    nativeSymbol: 'ETH',
    client: baseAlchemy,
  },

  {
    id: 'polygon',
    name: 'Polygon',
    nativeSymbol: 'POL',
    client: polygonAlchemy,
  },
];