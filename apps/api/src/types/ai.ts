export type InsightType =
  | 'allocation'
  | 'diversification'
  | 'risk'
  | 'performance'
  | 'general';


export type InsightSeverity =
  | 'info'
  | 'warning'
  | 'positive';


export type RiskLevel =
  | 'low'
  | 'medium'
  | 'high';


export interface PortfolioInsight {
  type: InsightType;

  title: string;

  description: string;

  severity: InsightSeverity;
}


export interface AIAnalysis {
  summary: string;

  riskLevel: RiskLevel;

  insights: PortfolioInsight[];

  generatedAt: string;
}