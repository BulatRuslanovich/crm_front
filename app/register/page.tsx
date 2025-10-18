'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from '../components/ThemeToggle';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    login: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5555/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // После успешной регистрации перенаправляем на страницу входа
        router.push('/login');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Ошибка регистрации');
      }
    } catch {
      setError('Ошибка подключения к серверу');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
      <div className="max-w-md w-full space-y-8 p-8">
        {/* Переключатель тем */}
        <div className="flex justify-end">
          <ThemeToggle />
        </div>
        
        <div className="card rounded-xl p-8 fade-in">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold gradient-text">
              Регистрация
            </h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Создайте новый аккаунт для доступа к системе
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                  Имя *
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Введите имя"
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                  Фамилия *
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Введите фамилию"
                />
              </div>

              <div>
                <label htmlFor="middleName" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                  Отчество *
                </label>
                <input
                  id="middleName"
                  name="middleName"
                  type="text"
                  required
                  value={formData.middleName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Введите отчество"
                />
              </div>

              <div>
                <label htmlFor="login" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                  Логин *
                </label>
                <input
                  id="login"
                  name="login"
                  type="text"
                  required
                  value={formData.login}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Введите логин"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                  Пароль *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Введите пароль"
                />
              </div>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="form-button hover-lift"
                style={{ background: 'var(--success)' }}
              >
                {loading ? 'Регистрация...' : 'Зарегистрироваться'}
              </button>
            </div>

            <div className="text-center">
              <Link 
                href="/login" 
                className="text-sm font-medium transition-colors duration-200 hover:underline"
                style={{ color: 'var(--primary)' }}
              >
                Уже есть аккаунт? Войти
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
