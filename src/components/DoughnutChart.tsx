import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, type ChartOptions } from 'chart.js';


ChartJS.register(ArcElement, Tooltip, Legend);

type PortfolioItem = {
  id: string;
  name: string;
  symbol: string;
  holdings: number;
  value: number;
};

interface DoughnutChartProps {
  portfolioData: PortfolioItem[];
  colors: string[];
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ portfolioData, colors }) => {
  const labels = useMemo(() => portfolioData?.map((coin) => coin.name) || [], [portfolioData]);
  const values = useMemo(() => portfolioData?.map((coin) => coin.value) || [], [portfolioData]);

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: 'Portfolio',
          data: values,
          backgroundColor: colors,
          borderColor: colors.map((c) => c.replace('0.6', '1')),
          borderWidth: 1,
        },
      ],
    }),
    [labels, values, colors]
  );

  const options: ChartOptions<'doughnut'> = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (tooltipItem) => {
              const total = values.reduce((acc, val) => acc + val, 0);
              const currentValue = values[tooltipItem.dataIndex];
              const percentage = ((currentValue / total) * 100).toFixed(2);
              return `${labels[tooltipItem.dataIndex]}: ${percentage}%`;
            },
          },
        },
      },
    }),
    [labels, values]
  );

  if (!portfolioData || portfolioData.length === 0) {
    return <p className="text-sm text-gray-400">No portfolio data available</p>;
  }

  return (
    <div className="w-[200px]" role="img" aria-label="Portfolio distribution chart">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DoughnutChart;
