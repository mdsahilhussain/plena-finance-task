import React, { useMemo } from 'react';

interface SparklineProps {
  data: number[];
  trendPositive: boolean;
}

const Sparkline: React.FC<SparklineProps> = ({ data, trendPositive }) => {
  const height = 32;
  const width = 80;


  const min = data.length > 0 ? Math.min(...data) : 0;
  const max = data.length > 0 ? Math.max(...data) : 0;
  const range = max - min || 1;

  const points = useMemo(() => {
    if (data.length < 2) return '';
    return data
      .map((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((value - min) / range) * height;
        return `${x},${y}`;
      })
      .join(' ');
  }, [data, min, range, height, width]);

  if (!data || data.length === 0) {
    return <div className="w-20 h-8 bg-gray-100 rounded animate-pulse" />;
  }

  return (
    <svg
      width={width}
      height={height}
      className="overflow-visible"
      role="img"
    //   aria-label={`Sparkline trend chart, ${trendPositive ? 'upward' : 'downward'} trend`}
    >
      <polyline
        points={points}
        fill="none"
        stroke={trendPositive ? '#10b981' : '#ef4444'}
        strokeWidth="2"
      />
    </svg>
  );
};

export default Sparkline;
