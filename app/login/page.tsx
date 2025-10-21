'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from '../components/ThemeToggle';
import { SimpleInput, FormButton, ErrorMessage } from '../components/shared';
import { useForm } from 'react-hook-form';
import { LoginForm } from '../types/common';
import { postApi } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { handleApiError, logApiError } from '../utils/errorHandler';

export default function LoginPage() {
  const router = useRouter();
  const { setTokens, setUser } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    defaultValues: {
      login: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setApiError(null);

    try {
      const result = await postApi('/user/login', data, false);
      setTokens({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
      setUser(result.user);
      router.push('/');
    } catch (error) {
      logApiError(error, 'Login');
      const errorMessage = handleApiError(error);
      setApiError(errorMessage);
    }
  };

  return (
    <div
      className='min-h-screen flex items-center justify-center'
      style={{ background: 'var(--background)' }}
    >
      <div className='max-w-md w-full space-y-8 p-8'>
        {/* Переключатель тем */}
        <div className='flex justify-end'>
          <ThemeToggle />
        </div>

        <div className='card rounded-xl p-8 fade-in'>
          <div className='text-center mb-8'>
            <h2 className='text-3xl font-bold gradient-text'>Вход в систему</h2>
            <p
              className='mt-2 text-sm'
              style={{ color: 'var(--muted-foreground)' }}
            >
              Войдите в свой аккаунт для доступа к системе
            </p>
          </div>

          <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
            <div className='space-y-4'>
              <SimpleInput
                {...register('login', {
                  required: 'Логин обязателен',
                  minLength: { value: 3, message: 'Минимум 3 символа' },
                })}
                label='Логин'
                placeholder='Введите логин'
                error={errors.login?.message}
                required
              />
              <SimpleInput
                {...register('password', {
                  required: 'Пароль обязателен',
                  minLength: { value: 4, message: 'Минимум 4 символа' },
                })}
                type='password'
                label='Пароль'
                placeholder='Введите пароль'
                error={errors.password?.message}
                required
              />
            </div>

            <ErrorMessage message={apiError || ''} />

            <FormButton
              type='submit'
              loading={isSubmitting}
              loadingText='Вход...'
            >
              Войти
            </FormButton>

            <div className='text-center'>
              <Link
                href='/register'
                className='text-sm font-medium transition-colors duration-200 hover:underline'
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
