export interface NetworkConfig {
  id: string;
  name: string;
  symbol: string;
}

export const networks: NetworkConfig[] = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
  },

  {
    id: 'base',
    name: 'Base',
    symbol: 'ETH',
  },

  {
    id: 'polygon',
    name: 'Polygon',
    symbol: 'POL',
  },
];