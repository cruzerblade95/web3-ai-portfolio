import './App.css';

function App() {
  return (
    <div className="app">
      <header className="navbar">
        <div className="brand">
          <div className="brand-icon">◈</div>
          <span>Web3 AI Portfolio</span>
        </div>

        <button className="connect-button">
          Connect Wallet
        </button>
      </header>

      <main className="main-content">
        <section className="hero-section">
          <div>
            <p className="eyebrow">MULTI-CHAIN PORTFOLIO ANALYTICS</p>

            <h1>
              Understand your
              <span> Web3 portfolio</span>
            </h1>

            <p className="hero-description">
              Track your digital assets across multiple blockchains
              and use AI to understand your portfolio.
            </p>

            <button className="primary-button">
              Connect Wallet
            </button>
          </div>

          <div className="hero-card">
            <div className="card-header">
              <span>Portfolio Value</span>
              <span className="status-dot">● Live</span>
            </div>

            <div className="portfolio-value">
              $0.00
            </div>

            <div className="placeholder-chart">
              <div className="chart-line"></div>
            </div>

            <div className="chart-labels">
              <span>1D</span>
              <span>1W</span>
              <span>1M</span>
              <span>1Y</span>
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="feature-card">
            <div className="feature-icon">◉</div>
            <h3>Multi-Chain</h3>
            <p>
              Track your assets across multiple blockchain networks.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">◈</div>
            <h3>Portfolio Analytics</h3>
            <p>
              Understand your asset allocation and portfolio performance.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">✦</div>
            <h3>AI Assistant</h3>
            <p>
              Ask questions about your portfolio using AI-powered analysis.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;