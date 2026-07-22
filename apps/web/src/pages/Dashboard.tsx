import { mockPortfolio } from '../lib/mockPortfolio';

import PortfolioSummary from '../components/portfolio/PortfolioSummary';
import AssetTable from '../components/portfolio/AssetTable';
import AllocationChart from '../components/portfolio/AllocationChart';

function Dashboard() {
  const portfolio = mockPortfolio;

  return (
    <main className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <p className="section-eyebrow">
            OVERVIEW
          </p>

          <h1>Portfolio Dashboard</h1>

          <p className="dashboard-description">
            Track and understand your multi-chain
            digital asset portfolio.
          </p>
        </div>
      </div>

      <PortfolioSummary
        summary={portfolio.summary}
      />

      <section className="analytics-grid">
        <AllocationChart
          assets={portfolio.assets}
        />

        <section className="chart-card">
          <div className="section-heading">
            <div>
              <p className="section-eyebrow">
                INSIGHTS
              </p>

              <h2>Portfolio Overview</h2>
            </div>
          </div>

          <div className="overview-content">
            <p>
              Your portfolio currently contains assets
              across {portfolio.summary.totalNetworks}
              blockchain networks.
            </p>

            <p>
              The largest tracked asset is{' '}
              <strong>
                {portfolio.assets[0]?.symbol}
              </strong>.
            </p>
          </div>
        </section>
      </section>

      <AssetTable
        assets={portfolio.assets}
      />
    </main>
  );
}

export default Dashboard;