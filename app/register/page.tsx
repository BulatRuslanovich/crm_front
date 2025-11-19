'use client'

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.BASE_API_URL || "http://localhost:5555";

const RegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    login: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  if (formData.password !== formData.confirmPassword) {
    setError('Пароли не совпадают');
    return;
  }

  setLoading(true);

  const response = await fetch(`${BASE_URL}/api/Auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        login: formData.login,
        password: formData.password,
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

      setLoading(false);
      return;
    }

    const data = await response.json();

    if (data.usrId) {
      localStorage.setItem('userId', data.usrId.toString());
      localStorage.setItem('userLogin', data.login);
    }

    router.push('/');
  };

  return (
    <section className="flex-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md">
        <div className="glass card-shadow rounded-[10px] p-8 border border-dark-200">
          <h2 className="text-3xl font-bold text-center mb-2">Регистрация</h2>

            {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg p-3 mb-4 text-sm whitespace-pre-line">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="firstName" className="text-sm text-light-200">
                Имя
              </label>
              <input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="bg-dark-200 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Введите имя"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="lastName" className="text-sm text-light-200">
                Фамилия
              </label>
              <input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="bg-dark-200 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Введите фамилию"
              />
            </div>

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

            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword" className="text-sm text-light-200">
                Подтвердите пароль
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="bg-dark-200 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary/90 w-full text-black font-semibold py-3 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-light-200">
            Уже есть аккаунт?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Войти
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;

