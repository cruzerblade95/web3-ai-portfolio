import React, {
  useEffect,
  useState,
} from 'react';

import {
  useQuery,
  useQueryClient,
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
import AIInsights from '../components/portfolio/AIInsights';

function Dashboard() {
  const {
    address,
    isConnected,
  } = useAccount();

  const [isRealtimeActive, setIsRealtimeActive] =
    useState(false);

  const queryClient =
    useQueryClient();

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

  React.useEffect(() => {
    if (
      !address ||
      !isConnected
    ) {
      return undefined;
    }

    const source = new EventSource(
      `http://localhost:3001/api/portfolio/${address}/stream`,
    );

    source.addEventListener(
      'open',
      () => {
        setIsRealtimeActive(true);
      },
    );

    source.addEventListener(
      'portfolio-update',
      async (event) => {
        try {
          const portfolioUpdate =
            JSON.parse(
              (event as MessageEvent)
                .data,
            );
          queryClient.setQueryData(
            ['portfolio', address],
            portfolioUpdate,
          );
        } catch (error) {
          console.error(
            'Failed to parse portfolio update',
            error,
          );
        }
      },
    );

    source.addEventListener(
      'error',
      () => {
        setIsRealtimeActive(false);
      },
    );

    source.onerror = (error) => {
      console.error(
        'Portfolio stream error',
        error,
      );
      setIsRealtimeActive(false);
      source.close();
    };

    return () => {
      setIsRealtimeActive(false);
      source.close();
    };
  }, [
    address,
    isConnected,
    queryClient,
  ]);

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

        <div
          className={`realtime-badge ${
            isRealtimeActive
              ? 'active'
              : 'inactive'
          }`}
        >
          {isRealtimeActive
            ? 'Live updates active'
            : 'Real-time offline'}
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

      <AIInsights
        address={address ?? ''}
      />

        <AssetTable
        assets={portfolio.assets}
        />
    </main>
  );
}

export default Dashboard;