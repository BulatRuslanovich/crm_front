'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ThemeToggle from '../components/ThemeToggle';
import UserDropdown from '../components/UserDropdown';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';
import {
  Calendar,
  Clock,
  Building2,
  FileText,
  Plus,
  CalendarCheck,
  PlayCircle,
  CheckCircle,
} from 'lucide-react';
import { getApi } from '../utils/api';
import { HumActivity, User } from '../types/common';
import { LoadingWrapper } from '../components/shared/LoadingWrapper';
import { ErrorMessage } from '../components/shared/ErrorMessage';
import { formatters } from '../utils/common';

const Navigation = ({
  user,
  logout,
}: {
  user: User | null;
  logout: () => Promise<void>;
}) => (
  <nav className='navbar'>
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <div className='flex justify-between h-16'>
        <div className='flex items-center'>
          <Link href='/' className='text-xl font-semibold gradient-text'>
            Lite CRM
          </Link>
        </div>
        <div className='flex items-center space-x-4'>
          <ThemeToggle />

          <Link
            href='/calendar'
            className='px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover-lift flex items-center gap-2'
            style={{ color: 'var(--foreground)', background: 'transparent' }}
          >
            <Calendar size={16} />
            Календарь
          </Link>
          <Link
            href='/'
            className='px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover-lift'
            style={{ color: 'var(--foreground)', background: 'transparent' }}
          >
            На главную
          </Link>

          {user && <UserDropdown user={user} onLogout={logout} />}
        </div>
      </div>
    </div>
  </nav>
);

export default function ActivitiesPage() {
  const { user, logout } = useAuth();
  const [activities, setActivities] = useState<HumActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchActivities(user.id);
    }
  }, [user]);

  const fetchActivities = async (userId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getApi(`/user/${userId}/activ`);
      setActivities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (statusName: string) => {
    switch (statusName.toLowerCase()) {
      case 'запланирован':
        return {
          background: 'rgba(59, 130, 246, 0.1)',
          color: 'rgb(59, 130, 246)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          icon: CalendarCheck,
        };
      case 'открыт':
        return {
          background: 'rgba(34, 197, 94, 0.1)',
          color: 'rgb(34, 197, 94)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          icon: PlayCircle,
        };
      case 'сохранен':
        return {
          background: 'rgba(245, 158, 11, 0.1)',
          color: 'rgb(245, 158, 11)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          icon: FileText,
        };
      case 'закрыт':
        return {
          background: 'rgba(107, 114, 128, 0.1)',
          color: 'rgb(107, 114, 128)',
          border: '1px solid rgba(107, 114, 128, 0.3)',
          icon: CheckCircle,
        };
      default:
        return {
          background: 'rgba(156, 163, 175, 0.1)',
          color: 'rgb(156, 163, 175)',
          border: '1px solid rgba(156, 163, 175, 0.3)',
          icon: CalendarCheck,
        };
    }
  };

  return (
    <ProtectedRoute>
      <div
        className='min-h-screen'
        style={{ background: 'var(--background)', color: 'var(--foreground)' }}
      >
        <Navigation user={user} logout={logout} />

        <main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
          <div className='px-4 py-6 sm:px-0'>
            <LoadingWrapper
              loading={loading}
              loadingText='Загрузка активностей...'
            >
              {error ? (
                <ErrorMessage
                  message={error}
                  className='card rounded-xl p-8 text-center'
                />
              ) : (
                <>
                  <div className='mb-8'>
                    <div className='flex justify-between items-start mb-4'>
                      <div>
                        <h1 className='text-3xl font-bold gradient-text mb-2'>
                          Мои активности
                        </h1>
                        <p
                          className='text-lg'
                          style={{ color: 'var(--muted-foreground)' }}
                        >
                          Список всех ваших активностей
                        </p>
                      </div>
                      <Link
                        href='/activities/create'
                        className='px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover-lift flex items-center gap-2'
                        style={{ background: 'var(--primary)', color: 'white' }}
                      >
                        <Plus size={16} />
                        Создать активность
                      </Link>
                    </div>
                  </div>

                  {activities.length === 0 ? (
                    <div className='card rounded-xl p-8 fade-in text-center'>
                      <div
                        className='text-lg'
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        У вас пока нет активностей
                      </div>
                    </div>
                  ) : (
                    <div className='space-y-2'>
                      {activities.map(activity => (
                        <div
                          key={activity.activId}
                          className='card rounded-lg p-4 fade-in hover-lift transition-all duration-200'
                        >
                          <div className='flex items-center justify-between'>
                            <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1 min-w-0'>
                              <div
                                className='flex items-center gap-2 text-sm'
                                style={{ color: 'var(--muted-foreground)' }}
                              >
                                <Calendar size={16} />
                                <span className='whitespace-nowrap'>
                                  {formatters.formatDate(activity.visitDate)}
                                </span>
                                <Clock size={16} />
                                <span className='whitespace-nowrap'>
                                  {formatters.formatTime(activity.startTime)}-
                                  {formatters.formatTime(activity.endTime)}
                                </span>
                              </div>

                              <div
                                className='flex items-center gap-2 text-sm font-medium truncate'
                                style={{ color: 'var(--foreground)' }}
                              >
                                <Building2 size={16} />
                                <span>{activity.orgName}</span>
                              </div>
                            </div>

                            <div className='ml-4 flex items-center gap-3'>
                              <span
                                className='px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 whitespace-nowrap'
                                style={getStatusStyle(activity.statusName)}
                              >
                                {(() => {
                                  const IconComponent = getStatusStyle(
                                    activity.statusName
                                  ).icon;
                                  return <IconComponent size={14} />;
                                })()}
                                {activity.statusName}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </LoadingWrapper>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
