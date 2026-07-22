import {
  useQuery,
} from '@tanstack/react-query';

import {
  useAccount,
} from 'wagmi';

import {
  fetchPortfolio,
} from '../lib/api';

import PortfolioSummary from '../components/portfolio/PortfolioSummary';
import AssetTable from '../components/portfolio/AssetTable';
import AllocationChart from '../components/portfolio/AllocationChart';

function Dashboard() {
  const {
    address,
    isConnected,
  } = useAccount();

  const {
    data: portfolio,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      'portfolio',
      address,
    ],

    queryFn: () => {
      if (!address) {
        throw new Error(
          'Wallet address is unavailable',
        );
      }

      return fetchPortfolio(address);
    },

    enabled: isConnected && !!address,
  });

  if (!isConnected) {
    return (
      <main className="dashboard-container">
        <div className="empty-dashboard">
          <div className="empty-icon">
            ◈
          </div>

          <h1>
            Connect your wallet
          </h1>

          <p>
            Connect your wallet to view your
            Web3 portfolio.
          </p>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="dashboard-container">
        <div className="empty-dashboard">
          <div className="loading-spinner">
            ◌
          </div>

          <h1>
            Loading portfolio
          </h1>

          <p>
            Fetching your portfolio data...
          </p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="dashboard-container">
        <div className="empty-dashboard error-state">
          <div className="empty-icon">
            !
          </div>

          <h1>
            Unable to load portfolio
          </h1>

          <p>
            {error instanceof Error
              ? error.message
              : 'Something went wrong.'}
          </p>
        </div>
      </main>
    );
  }

  if (!portfolio) {
    return null;
  }

  return (
    <main className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <p className="section-eyebrow">
            OVERVIEW
          </p>

          <h1>
            Portfolio Dashboard
          </h1>

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

              <h2>
                Portfolio Overview
              </h2>
            </div>
          </div>

          <div className="overview-content">
            <p>
              Your portfolio currently contains
              assets across{' '}
              <strong>
                {portfolio.summary.totalNetworks}
              </strong>{' '}
              blockchain networks.
            </p>

            <p>
              The largest tracked asset is{' '}
              <strong>
                {portfolio.assets[0]?.symbol ??
                  'Unknown'}
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