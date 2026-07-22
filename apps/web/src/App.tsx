import './App.css';

import ConnectWallet from './components/wallet/ConnectWallet';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="app">
      <header className="navbar">
        <div className="brand">
          <div className="brand-icon">
            ◈
          </div>

          <span>
            Web3 AI Portfolio
          </span>
        </div>

        <ConnectWallet />
      </header>

      <Dashboard />
    </div>
  );
}

export default App;