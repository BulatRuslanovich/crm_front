'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Eye, EyeOff, Save, ArrowLeft } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import { checkResponse } from '../utils/errorHandler';
import { useAuth, useAuthenticatedFetch } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

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
  const authenticatedFetch = useAuthenticatedFetch();
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
      const response = await authenticatedFetch(`http://localhost:5555/api/user/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          middleName: profileData.middleName,
          login: profileData.login
        }),
      });

      await checkResponse(response, 'Ошибка при обновлении профиля');

      // Обновляем данные в контексте
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
      // Используем существующий эндпоинт для обновления пароля
      const response = await authenticatedFetch(`http://localhost:5555/api/user/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          password: passwordData.newPassword
        }),
      });

      await checkResponse(response, 'Ошибка при смене пароля');

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
    <ProtectedRoute>
      <div className="min-h-screen" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Header */}
      <div className="navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-lg transition-colors mr-4"
                style={{ 
                  background: 'var(--muted)',
                  color: 'var(--foreground)'
                }}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold gradient-text">Профиль пользователя</h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
        {/* Сообщения об ошибках и успехе */}
        {error && (
          <div className="mb-6 p-4 rounded-lg error-message">
            <div>{error}</div>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 rounded-lg" style={{
            color: 'var(--success)',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <div>{success}</div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Редактирование профиля */}
          <div className="card rounded-2xl p-6 fade-in">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6" style={{ color: 'var(--primary)' }} />
              <h2 className="text-xl font-semibold">Личная информация</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Имя</label>
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) => handleProfileChange('firstName', e.target.value)}
                  className="form-input"
                  placeholder="Введите имя"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Фамилия</label>
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => handleProfileChange('lastName', e.target.value)}
                  className="form-input"
                  placeholder="Введите фамилию"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Отчество</label>
                <input
                  type="text"
                  value={profileData.middleName}
                  onChange={(e) => handleProfileChange('middleName', e.target.value)}
                  className="form-input"
                  placeholder="Введите отчество"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Логин</label>
                <input
                  type="text"
                  value={profileData.login}
                  onChange={(e) => handleProfileChange('login', e.target.value)}
                  className="form-input"
                  placeholder="Введите логин"
                />
              </div>
              
              <button
                onClick={handleProfileSave}
                disabled={saving}
                className="form-button w-full flex items-center justify-center gap-2"
                style={{
                  background: 'var(--primary)',
                  color: 'var(--primary-foreground)'
                }}
              >
                <Save className="w-4 h-4" />
                {saving ? 'Сохранение...' : 'Сохранить изменения'}
              </button>
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
              
              <button
                onClick={handlePasswordSave}
                disabled={saving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                className="form-button w-full flex items-center justify-center gap-2"
                style={{
                  background: 'var(--secondary)',
                  color: 'var(--secondary-foreground)'
                }}
              >
                <Save className="w-4 h-4" />
                {saving ? 'Сохранение...' : 'Изменить пароль'}
              </button>
            </div>
          </div>
        </div>
        </div>
      </main>
    </div>
    </ProtectedRoute>
  );
}
