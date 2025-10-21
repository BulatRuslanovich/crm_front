'use client';

import Link from 'next/link';
import ThemeToggle from './components/ThemeToggle';
import UserDashboard from './components/UserDashboard';
import UserDropdown from './components/UserDropdown';
import { useAuth } from './contexts/AuthContext';
import { Activity, Calendar } from 'lucide-react';

export default function Home() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      <nav className="navbar relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold gradient-text flex items-center gap-2">
                Lite CRM
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated && user &&
                <>
                  <Link
                    href="/activities"
                    className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover-lift flex items-center gap-2"
                    style={{ 
                      color: 'var(--foreground)',
                      background: 'transparent'
                    }}
                  >
                    <Activity size={16} />
                    Мои активности
                  </Link>
                  
                  <Link
                    href="/calendar"
                    className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover-lift flex items-center gap-2"
                    style={{ 
                      color: 'var(--foreground)',
                      background: 'transparent'
                    }}
                  >
                    <Calendar size={16} />
                    Календарь
                  </Link>
                  
                  <UserDropdown user={user} onLogout={logout} />
                  <ThemeToggle />
                </>}
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-0">
        {isAuthenticated && user ? (
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <UserDashboard />
            </div>
          </div>
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full text-center">
              <div className="card rounded-xl p-8 fade-in">
                <div className="mb-8">
                  <h1 className="text-4xl font-bold gradient-text mb-4">
                    CRM Система
                  </h1>
                  <p className="text-lg" style={{ color: 'var(--muted-foreground)' }}>
                    Управление фармацевтическим бизнесом
                  </p>
                </div>
                
                <div className="space-y-4">
                  <Link
                    href="/login"
                    className="form-button hover-lift flex items-center justify-center gap-2 w-full px-4 py-3 text-base bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
                  >
                    Войти
                  </Link>
                  
                  <Link
                    href="/register"
                    className="form-button hover-lift flex items-center justify-center gap-2 w-full px-4 py-3 text-base"
                    style={{ 
                      background: 'transparent',
                      border: '2px solid var(--border)',
                      color: 'var(--foreground)'
                    }}
                  >
                    Регистрация
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
