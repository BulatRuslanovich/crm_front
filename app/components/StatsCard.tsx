'use client';

import { Users, Calendar, Clock } from 'lucide-react';
import { DashboardStats } from './types';

interface StatsCardProps {
  stats: DashboardStats;
}

export default function StatsCard({ stats }: StatsCardProps) {
  return (
    <div className="card rounded-2xl p-6 fade-in">
      <h3 className="text-xl font-semibold mb-6 gradient-text flex items-center gap-2">
        <Users className="w-5 h-5" />
        Общая статистика
      </h3>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--muted)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Частота визитов</div>
              <div className="text-lg font-semibold">{stats.avgVisitFrequency.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--muted)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Визиты в текущем месяце</div>
              <div className="text-lg font-semibold">{stats.visitsThisMonth}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--muted)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Средняя длительность</div>
              <div className="text-lg font-semibold">{stats.avgVisitDuration} мин</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
