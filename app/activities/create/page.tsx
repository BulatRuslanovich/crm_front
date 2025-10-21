'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from '../../components/ThemeToggle';
import OrganizationSearch from '../../components/OrganizationSearch';
import { Calendar, Clock, FileText, Plus, ArrowLeft } from 'lucide-react';

interface User {
  firstName: string;
  lastName: string;
  middleName: string;
  login: string;
  id: number;
}

interface Organization {
  orgId: number;
  name: string;
  inn: string;
  latitude: number;
  longitude: number;
  address: string;
}

interface CreateActivityForm {
  orgId: number;
  visitDate: string;
  startTime: string;
  endTime: string;
  description: string;
}

export default function CreateActivityPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<CreateActivityForm>({
    orgId: 0,
    visitDate: '',
    startTime: '',
    endTime: '',
    description: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setLoading(false);
    } else {
      setError('Пользователь не авторизован');
      setLoading(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token || !user) {
        throw new Error('Не авторизован');
      }

      // Валидация
      if (!selectedOrg) {
        throw new Error('Выберите организацию');
      }
      if (!formData.visitDate) {
        throw new Error('Выберите дату визита');
      }
      if (!formData.startTime) {
        throw new Error('Выберите время начала');
      }
      if (!formData.endTime) {
        throw new Error('Выберите время окончания');
      }
      if (formData.startTime >= formData.endTime) {
        throw new Error('Время окончания должно быть позже времени начала');
      }

      const payload = {
        usrId: user.id,
        orgId: selectedOrg.orgId,
        visitDate: formData.visitDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        description: formData.description || ''
      };

      const response = await fetch('http://localhost:5555/api/activ', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при создании активности');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/activities');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOrgSelect = (org: Organization | null) => {
    setSelectedOrg(org);
    if (org) {
      setFormData(prev => ({
        ...prev,
        orgId: org.orgId
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        orgId: 0
      }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/';
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
              <div className="text-lg">Загрузка...</div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error && !user) {
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

  if (success) {
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
                  href="/activities"
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover-lift"
                  style={{ 
                    color: 'var(--foreground)',
                    background: 'transparent'
                  }}
                >
                  Мои активности
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="card rounded-xl p-8 fade-in text-center">
              <div className="text-lg" style={{ color: 'var(--primary)' }}>
                ✅ Активность успешно создана!
              </div>
              <div className="text-sm mt-2" style={{ color: 'var(--muted-foreground)' }}>
                Перенаправление на страницу активностей...
              </div>
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
                    href="/activities"
                    className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover-lift flex items-center gap-2"
                    style={{ 
                      color: 'var(--foreground)',
                      background: 'transparent'
                    }}
                  >
                    <ArrowLeft size={16} />
                    К активностям
                  </Link>
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

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-2 flex items-center gap-3">
              <Plus size={32} />
              Создать активность
            </h1>
            <p className="text-lg" style={{ color: 'var(--muted-foreground)' }}>
              Заполните форму для создания новой активности
            </p>
          </div>

          <div className="card rounded-xl p-8 fade-in">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Организация */}
              <OrganizationSearch
                onSelect={handleOrgSelect}
                selectedOrg={selectedOrg}
                error={error && error.includes('организацию') ? error : undefined}
              />

              {/* Дата визита */}
              <div>
                <label htmlFor="visitDate" className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Calendar size={16} />
                  Дата визита *
                </label>
                <input
                  id="visitDate"
                  name="visitDate"
                  type="date"
                  required
                  value={formData.visitDate}
                  onChange={handleChange}
                  className="form-input"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Время начала и окончания */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Clock size={16} />
                    Время начала *
                  </label>
                  <input
                    id="startTime"
                    name="startTime"
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Clock size={16} />
                    Время окончания *
                  </label>
                  <input
                    id="endTime"
                    name="endTime"
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Описание */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <FileText size={16} />
                  Описание
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Опишите детали активности..."
                />
              </div>

              {/* Ошибки */}
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              {/* Кнопки */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="form-button hover-lift flex items-center gap-2"
                  style={{ background: 'var(--primary)' }}
                >
                  <Plus size={16} />
                  {submitting ? 'Создание...' : 'Создать активность'}
                </button>
                <Link
                  href="/activities"
                  className="px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover-lift flex items-center gap-2"
                  style={{ 
                    color: 'var(--foreground)',
                    background: 'transparent',
                    border: '1px solid var(--muted)'
                  }}
                >
                  <ArrowLeft size={16} />
                  Отмена
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
