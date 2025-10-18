'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from '../components/ThemeToggle';

export default function LoginPage() {
  const [formData, setFormData] = useState({
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
      const response = await fetch('http://localhost:5555/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        // Сохраняем токен в localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Перенаправляем на главную страницу
        router.push('/');
      } else {
        setError('Неверный логин или пароль');
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
              Вход в систему
            </h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Войдите в свой аккаунт для доступа к системе
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="login" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                  Логин
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
                  Пароль
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
                style={{ background: 'var(--primary)' }}
              >
                {loading ? 'Вход...' : 'Войти'}
              </button>
            </div>

            <div className="text-center">
              <Link 
                href="/register" 
                className="text-sm font-medium transition-colors duration-200 hover:underline"
                style={{ color: 'var(--primary)' }}
              >
                Нет аккаунта? Зарегистрироваться
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
