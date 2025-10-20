'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ThemeToggle from '../components/ThemeToggle';
import UserDropdown from '../components/UserDropdown';
import { Calendar, Clock, Building2, FileText, ChevronDown, Plus, CalendarCheck, PlayCircle, CheckCircle, Trash2, Edit } from 'lucide-react';
import { checkResponse } from '../utils/errorHandler';

interface Activity {
  activId: number;
  usrId: number;
  orgName: string;
  statusName: string;
  visitDate: string;
  startTime: string;
  endTime: string;
  description: string;
}

interface User {
  firstName: string;
  lastName: string;
  middleName: string;
  login: string;
  id: number;
}


export default function ActivitiesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedActivities, setExpandedActivities] = useState<Set<number>>(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState<{id: number, name: string} | null>(null);
  const [deleting, setDeleting] = useState(false);

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
  }, []);

  const fetchActivities = async (userId: number) => {
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

      await checkResponse(response, 'Ошибка при загрузке активностей');

      const data = await response.json();
      setActivities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const toggleExpanded = (activityId: number) => {
    const newExpanded = new Set(expandedActivities);
    if (newExpanded.has(activityId)) {
      newExpanded.delete(activityId);
    } else {
      newExpanded.add(activityId);
    }
    setExpandedActivities(newExpanded);
  };

  const handleDeleteClick = (activityId: number, orgName: string) => {
    setDeleteConfirm({ id: activityId, name: orgName });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm || !user) return;
    
    setDeleting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Токен не найден');
      }

      const response = await fetch(`http://localhost:5555/api/activ/${deleteConfirm.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      await checkResponse(response, 'Ошибка при удалении активности');

      // Обновляем список активностей
      await fetchActivities(user.id);
      setDeleteConfirm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  const formatTime = (timeString: string) => {
    const time = timeString.split(':');
    return `${time[0]}:${time[1]}`;
  };

  const getStatusStyle = (statusName: string) => {
    switch (statusName.toLowerCase()) {
      case 'запланирован':
        return {
          background: 'rgba(59, 130, 246, 0.1)',
          color: 'rgb(59, 130, 246)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          icon: CalendarCheck
        };
      case 'открыт':
        return {
          background: 'rgba(34, 197, 94, 0.1)',
          color: 'rgb(34, 197, 94)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          icon: PlayCircle
        };
      case 'сохранен':
        return {
          background: 'rgba(245, 158, 11, 0.1)',
          color: 'rgb(245, 158, 11)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          icon: FileText
        };
      case 'закрыт':
        return {
          background: 'rgba(107, 114, 128, 0.1)',
          color: 'rgb(107, 114, 128)',
          border: '1px solid rgba(107, 114, 128, 0.3)',
          icon: CheckCircle
        };
      default:
        return {
          background: 'rgba(156, 163, 175, 0.1)',
          color: 'rgb(156, 163, 175)',
          border: '1px solid rgba(156, 163, 175, 0.3)',
          icon: CalendarCheck
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
        <nav className="navbar">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="text-xl font-semibold gradient-text">CRM</Link>
              </div>
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <Link
                  href="/"
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover-lift"
                  style={{ 
                    color: 'var(--foreground)',
                    background: 'transparent'
                  }}
                >
                  На главную
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="card rounded-xl p-8 fade-in text-center">
              <div className="text-lg">Загрузка активностей...</div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
        <nav className="navbar">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="text-xl font-semibold gradient-text">CRM</Link>
              </div>
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <Link
                  href="/"
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover-lift"
                  style={{ 
                    color: 'var(--foreground)',
                    background: 'transparent'
                  }}
                >
                  На главную
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="card rounded-xl p-8 fade-in text-center">
              <div className="text-lg" style={{ color: 'var(--error)' }}>{error}</div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      <nav className="navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-semibold gradient-text">CRM</Link>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {user ? (
                <>
                  <Link
                    href="/"
                    className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover-lift"
                    style={{ 
                      color: 'var(--foreground)',
                      background: 'transparent'
                    }}
                  >
                    На главную
                  </Link>
                
                  <UserDropdown user={user} onLogout={handleLogout} />
                </>
              ) : (
                <Link
                  href="/"
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover-lift"
                  style={{ 
                    color: 'var(--foreground)',
                    background: 'transparent'
                  }}
                >
                  На главную
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold gradient-text mb-2">Мои активности</h1>
                <p className="text-lg" style={{ color: 'var(--muted-foreground)' }}>
                  Список всех ваших активностей
                </p>
              </div>
              <Link
                href="/activities/create"
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover-lift flex items-center gap-2"
                style={{ 
                  background: 'var(--primary)', 
                  color: 'white'
                }}
              >
                <Plus size={16} />
                Создать активность
              </Link>
            </div>
          </div>

          {activities.length === 0 ? (
            <div className="card rounded-xl p-8 fade-in text-center">
              <div className="text-lg" style={{ color: 'var(--muted-foreground)' }}>
                У вас пока нет активностей
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {activities.map((activity) => (
                <div key={activity.activId} className="card rounded-lg p-4 fade-in hover-lift transition-all duration-200">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleExpanded(activity.activId)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1 min-w-0">
                      {/* Дата и время */}
                      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        <Calendar size={16} />
                        <span className="whitespace-nowrap">{formatDate(activity.visitDate)}</span>
                        <Clock size={16} />
                        <span className="whitespace-nowrap">{formatTime(activity.startTime)}-{formatTime(activity.endTime)}</span>
                      </div>
                      
                      {/* Организация */}
                      <div className="flex items-center gap-2 text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>
                        <Building2 size={16} />
                        <span>{activity.orgName}</span>
                      </div>
                    </div>
                    
                    {/* Статус и кнопки */}
                    <div className="ml-4 flex items-center gap-3">
                      {/* Статус */}
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 whitespace-nowrap"
                        style={getStatusStyle(activity.statusName)}
                      >
                        {(() => {
                          const IconComponent = getStatusStyle(activity.statusName).icon;
                          return <IconComponent size={14} />;
                        })()}
                        {activity.statusName}
                      </span>
                      
                      {/* Кнопка редактирования */}
                      <Link
                        href={`/activities/edit/${activity.activId}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 rounded-lg transition-all duration-200 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                        style={{ color: 'var(--primary)' }}
                        title="Редактировать активность"
                      >
                        <Edit size={16} />
                      </Link>
                      
                      {/* Кнопка удаления */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(activity.activId, activity.orgName);
                        }}
                        className="p-1 rounded-lg transition-all duration-200 hover:bg-red-100 dark:hover:bg-red-900/20"
                        style={{ color: 'var(--error)' }}
                        title="Удалить активность"
                      >
                        <Trash2 size={16} />
                      </button>
                      
                      {/* Кнопка раскрытия */}
                      <ChevronDown 
                        size={20} 
                        className="transition-transform duration-200" 
                        style={{ 
                          transform: expandedActivities.has(activity.activId) ? 'rotate(180deg)' : 'rotate(0deg)' 
                        }} 
                      />
                    </div>
                  </div>
                  
                  {/* Раскрытое описание */}
                  {expandedActivities.has(activity.activId) && activity.description && (
                    <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--muted)' }}>
                      <div className="flex items-start gap-2">
                        <FileText size={16} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--muted-foreground)' }} />
                        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                          {activity.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Модальное окно подтверждения удаления */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="card rounded-xl p-6 max-w-md mx-4">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <Trash2 size={24} style={{ color: 'var(--error)' }} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Удалить активность?</h3>
              <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>
                Вы уверены, что хотите удалить активность для организации &quot;{deleteConfirm.name}&quot;? 
                Это действие нельзя отменить.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteCancel}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover-lift"
                  style={{ 
                    color: 'var(--foreground)',
                    background: 'transparent',
                    border: '1px solid var(--muted)'
                  }}
                >
                  Отмена
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover-lift flex items-center justify-center gap-2"
                  style={{ 
                    background: 'var(--error)', 
                    color: 'white'
                  }}
                >
                  <Trash2 size={16} />
                  {deleting ? 'Удаление...' : 'Удалить'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
