'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar as CalendarIcon, ArrowLeft, ArrowRight, Activity as ActivityIcon } from 'lucide-react';
import { Calendar, momentLocalizer, Views, View } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/ru';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import ThemeToggle from '../components/ThemeToggle';
import ProtectedRoute from '../components/ProtectedRoute';
import { getApi } from '../utils/api';
import { HumActivity, User } from '../types/common';
import UserDropdown from '../components/UserDropdown';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';

// Настройка локализации
moment.locale('ru');
const localizer = momentLocalizer(moment);


const Navigation = ({ user, logout }: { user: User | null; logout: () => Promise<void> }) => (
  <nav className="navbar">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-semibold gradient-text">Lite CRM</Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href="/activities"
            className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover-lift flex items-center gap-2"
            style={{ color: 'var(--foreground)', background: 'transparent' }}
          >
            <ActivityIcon size={16} />
            Мои активности
          </Link>
          <Link
            href="/"
            className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover-lift"
            style={{ color: 'var(--foreground)', background: 'transparent' }}
          >
            На главную
          </Link>

          {user && <UserDropdown user={user} onLogout={logout} />}
          <ThemeToggle />
        </div>
      </div>
    </div>
  </nav>
);

interface Visit {
  id: number;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  clientName: string;
  status: string;
  resource?: string;
}

export default function CalendarPage() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>(Views.WEEK);
  const [date, setDate] = useState(new Date());
  const { user, logout } = useAuth();
  

  

  const fetchVisits = useCallback(async () => {
    try {
      if (!user) return;
      
      const data: HumActivity[] = await getApi(`/user/${user.id}/activ`);
      
      // Преобразуем активности в визиты для календаря
      const visitsData: Visit[] = data.map((activity: HumActivity) => {
        // Создаем дату из visitDate и startTime/endTime
        const visitDate = new Date(activity.visitDate);
        const startTime = activity.startTime.split(':');
        const endTime = activity.endTime.split(':');
        
        const startDateTime = new Date(visitDate);
        startDateTime.setHours(parseInt(startTime[0]), parseInt(startTime[1]), 0, 0);
        
        const endDateTime = new Date(visitDate);
        endDateTime.setHours(parseInt(endTime[0]), parseInt(endTime[1]), 0, 0);
        
        return {
          id: activity.activId,
          title: `Визит в организацию`,
          description: activity.description,
          start: startDateTime,
          end: endDateTime,
          clientName: activity.orgName,
          status: activity.statusName,
          resource: activity.orgName
        };
      });
      
      setVisits(visitsData);
    } catch (error) {
      console.error('Error fetching visits:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchVisits();
  }, [fetchVisits]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'запланирован': return '#2563eb'; // более яркий синий
      case 'открыт': return '#16a34a'; // более яркий зеленый
      case 'сохранен': return '#ea580c'; // более яркий оранжевый
      case 'закрыт': return '#6b7280'; // красный для закрытых
      default: return '#6b7280'; // серый
    }
  };

  const eventStyleGetter = (event: Visit) => {
    return {
      style: {
        backgroundColor: getStatusColor(event.status),
      }
    };
  };

  const onNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const onView = (newView: View) => {
    setView(newView);
  };

  const onSelectEvent = (event: Visit) => {
    const startTime = moment(event.start).format('HH:mm');
    const endTime = moment(event.end).format('HH:mm');
    const date = moment(event.start).format('DD.MM.YYYY');
    
    alert(`Визит: ${event.title}\nОрганизация: ${event.clientName}\nДата: ${date}\nВремя: ${startTime} - ${endTime}\nСтатус: ${event.status}${event.description ? `\nОписание: ${event.description}` : ''}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
        <div className="text-lg" style={{ color: 'var(--muted-foreground)' }}>
          Загрузка календаря...
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
    
      <Navigation user={user} logout={logout} />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Calendar */}
          <div className="card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <CalendarIcon className="w-6 h-6" style={{ color: 'var(--primary)' }} />
                  Календарь визитов
                </h2>
                <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
                  Всего визитов: {visits.length}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {/* Кнопки навигации */}
                <button
                  onClick={() => onNavigate(new Date())}
                  className="px-3 py-1 rounded-lg text-sm transition-colors"
                  style={{ 
                    background: 'var(--muted)',
                    color: 'var(--foreground)'
                  }}
                >
                  Сегодня
                </button>
                <button
                  onClick={() => onNavigate(moment(date).subtract(1, view === Views.DAY ? 'day' : view === Views.WEEK ? 'week' : 'month').toDate())}
                  className="px-3 py-1 rounded-lg text-sm transition-colors"
                  style={{ 
                    background: 'var(--muted)',
                    color: 'var(--foreground)'
                  }}
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onNavigate(moment(date).add(1, view === Views.DAY ? 'day' : view === Views.WEEK ? 'week' : 'month').toDate())}
                  className="px-3 py-1 rounded-lg text-sm transition-colors"
                  style={{ 
                    background: 'var(--muted)',
                    color: 'var(--foreground)'
                  }}
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
                
                {/* Разделитель */}
                <div className="w-px h-6" style={{ background: 'var(--border)' }}></div>
                
                {/* Кнопки видов */}
                <button
                  onClick={() => setView(Views.DAY)}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    view === Views.DAY ? 'opacity-100' : 'opacity-50'
                  }`}
                  style={{ 
                    background: view === Views.DAY ? 'var(--primary)' : 'var(--muted)',
                    color: view === Views.DAY ? 'var(--primary-foreground)' : 'var(--foreground)'
                  }}
                >
                  День
                </button>
                <button
                  onClick={() => setView(Views.WEEK)}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    view === Views.WEEK ? 'opacity-100' : 'opacity-50'
                  }`}
                  style={{ 
                    background: view === Views.WEEK ? 'var(--primary)' : 'var(--muted)',
                    color: view === Views.WEEK ? 'var(--primary-foreground)' : 'var(--foreground)'
                  }}
                >
                  Неделя
                </button>
                <button
                  onClick={() => setView(Views.MONTH)}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    view === Views.MONTH ? 'opacity-100' : 'opacity-50'
                  }`}
                  style={{ 
                    background: view === Views.MONTH ? 'var(--primary)' : 'var(--muted)',
                    color: view === Views.MONTH ? 'var(--primary-foreground)' : 'var(--foreground)'
                  }}
                >
                  Месяц
                </button>
              </div>
            </div>

            <div style={{ height: '75vh', minHeight: '400px' }}>
              <Calendar
                localizer={localizer}
                events={visits}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                view={view}
                date={date}
                onNavigate={onNavigate}
                onView={onView}
                onSelectEvent={onSelectEvent}
                eventPropGetter={eventStyleGetter}
                toolbar={false}
                step={15}
                timeslots={1}
                min={new Date(2024, 0, 1, 7, 0)}
                max={new Date(2024, 0, 1, 18, 0)}
                showMultiDayTimes={true}
              />
            </div>
          </div>
        </div>
      </main>
      </div>
    </ProtectedRoute>
  );
}
