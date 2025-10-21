'use client';

import { useState, useEffect, useCallback } from 'react';
import ActivityChart from './ActivityChart';
import StatsCard from './StatsCard';
import { ChartData, DashboardStats } from './types';
import { getApi } from '../utils/api';
import { LoadingWrapper } from './shared/LoadingWrapper';
import { ErrorMessage } from './shared/ErrorMessage';
import { useAuth } from '../contexts/AuthContext';
import { HumActivity } from '../types/common';

export default function UserDashboard() {
  const { user } = useAuth();
  const [activityStats, setActivityStats] = useState<ChartData[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalActivities: 0,
    completedActivities: 0,
    avgVisitFrequency: 0,
    visitsThisMonth: 0,
    avgVisitDuration: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const processActivityData = useCallback((activities: HumActivity[]) => {
    const statusCounts: Record<string, number> = {};
    const uniqueOrganizations = new Set<string>();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    let visitsThisMonth = 0;
    let totalDuration = 0;
    let completedActivities = 0;

    activities.forEach(activity => {
      const status = activity.statusName.toLowerCase();
      statusCounts[status] = (statusCounts[status] || 0) + 1;

      const visitDate = new Date(activity.visitDate);
      if (
        visitDate.getMonth() === currentMonth &&
        visitDate.getFullYear() === currentYear
      ) {
        visitsThisMonth++;
      }

      const duration = calculateDuration(activity.startTime, activity.endTime);
      totalDuration += duration;

      if (status === 'закрыт') {
        completedActivities++;
        uniqueOrganizations.add(activity.orgName);
      }
    });

    const chartData = createChartData(statusCounts, activities.length);
    setActivityStats(chartData);

    setDashboardStats({
      totalActivities: activities.length,
      completedActivities,
      avgVisitFrequency:
        completedActivities > 0
          ? completedActivities / uniqueOrganizations.size
          : 0,
      visitsThisMonth,
      avgVisitDuration:
        activities.length > 0
          ? Math.round(totalDuration / activities.length)
          : 0,
    });
  }, []);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!user) {
        setError('Пользователь не авторизован');
        setLoading(false);
        return;
      }

      try {
        const activities = await getApi(`/user/${user.id}/activ`);
        processActivityData(activities);
      } catch (err) {
        setError(err instanceof Error ? err.message : '???');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [processActivityData, user]);

  const calculateDuration = (startTime: string, endTime: string): number => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    return endHour * 60 + endMin - (startHour * 60 + startMin);
  };

  const createChartData = (
    statusCounts: Record<string, number>,
    total: number
  ): ChartData[] => {
    const colors: Record<string, string> = {
      запланирован: '#3b82f6',
      открыт: '#10b981',
      сохранен: '#f59e0b',
      закрыт: '#6b7280',
    };

    return Object.entries(statusCounts).map(([status, count]) => ({
      label: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      color: colors[status] || '#9ca3af',
      percentage: Math.round((count / total) * 1000) / 10,
    }));
  };

  return (
    <LoadingWrapper loading={loading} loadingText='Загрузка данных дашборда...'>
      {error ? (
        <ErrorMessage
          message={error}
          className='card rounded-2xl p-8 text-center'
        />
      ) : (
        <div className='space-y-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            <ActivityChart
              activityStats={activityStats}
              dashboardStats={dashboardStats}
            />
            <StatsCard stats={dashboardStats} />
          </div>
        </div>
      )}
    </LoadingWrapper>
  );
}
