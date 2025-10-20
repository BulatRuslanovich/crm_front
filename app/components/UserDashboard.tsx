'use client';

import { useState, useEffect, useCallback } from 'react';
import ActivityChart from './ActivityChart';
import StatsCard from './StatsCard';
import { Activity, User, ChartData, DashboardStats } from './types';

export default function UserDashboard() {
  const [, setUser] = useState<User | null>(null);
  const [, setActivities] = useState<Activity[]>([]);
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

  const fetchActivities = useCallback(async (userId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Токен не найден');
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:5555/api/user/${userId}/activ`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка при загрузке активностей');
      }

      const data = await response.json();
      setActivities(data);
      processActivityData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchActivities(parsedUser.id);
    } else {
      setError('Пользователь не авторизован');
      setLoading(false);
    }
  }, [fetchActivities]);

  const processActivityData = (activities: Activity[]) => {
    // Подсчет статусов
    const statusCounts: { [key: string]: number } = {};
    const uniqueOrganizations = new Set<string>();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    let visitsThisMonth = 0;
    let totalDuration = 0;
    let completedActivities = 0;

    activities.forEach(activity => {
      // Подсчет статусов
      const status = activity.statusName.toLowerCase();
      statusCounts[status] = (statusCounts[status] || 0) + 1;

      // Визиты в текущем месяце
      const visitDate = new Date(activity.visitDate);
      if (visitDate.getMonth() === currentMonth && visitDate.getFullYear() === currentYear) {
        visitsThisMonth++;
      }

      // Длительность визита
      const startTime = new Date(`2000-01-01T${activity.startTime}`);
      const endTime = new Date(`2000-01-01T${activity.endTime}`);
      const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60); // в минутах
      totalDuration += duration;

      // Завершенные активности
      if (status === 'закрыт') {
        completedActivities++;
        uniqueOrganizations.add(activity.orgName);
      }
    });

    // Создание данных для круговой диаграммы
    const totalActivities = activities.length;
    const chartData: ChartData[] = [];

    // Цвета для статусов
    const statusColors: { [key: string]: string } = {
      'запланирован': '#3b82f6',  // Синий
      'открыт': '#10b981',         // Зеленый
      'сохранен': '#f59e0b',       // Оранжевый
      'закрыт': '#6b7280'          // Серый
    };

    Object.entries(statusCounts).forEach(([status, count]) => {
      const percentage = totalActivities > 0 ? (count / totalActivities) * 100 : 0;
      chartData.push({
        label: status.charAt(0).toUpperCase() + status.slice(1),
        value: count,
        color: statusColors[status] || '#9ca3af',
        percentage: Math.round(percentage * 10) / 10
      });
    });

    setActivityStats(chartData);

    // Обновление статистики
    const avgVisitDuration = activities.length > 0 ? Math.round(totalDuration / activities.length) : 0;
  
    setDashboardStats({
      totalActivities,
      completedActivities,
      avgVisitFrequency: completedActivities > 0 ? completedActivities / uniqueOrganizations.size : 0,
      visitsThisMonth,
      avgVisitDuration
    });
  };

  return (
    <div className="space-y-8">
      {loading ? (
        <div className="card rounded-2xl p-8 fade-in text-center">
          <div className="text-lg" style={{ color: 'var(--muted-foreground)' }}>
            Загрузка данных дашборда...
          </div>
        </div>
      ) : error ? (
        <div className="card rounded-2xl p-8 fade-in text-center">
          <div className="text-lg" style={{ color: 'var(--error)' }}>
            {error}
          </div>
        </div>
      ) : (
        <>
          {/* Дашборд с метриками */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ActivityChart 
              activityStats={activityStats} 
              dashboardStats={dashboardStats} 
            />
            <StatsCard stats={dashboardStats} />
          </div>
        </>
      )}
    </div>
  );
}
