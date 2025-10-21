'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Eye, EyeOff, Save } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import { FormField, FormButton, ErrorMessage, SuccessMessage } from '../components/shared';
import { useAuth } from '../contexts/AuthContext';
import { putApi } from '../utils/api';
import Link from 'next/link';

interface UserProfile {
  firstName: string;
  lastName: string;
  middleName: string;
  login: string;
  id: number;
}

interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user: authUser, setUser: setAuthUser } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Состояние для редактирования профиля
  const [profileData, setProfileData] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    middleName: '',
    login: '',
    id: 0
  });
  
  // Состояние для смены пароля
  const [passwordData, setPasswordData] = useState<PasswordChange>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Состояние для показа/скрытия паролей
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
      setProfileData(authUser);
    } else {
      router.push('/login');
    }
    setLoading(false);
  }, [authUser, router]);

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field: keyof PasswordChange, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleProfileSave = async () => {
    if (!user) return;
    
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await putApi(`/user/${user.id}`, {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        middleName: profileData.middleName,
        login: profileData.login
      });

    
      const updatedUser = { ...user, ...profileData };
      setAuthUser(updatedUser);
      setSuccess('Профиль успешно обновлен!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async () => {
    if (!user) return;
    
    // Валидация паролей
    if (!passwordData.currentPassword) {
      setError('Введите текущий пароль');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Новые пароли не совпадают');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setError('Новый пароль должен содержать минимум 6 символов');
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setError('Новый пароль должен отличаться от текущего');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await putApi(`/user/${user.id}`, {
        currentPassword: passwordData.currentPassword,
        password: passwordData.newPassword
      });

      setSuccess('Пароль успешно изменен!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg" style={{ color: 'var(--muted-foreground)' }}>
          Загрузка профиля...
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    // <ProtectedRoute>
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
        <ErrorMessage message={error || ''} />
        <SuccessMessage message={success || ''} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Редактирование профиля */}
          <div className="card rounded-2xl p-6 fade-in">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6" style={{ color: 'var(--primary)' }} />
              <h2 className="text-xl font-semibold">Личная информация</h2>
            </div>
            
            <div className="space-y-4">
              <FormField
                name="firstName"
                type="text"
                label="Имя"
                value={profileData.firstName}
                onChange={(e) => handleProfileChange('firstName', e.target.value)}
                placeholder="Введите имя"
              />
              
              <FormField
                name="lastName"
                type="text"
                label="Фамилия"
                value={profileData.lastName}
                onChange={(e) => handleProfileChange('lastName', e.target.value)}
                placeholder="Введите фамилию"
              />
              
              <FormField
                name="middleName"
                type="text"
                label="Отчество"
                value={profileData.middleName}
                onChange={(e) => handleProfileChange('middleName', e.target.value)}
                placeholder="Введите отчество"
              />
              
              <FormField
                name="login"
                type="text"
                label="Логин"
                value={profileData.login}
                onChange={(e) => handleProfileChange('login', e.target.value)}
                placeholder="Введите логин"
              />
              
              <FormButton
                onClick={handleProfileSave}
                loading={saving}
                loadingText="Сохранение..."
                className="w-full"
              >
                <Save className="w-4 h-4" />
                Сохранить изменения
              </FormButton>
            </div>
          </div>

          {/* Смена пароля */}
          <div className="card rounded-2xl p-6 fade-in">
            <div className="flex items-center gap-3 mb-6">
              <Eye className="w-6 h-6" style={{ color: 'var(--secondary)' }} />
              <h2 className="text-xl font-semibold">Смена пароля</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Текущий пароль</label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
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
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Новый пароль</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
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
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Подтверждение пароля</label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
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
              </div>
              
              <FormButton
                onClick={handlePasswordSave}
                loading={saving}
                loadingText="Сохранение..."
                disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                variant="secondary"
                className="w-full"
              >
                <Save className="w-4 h-4" />
                Изменить пароль
              </FormButton>
            </div>
          </div>
        </div>
        </div>
      </main>
    </div>
    // </ProtectedRoute>
  );
}
