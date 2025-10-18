'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ThemeToggle from './components/ThemeToggle';
import UserDashboard from './components/UserDashboard';

export default function Home() {
  const [user, setUser] = useState<{firstName: string, lastName: string, middleName: string, login: string} | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      <nav className="navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold gradient-text">CRM</h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {user ? (
                <>
                  <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    Привет, {user.firstName} {user.lastName}!
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover-lift"
                    style={{ 
                      background: 'var(--error)', 
                      color: 'white',
                      border: 'none'
                    }}
                  >
                    Выйти
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover-lift"
                    style={{ 
                      color: 'var(--foreground)',
                      background: 'transparent'
                    }}
                  >
                    Войти
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover-lift"
                    style={{ 
                      background: 'var(--primary)', 
                      color: 'white'
                    }}
                  >
                    Регистрация
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {user ? (
            <UserDashboard user={user} />
          ) : (
            <div className="card rounded-xl p-8 fade-in">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4 gradient-text">
                  Добро пожаловать в CRM епта!
                </h2>
                <p className="text-lg mb-8" style={{ color: 'var(--muted-foreground)' }}>
                  Тебе необходимо войти в аккаунт или зарегистрироваться, тупень
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
