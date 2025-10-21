'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from '../components/ThemeToggle';
import { FormField, FormButton, ErrorMessage } from '../components/shared';
import { useForm } from '../hooks';
import { RegisterForm } from '../types/common';
import { validators } from '../utils/common';
import { postApi } from '../utils/api';

export default function RegisterPage() {
  const router = useRouter();
  
  const { data, loading, error, handleChange, handleSubmit } = useForm<RegisterForm>({
    initialData: {
      firstName: '',
      lastName: '',
      middleName: '',
      login: '',
      password: '',
      confirmPassword: ''
    },
    validate: (data) => ({
      firstName: validators.required(data.firstName, 'Имя'),
      lastName: validators.required(data.lastName, 'Фамилия'),
      middleName: null, // Отчество не обязательно
      login: validators.required(data.login, 'Логин'),
      password: validators.minLength(data.password, 6, 'Пароль'),
      confirmPassword: validators.passwordMatch(data.password, data.confirmPassword)
    }),
    onSubmit: async (data) => {
      await postApi('/user/register', data, false);
      router.push('/login');
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
              Регистрация
            </h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Создайте аккаунт для доступа к системе
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <FormField
                name="firstName"
                type="text"
                label="Имя"
                required
                value={data.firstName}
                onChange={handleChange}
                placeholder="Введите имя"
              />
              
              <FormField
                name="lastName"
                type="text"
                label="Фамилия"
                required
                value={data.lastName}
                onChange={handleChange}
                placeholder="Введите фамилию"
              />

              <FormField
                name="middleName"
                type="text"
                label="Отчество"
                value={data.middleName}
                onChange={handleChange}
                placeholder="Введите отчество"
              />

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

              <FormField
                name="confirmPassword"
                type="password"
                label="Подтверждение пароля"
                required
                value={data.confirmPassword}
                onChange={handleChange}
                placeholder="Подтвердите пароль"
              />
            </div>

            <ErrorMessage message={error || ''} />

            <FormButton
              type="submit"
              loading={loading}
              loadingText="Регистрация..."
            >
              Зарегистрироваться
            </FormButton>

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