import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import type { PortfolioAsset } from '../../types/portfolio';

interface AllocationChartProps {
  assets: PortfolioAsset[];
}

function AllocationChart({
  assets,
}: AllocationChartProps) {
  const data = assets.map((asset) => ({
    name: asset.symbol,
    value: asset.valueUsd,
  }));

  return (
    <section className="chart-card">
      <div className="section-heading">
        <div>
          <p className="section-eyebrow">
            ANALYTICS
          </p>

          <h2>Portfolio Allocation</h2>
        </div>
      </div>

      <div className="allocation-chart">
        <ResponsiveContainer
          width="100%"
          height={260}
        >
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={55}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`hsl(${index * 100 + 230}, 70%, 60%)`}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default AllocationChart;