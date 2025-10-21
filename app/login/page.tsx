'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from '../components/ThemeToggle';
import { FormField, FormButton, ErrorMessage } from '../components/shared';
import { useForm } from '../hooks';
import { LoginForm } from '../types/common';
import { validators } from '../utils/common';
import { postApi } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { setTokens, setUser } = useAuth();
  
  const { data, loading, error, handleChange, handleSubmit } = useForm<LoginForm>({
    initialData: {
      login: '',
      password: ''
    },
    validate: (data) => ({
      login: validators.required(data.login, 'Логин'),
      password: validators.required(data.password, 'Пароль')
    }),
    onSubmit: async (data) => {
      const result = await postApi('/user/login', data, false);
      setTokens({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken
      });
      setUser(result.user);
      router.push('/');
    }
  });

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
              <FormField
                name="login"
                type="text"
                label="Логин"
                required
                value={data.login}
                onChange={handleChange}
                placeholder="Введите логин"
              />
              <FormField
                name="password"
                type="password"
                label="Пароль"
                required
                value={data.password}
                onChange={handleChange}
                placeholder="Введите пароль"
              />
            </div>

            <ErrorMessage message={error || ''} />

            <FormButton
              type="submit"
              loading={loading}
              loadingText="Вход..."
            >
              Войти
            </FormButton>

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