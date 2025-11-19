'use client'

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.BASE_API_URL || "http://localhost:5555";

const LoginPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

  
    const response = await fetch(`${BASE_URL}/api/Auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        login: formData.login,
        password: formData.password
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      

      if (errorData?.errors) {
        const validationErrors = Object.values(errorData.errors).flat();
        setError(validationErrors.join('\n') || 'No message from validation error');
      } else {
        setError(errorData?.message || 'No message from error');
      }
      return;
    }

    const data = await response.json();

    if (data.userId) {
      localStorage.setItem('userId', data.userId.toString());
      localStorage.setItem('userLogin', data.login);
    }
    
    router.push('/');
  };

  return (
    <section className="flex-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md">
        <div className="glass card-shadow rounded-[10px] p-8 border border-dark-200">
          <h2 className="text-3xl font-bold text-center mb-2">Вход в систему</h2>
          <p className="text-light-200 text-center mb-6">Введите ваши учетные данные</p>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg p-3 mb-4 text-sm whitespace-pre-line">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="login" className="text-sm text-light-200">
                Логин
              </label>
              <input
                id="login"
                type="text"
                value={formData.login}
                onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                className="bg-dark-200 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Введите логин"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm text-light-200">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-dark-200 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary/90 w-full text-black font-semibold py-3 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-light-200">
            Нет аккаунта?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Зарегистрироваться
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;

