export interface PortfolioAsset {
  id: string;
  symbol: string;
  name: string;
  network: string;
  balance: number;
  priceUsd: number;
  valueUsd: number;
  change24h: number;
  logoUrl?: string;
}

export interface PortfolioSummary {
  totalValueUsd: number;
  totalAssets: number;
  totalNetworks: number;
  change24h: number;
}

export interface PortfolioData {
  summary: PortfolioSummary;
  assets: PortfolioAsset[];
}