export interface PortfolioInsight {
  type:
    | 'allocation'
    | 'diversification'
    | 'risk'
    | 'general';

  title: string;

  description: string;

  severity:
    | 'info'
    | 'warning'
    | 'positive';
}

export interface AIAnalysis {
  summary: string;

  insights: PortfolioInsight[];

  generatedAt: string;
}