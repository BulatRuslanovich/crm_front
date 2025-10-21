'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from '../components/ThemeToggle';
import { SimpleInput, FormButton, ErrorMessage } from '../components/shared';
import { useForm } from 'react-hook-form';
import { RegisterForm } from '../types/common';
import { postApi } from '../utils/api';
import { handleApiError, logApiError } from '../utils/errorHandler';

export default function RegisterPage() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RegisterForm>({
    defaultValues: {
      firstName: '',
      lastName: '',
      middleName: '',
      login: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterForm) => {
    setApiError(null);

    try {
      await postApi('/user/register', data, false);
      router.push('/login');
    } catch (error) {
      logApiError(error, 'Register');
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
            <h2 className='text-3xl font-bold gradient-text'>Регистрация</h2>
            <p
              className='mt-2 text-sm'
              style={{ color: 'var(--muted-foreground)' }}
            >
              Создайте аккаунт для доступа к системе
            </p>
          </div>

          <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
            <div className='space-y-4'>
              <SimpleInput
                {...register('firstName', {
                  required: 'Имя обязательно',
                })}
                label='Имя'
                placeholder='Введите имя'
                error={errors.firstName?.message}
                required
              />

              <SimpleInput
                {...register('lastName', {
                  required: 'Фамилия обязательна',
                })}
                label='Фамилия'
                placeholder='Введите фамилию'
                error={errors.lastName?.message}
                required
              />

              <SimpleInput
                {...register('middleName')}
                label='Отчество'
                placeholder='Введите отчество'
                error={errors.middleName?.message}
              />

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
                  minLength: { value: 6, message: 'Минимум 6 символов' },
                })}
                type='password'
                label='Пароль'
                placeholder='Введите пароль'
                error={errors.password?.message}
                required
              />

              <SimpleInput
                {...register('confirmPassword', {
                  required: 'Подтверждение пароля обязательно',
                  validate: value =>
                    value === password || 'Пароли не совпадают',
                })}
                type='password'
                label='Подтверждение пароля'
                placeholder='Подтвердите пароль'
                error={errors.confirmPassword?.message}
                required
              />
            </div>

            <ErrorMessage message={apiError || ''} />

            <FormButton
              type='submit'
              loading={isSubmitting}
              loadingText='Регистрация...'
            >
              Зарегистрироваться
            </FormButton>

            <div className='text-center'>
              <Link
                href='/login'
                className='text-sm font-medium transition-colors duration-200 hover:underline'
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
