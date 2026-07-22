import React, { useEffect, useState } from 'react';

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

  const queryClient = useQueryClient();
  const [isRealtimeActive, setIsRealtimeActive] =
    useState(false);

  const {
    data: portfolio,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['portfolio', address],
    queryFn: async () => {
      if (!address) {
        throw new Error(
          'Wallet address is unavailable.',
        );
      }

      return fetchPortfolio(address);
    },
    enabled: isConnected && !!address,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!address || !isConnected) {
      return undefined;
    }

    const streamUrl =
      `http://localhost:3001/api/portfolio/${address}/stream`;
    const source = new EventSource(streamUrl);

    source.addEventListener('open', () => {
      setIsRealtimeActive(true);
    });

    source.addEventListener(
      'portfolio-update',
      (event) => {
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
        } catch (streamError) {
          console.error(
            'Failed to parse portfolio update:',
            streamError,
          );
        }
      },
    );

    source.addEventListener('error', () => {
      setIsRealtimeActive(false);
    });

    source.onerror = (streamError) => {
      console.error(
        'Portfolio stream error:',
        streamError,
      );
      setIsRealtimeActive(false);
      source.close();
    };

    return () => {
      setIsRealtimeActive(false);
      source.close();
    };
  }, [address, isConnected, queryClient]);

  if (!isConnected) {
    return (
      <main className="dashboard-container">
        <section className="empty-dashboard card-glow">
          <div className="empty-icon">◈</div>

          <h1>Connect your wallet</h1>

          <p>
            Connect your wallet to unlock your Web3
            portfolio dashboard, live asset tracking,
            and AI-powered insights.
          </p>
        </section>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="dashboard-container">
        <section className="empty-dashboard card-glow">
          <div className="loading-spinner">◌</div>

          <h1>Loading portfolio</h1>

          <p>
            Fetching wallet assets and blockchain data...
          </p>
        </section>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="dashboard-container">
        <section className="empty-dashboard card-glow error-state">
          <div className="empty-icon">!</div>

          <h1>Unable to load portfolio</h1>

          <p>
            {error instanceof Error
              ? error.message
              : 'Something went wrong while loading your portfolio.'}
          </p>
        </section>
      </main>
    );
  }

  if (!portfolio || !portfolio.summary) {
    return (
      <main className="dashboard-container">
        <section className="empty-dashboard card-glow">
          <div className="empty-icon">◇</div>

          <h1>No portfolio data</h1>

          <p>
            We could not find portfolio information for
            this wallet.
          </p>
        </section>
      </main>
    );
  }

  const totalValue =
    portfolio.summary.totalValueUsd.toLocaleString(
      'en-US',
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    );

  const change24h = portfolio.summary.change24h;
  const formattedChange = `${change24h >= 0 ? '+' : ''}${change24h}%`;
  const topAsset = portfolio.assets[0]?.symbol ?? 'No assets';

  return (
    <main className="dashboard-container">
      <section className="dashboard-hero card-glow">
        <div className="hero-copy">
          <p className="section-eyebrow">
            PORTFOLIO CONTROL CENTER
          </p>

          <h1>
            Your Web3
            <br />
            <span>portfolio intelligence.</span>
          </h1>

          <p className="dashboard-description">
            Monitor your connected wallet, track digital assets
            across blockchain networks, and use AI-powered insights
            to better understand your portfolio.
          </p>
        </div>

        <div className="hero-meta">
          <div
            className={
              isRealtimeActive
                ? 'status-pill live'
                : 'status-pill offline'
            }
          >
            {isRealtimeActive
              ? 'Live updates active'
              : 'Real-time offline'}
          </div>

          <div className="header-stat-card">
            <span>Connected Wallet</span>
            <strong>{address}</strong>
          </div>
        </div>
      </section>

      <PortfolioSummary summary={portfolio.summary} />

      <section className="dashboard-main-grid">
        <div className="dashboard-primary-column">
          <div className="dashboard-card-row">
            <section className="chart-card">
              <div className="section-heading">
                <div>
                  <p className="section-eyebrow">
                    ASSET ALLOCATION
                  </p>
                  <h2>Portfolio Distribution</h2>
                </div>
              </div>

              <AllocationChart assets={portfolio.assets} />
            </section>

            <AIInsights address={address ?? ''} />
          </div>
        </div>

        <aside className="dashboard-right-panel">
          <section className="activity-card">
            <div className="section-heading">
              <div>
                <p className="section-eyebrow">
                  SNAPSHOT
                </p>
                <h2>Portfolio Overview</h2>
              </div>
            </div>

            <div className="overview-content">
              <p>
                Your portfolio spans{' '}
                <strong>{portfolio.summary.totalNetworks}</strong>{' '}
                blockchain networks and tracks{' '}
                <strong>{portfolio.summary.totalAssets}</strong>{' '}
                digital assets.
              </p>

              <p>
                Your largest tracked asset is{' '}
                <strong>{topAsset}</strong>.
              </p>
            </div>

            <div className="activity-list">
              <div className="activity-item">
                <strong>${totalValue}</strong>
                <span>Total portfolio value</span>
              </div>

              <div className="activity-item">
                <strong>{portfolio.summary.totalAssets}</strong>
                <span>Assets tracked</span>
              </div>

              <div className="activity-item">
                <strong
                  className={
                    change24h >= 0
                      ? 'positive-change'
                      : 'negative-change'
                  }
                >
                  {formattedChange}
                </strong>
                <span>24-hour performance</span>
              </div>
            </div>
          </section>

          <AssetTable assets={portfolio.assets} />
        </aside>
      </section>

      <section className="table-section">
        <div className="section-heading">
          <div>
            <p className="section-eyebrow">ASSETS</p>
            <h2>Your Digital Assets</h2>
          </div>

          <span className="asset-count">
            {portfolio.assets.length} assets
          </span>
        </div>

        <AssetTable assets={portfolio.assets} />
      </section>
    </main>
  );
}

export default Dashboard;
