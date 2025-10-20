'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ThemeToggle from './components/ThemeToggle';
import UserDashboard from './components/UserDashboard';
import UserDropdown from './components/UserDropdown';
import { ArrowRight, Sparkles, Pill, BarChart3, Activity, MapPin, Clock } from 'lucide-react';

export default function Home() {
  const [user, setUser] = useState<{id: number, firstName: string, lastName: string, middleName: string, login: string} | null>(null);
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

  const features = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Автоматическая фиксация визитов",
      description: "Геолокация, время и длительность визитов с объективными дашбордами для реальной картины работы"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Снижение рутины на 70%",
      description: "Автоотчеты и планирование освобождают время для ценной работы с врачами"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Полная отчетность",
      description: "Модуль аналитики с настроенными отчетами и дашбордами для всех уровней"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Плавающие декоративные элементы */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full opacity-10 gradient-bg animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 rounded-full opacity-10 gradient-bg animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-12 h-12 rounded-full opacity-10 gradient-bg animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-24 h-24 rounded-full opacity-10 gradient-bg animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <nav className="navbar relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold gradient-text flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                CRM
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {user ? (
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
                  
                  <UserDropdown user={user} onLogout={handleLogout} />
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
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover-lift flex items-center gap-2"
                    style={{ 
                      background: 'var(--primary)', 
                      color: 'white'
                    }}
                  >
                    Регистрация
                    <ArrowRight size={16} />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-0">
        {user ? (
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <UserDashboard />
            </div>
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto text-center">
                <div className="fade-in">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                    <Pill className="w-4 h-4" />
                    Специализированная CRM для фармацевтики
                  </div>
                  
                  <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text-animated">
                    Управляй фармацевтическим
                    <br />
                    <span className="text-4xl md:text-5xl float-animation">бизнесом</span>
                  </h1>
                  
                  <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto" style={{ color: 'var(--muted-foreground)' }}>
                    Профессиональная CRM система для фармацевтических компаний. 
                    Управляйте медпредставителями, препаратами и соблюдайте все регуляторные требования.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                      href="/register"
                      className="px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 hover-lift flex items-center gap-2 gradient-button glow-effect"
                      style={{ 
                        color: 'var(--foreground)'
                      }}
                    >
                      Начать бесплатно
                      <ArrowRight size={20} />
                    </Link>
                    <Link
                      href="/login"
                      className="px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 hover-lift"
                      style={{ 
                        color: 'var(--foreground)',
                        background: 'transparent',
                        border: '2px solid var(--border)'
                      }}
                    >
                      Уже есть аккаунт?
                    </Link>
                  </div>
                </div>
              </div>
            </section>


            {/* Features Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--muted)' }}>
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold gradient-text mb-4">
                    Почему фармацевтические компании выбирают нас?
                  </h2>
                  <p className="text-xl" style={{ color: 'var(--muted-foreground)' }}>
                    Специализированные решения для фармацевтической индустрии
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {features.map((feature, index) => (
                    <div key={index} className="card rounded-2xl p-8 text-center card-hover scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="w-16 h-16 mx-auto mb-6 rounded-2xl gradient-bg flex items-center justify-center text-white float-animation" style={{ animationDelay: `${index * 0.2}s` }}>
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-4 gradient-text">{feature.title}</h3>
                      <p style={{ color: 'var(--muted-foreground)' }}>{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
