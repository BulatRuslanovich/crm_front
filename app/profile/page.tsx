'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Eye, EyeOff, Save } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import { SimpleInput, FormButton, ErrorMessage, SuccessMessage } from '../components/shared';
import { useAuth } from '../contexts/AuthContext';
import { putApi } from '../utils/api';
import Link from 'next/link';
import ProtectedRoute from '../components/ProtectedRoute';
import { handleApiError, logApiError } from '../utils/errorHandler';

interface ProfileForm {
  firstName: string;
  lastName: string;
  middleName: string;
  login: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const { user: authUser, setUser: setAuthUser } = useAuth();
  
  // Форма профиля
  const profileForm = useForm<ProfileForm>({
    defaultValues: {
      firstName: authUser?.firstName || '',
      lastName: authUser?.lastName || '',
      middleName: authUser?.middleName || '',
      login: authUser?.login || ''
    }
  });

  // Форма смены пароля
  const passwordForm = useForm<PasswordForm>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const onProfileSubmit = async (data: ProfileForm) => {
    if (!authUser) return;
    
    setProfileError(null);
    setProfileSuccess(null);

    try {
      await putApi(`/user/${authUser.id}`, data);
      
      const updatedUser = { ...authUser, ...data };
      setAuthUser(updatedUser);
      setProfileSuccess('Профиль успешно обновлен!');
    } catch (err) {
      logApiError(err, 'Update Profile');
      const errorMessage = handleApiError(err);
      setProfileError(errorMessage);
    }
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    if (!authUser) return;
    
    // Валидация
    if (data.newPassword !== data.confirmPassword) {
      setPasswordError('Новые пароли не совпадают');
      return;
    }
    
    if (data.newPassword.length < 6) {
      setPasswordError('Новый пароль должен содержать минимум 6 символов');
      return;
    }

    if (data.currentPassword === data.newPassword) {
      setPasswordError('Новый пароль должен отличаться от текущего');
      return;
    }

    setPasswordError(null);
    setPasswordSuccess(null);

    try {
      await putApi(`/user/${authUser.id}`, {
        currentPassword: data.currentPassword,
        password: data.newPassword
      });

      setPasswordSuccess('Пароль успешно изменен!');
      passwordForm.reset();
    } catch (err) {
      logApiError(err, 'Change Password');
      const errorMessage = handleApiError(err);
      setPasswordError(errorMessage);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
        <nav className="navbar relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold gradient-text flex items-center gap-2">
                  Профиль пользователя
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/"
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover-lift"
                  style={{ color: 'var(--foreground)', background: 'transparent' }}
                >
                  На главную
                </Link>
                <ThemeToggle />  
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Редактирование профиля */}
              <div className="card rounded-2xl p-6 fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <User className="w-6 h-6" style={{ color: 'var(--primary)' }} />
                  <h2 className="text-xl font-semibold">Личная информация</h2>
                </div>
                
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                  <SimpleInput
                    {...profileForm.register('firstName', { 
                      required: 'Имя обязательно' 
                    })}
                    label="Имя"
                    placeholder="Введите имя"
                    error={profileForm.formState.errors.firstName?.message}
                    required
                  />
                  
                  <SimpleInput
                    {...profileForm.register('lastName', { 
                      required: 'Фамилия обязательна' 
                    })}
                    label="Фамилия"
                    placeholder="Введите фамилию"
                    error={profileForm.formState.errors.lastName?.message}
                    required
                  />
                  
                  <SimpleInput
                    {...profileForm.register('middleName')}
                    label="Отчество"
                    placeholder="Введите отчество"
                    error={profileForm.formState.errors.middleName?.message}
                  />
                  
                  <SimpleInput
                    {...profileForm.register('login', { 
                      required: 'Логин обязателен',
                      minLength: { value: 3, message: 'Минимум 3 символа' }
                    })}
                    label="Логин"
                    placeholder="Введите логин"
                    error={profileForm.formState.errors.login?.message}
                    required
                  />

                  <ErrorMessage message={profileError || ''} />
                  <SuccessMessage message={profileSuccess || ''} />
                  
                  <FormButton
                    type="submit"
                    loading={profileForm.formState.isSubmitting}
                    loadingText="Сохранение..."
                    className="w-full"
                  >
                    <Save className="w-4 h-4" />
                    Сохранить изменения
                  </FormButton>
                </form>
              </div>

              {/* Смена пароля */}
              <div className="card rounded-2xl p-6 fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <Eye className="w-6 h-6" style={{ color: 'var(--secondary)' }} />
                  <h2 className="text-xl font-semibold">Смена пароля</h2>
                </div>
                
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Текущий пароль</label>
                    <div className="relative">
                      <input
                        {...passwordForm.register('currentPassword', { 
                          required: 'Текущий пароль обязателен' 
                        })}
                        type={showPasswords.current ? 'text' : 'password'}
                        className="form-input pr-12"
                        placeholder="Введите текущий пароль"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors"
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {passwordForm.formState.errors.currentPassword && (
                      <div className="error-message mt-2">
                        {passwordForm.formState.errors.currentPassword.message}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Новый пароль</label>
                    <div className="relative">
                      <input
                        {...passwordForm.register('newPassword', { 
                          required: 'Новый пароль обязателен',
                          minLength: { value: 6, message: 'Минимум 6 символов' }
                        })}
                        type={showPasswords.new ? 'text' : 'password'}
                        className="form-input pr-12"
                        placeholder="Введите новый пароль"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors"
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {passwordForm.formState.errors.newPassword && (
                      <div className="error-message mt-2">
                        {passwordForm.formState.errors.newPassword.message}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Подтверждение пароля</label>
                    <div className="relative">
                      <input
                        {...passwordForm.register('confirmPassword', { 
                          required: 'Подтверждение пароля обязательно' 
                        })}
                        type={showPasswords.confirm ? 'text' : 'password'}
                        className="form-input pr-12"
                        placeholder="Подтвердите новый пароль"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors"
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {passwordForm.formState.errors.confirmPassword && (
                      <div className="error-message mt-2">
                        {passwordForm.formState.errors.confirmPassword.message}
                      </div>
                    )}
                  </div>

                  <ErrorMessage message={passwordError || ''} />
                  <SuccessMessage message={passwordSuccess || ''} />
                  
                  <FormButton
                    type="submit"
                    loading={passwordForm.formState.isSubmitting}
                    loadingText="Сохранение..."
                    variant="secondary"
                    className="w-full"
                  >
                    <Save className="w-4 h-4" />
                    Изменить пароль
                  </FormButton>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}