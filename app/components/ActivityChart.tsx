'use client';

import { Activity } from 'lucide-react';
import PieChart from './PieChart';
import { ChartData, DashboardStats } from './types';

interface ActivityChartProps {
  activityStats: ChartData[];
  dashboardStats: DashboardStats;
}

export default function ActivityChart({ activityStats, dashboardStats }: ActivityChartProps) {

  return (
    <div className="card rounded-2xl p-6 fade-in">
      <h3 className="text-xl font-semibold mb-6 gradient-text flex items-center gap-2">
        <Activity className="w-5 h-5" />
        Статусы активностей
      </h3>
      
      <div className="flex items-center justify-center mb-6">
        <PieChart 
          data={activityStats} 
          size={300} 
          totalActivities={dashboardStats.totalActivities}
        />
      </div>
      
      <div className="space-y-3">
        {activityStats.map((item, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between p-2 rounded-lg transition-all duration-200 cursor-pointer"
            style={{
              color: 'var(--input-foreground)'
            }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full transition-all duration-200" 
                style={{ 
                  backgroundColor: item.color,
                }}
              ></div>
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            <div className="text-sm font-semibold">{item.value} ({(item.value / dashboardStats.totalActivities * 100).toFixed(2)}%)</div>
          </div>
        ))}
      </div>
    </div>
  );
}
