import type { PortfolioSummary as PortfolioSummaryType } from '../../types/portfolio';

interface PortfolioSummaryProps {
  summary: PortfolioSummaryType;
}

function PortfolioSummary({
  summary,
}: PortfolioSummaryProps) {
  return (
    <section className="summary-grid">
      <div className="summary-card primary-summary-card">
        <span className="summary-label">
          Total Portfolio Value
        </span>

        <strong className="summary-value">
          ${summary.totalValueUsd.toLocaleString(
            'en-US',
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            },
          )}
        </strong>

        <span className="positive-change">
          +{summary.change24h}%
          <span> today</span>
        </span>
      </div>

      <div className="summary-card">
        <span className="summary-label">
          Total Assets
        </span>

        <strong className="summary-value">
          {summary.totalAssets}
        </strong>
      </div>

      <div className="summary-card">
        <span className="summary-label">
          Networks
        </span>

        <strong className="summary-value">
          {summary.totalNetworks}
        </strong>
      </div>
    </section>
  );
}

export default PortfolioSummary;