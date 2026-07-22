import { useAccount, useConnect, useDisconnect } from 'wagmi';

function ConnectWallet() {
  const {
    address,
    isConnected,
  } = useAccount();

  const {
    connectors,
    connect,
  } = useConnect();

  const {
    disconnect,
  } = useDisconnect();

  if (isConnected && address) {
    return (
      <button
        className="connect-button"
        onClick={() => disconnect()}
      >
        {address.slice(0, 6)}...
        {address.slice(-4)}
      </button>
    );
  }

  return (
    <button
      className="connect-button"
      onClick={() => {
        const connector = connectors[0];

        if (connector) {
          connect({ connector });
        }
      }}
    >
      Connect Wallet
    </button>
  );
}

export default ConnectWallet;