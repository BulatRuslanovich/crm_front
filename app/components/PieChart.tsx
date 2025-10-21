'use client';

import { ChartData } from './types';

interface PieChartProps {
  data: ChartData[];
  size?: number;
  totalActivities: number;
}

export default function PieChart({ data, size = 200, totalActivities }: PieChartProps) {
  const radius = size / 2 - 14;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercentage = 0;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {data.map((item, index) => {
          const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
          const strokeDashoffset = -(cumulativePercentage / 100) * circumference;
          cumulativePercentage += item.percentage;

          return (
            <circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth={20}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-300 ease-out"
            />
          );
        })}
      </svg>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold gradient-text">{totalActivities}</div>
          <div className="text-sm text-gray-500">Всего активностей</div>
        </div>
      </div>
    </div>
  );
}