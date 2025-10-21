'use client';

import { useState } from 'react';
import Link from 'next/link';
import ThemeToggle from '../../components/ThemeToggle';
import ProtectedRoute from '../../components/ProtectedRoute';
import OrganizationSearch from '../../components/OrganizationSearch';
import { SimpleInput, SimpleTextarea, FormButton, ErrorMessage, SuccessMessage } from '../../components/shared';
import { useForm } from 'react-hook-form';
import { CreateActivityForm, Organization } from '../../types/common';
import { postApi } from '../../utils/api';
import { FileText, Plus, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
import { handleApiError, logApiError } from '../../utils/errorHandler';

export default function CreateActivityPage() {
  const { user } = useAuth();
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm<CreateActivityForm>({
    defaultValues: {
      orgId: 0,
      visitDate: '',
      startTime: '',
      endTime: '',
      description: ''
    }
  });

  const startTime = watch('startTime');

  const onSubmit = async (data: CreateActivityForm) => {
    if (!user) {
      setError('Пользователь не авторизован');
      return;
    }
    
    if (!selectedOrg) {
      setError('Выберите организацию');
      return;
    }

    setError(null);
    setSuccess(false);

    try {
      const payload = {
        usrId: user.id,
        orgId: selectedOrg.orgId,
        visitDate: data.visitDate,
        startTime: data.startTime,
        endTime: data.endTime,
        description: data.description || ''
      };

      await postApi('/activ', payload);
      setSuccess(true);
      
      // Перенаправление через 2 секунды
      setTimeout(() => {
        window.location.href = '/activities';
      }, 2000);
    } catch (err) {
      logApiError(err, 'Create Activity');
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    }
  };

  const handleOrgSelect = (org: Organization | null) => {
    if (!org) return;
    setSelectedOrg(org);
    setValue('orgId', org.orgId);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Навигация */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/activities" 
              className="flex items-center gap-2 text-sm font-medium transition-colors duration-200 hover:underline"
              style={{ color: 'var(--muted-foreground)' }}
            >
              <ArrowLeft className="h-4 w-4" />
              Назад к активностям
            </Link>
          </div>
          <ThemeToggle />
        </div>

        <div className="card rounded-xl p-8 fade-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text flex items-center justify-center gap-3">
              <Plus className="h-8 w-8" />
              Создание активности
            </h1>
            <p className="mt-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Заполните форму для создания новой активности
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Выбор организации */}
            <div>
              <OrganizationSearch onSelect={handleOrgSelect} />
              {selectedOrg && (
                <div className="mt-3 p-4 rounded-lg border" style={{ 
                  background: 'var(--muted)', 
                  borderColor: 'var(--border)' 
                }}>
                  <h3 className="font-medium" style={{ color: 'var(--foreground)' }}>
                    {selectedOrg.name}
                  </h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
                    {selectedOrg.address}
                  </p>
                </div>
              )}
            </div>

            {/* Дата и время */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SimpleInput
                {...register('visitDate', { 
                  required: 'Дата визита обязательна' 
                })}
                type="date"
                label="Дата визита"
                error={errors.visitDate?.message}
                required
              />

              <SimpleInput
                {...register('startTime', { 
                  required: 'Время начала обязательно' 
                })}
                type="time"
                label="Время начала"
                placeholder="09:00"
                error={errors.startTime?.message}
                required
              />

              <SimpleInput
                {...register('endTime', { 
                  required: 'Время окончания обязательно',
                  validate: (value) => {
                    if (startTime && value && value <= startTime) {
                      return 'Время окончания должно быть позже времени начала';
                    }
                    return true;
                  }
                })}
                type="time"
                label="Время окончания"
                placeholder="18:00"
                error={errors.endTime?.message}
                required
              />
            </div>
            
            <div className="text-xs text-center" style={{ color: 'var(--muted-foreground)' }}>
              Время указывается в 24-часовом формате (например: 09:00, 14:30, 18:00)
            </div>

            {/* Описание */}
            <SimpleTextarea
              {...register('description')}
              label="Описание"
              placeholder="Опишите детали визита..."
              error={errors.description?.message}
            />

            {/* Сообщения об ошибках и успехе */}
            <ErrorMessage message={error || ''} />
            <SuccessMessage message={success ? 'Активность успешно создана!' : ''} />

            {/* Кнопка отправки */}
            <div className="flex justify-end">
              <FormButton
                type="submit"
                loading={isSubmitting}
                loadingText="Создание..."
                className="w-full md:w-auto px-8"
              >
                <FileText className="h-4 w-4" />
                Создать активность
              </FormButton>
            </div>
          </form>
        </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}