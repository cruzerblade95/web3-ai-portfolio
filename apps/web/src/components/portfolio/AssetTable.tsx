import type { PortfolioAsset } from '../../types/portfolio';

interface AssetTableProps {
  assets: PortfolioAsset[];
}

function AssetTable({
  assets,
}: AssetTableProps) {
  return (
    <section className="assets-section">
      <div className="section-heading">
        <div>
          <p className="section-eyebrow">
            PORTFOLIO
          </p>

          <h2>Your Assets</h2>
        </div>

        <span className="asset-count">
          {assets.length} assets
        </span>
      </div>

      <div className="table-wrapper">
        <table className="asset-table">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Network</th>
              <th>Balance</th>
              <th>Price</th>
              <th>Value</th>
              <th>24h</th>
            </tr>
          </thead>

          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id}>
                <td>
                  <div className="asset-name">
                    <div className="asset-icon">
                      {asset.symbol.slice(0, 1)}
                    </div>

                    <div>
                      <strong>{asset.symbol}</strong>
                      <span>{asset.name}</span>
                    </div>
                  </div>
                </td>

                <td>
                  <span className="network-badge">
                    {asset.network}
                  </span>
                </td>

                <td>
                  {asset.balance.toLocaleString()}
                </td>

                <td>
                  ${asset.priceUsd.toLocaleString()}
                </td>

                <td>
                  <strong>
                    ${asset.valueUsd.toLocaleString()}
                  </strong>
                </td>

                <td>
                  <span
                    className={
                      asset.change24h >= 0
                        ? 'positive-change'
                        : 'negative-change'
                    }
                  >
                    {asset.change24h >= 0 ? '+' : ''}
                    {asset.change24h}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AssetTable;