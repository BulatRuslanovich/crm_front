'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from '../../components/ThemeToggle';
import OrganizationSearch from '../../components/OrganizationSearch';
import { FormField, FormButton, ErrorMessage, SuccessMessage } from '../../components/shared';
import { useForm } from '../../hooks';
import { CreateActivityForm, Organization } from '../../types/common';
import { validators } from '../../utils/common';
import { postApi } from '../../utils/api';
import { FileText, Plus, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';

export default function CreateActivityPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  
  const { data, loading, error, success, handleChange, handleSubmit } = useForm<CreateActivityForm>({
    initialData: {
      orgId: 0,
      visitDate: '',
      startTime: '',
      endTime: '',
      description: ''
    },
    validate: (data) => {
      const errors: Record<keyof CreateActivityForm, string | null> = {
        orgId: null,
        visitDate: null,
        startTime: null,
        endTime: null,
        description: null
      };

      if (!selectedOrg) {
        errors.orgId = 'Выберите организацию';
      }
      
      errors.visitDate = validators.required(data.visitDate, 'Дата визита');
      errors.startTime = validators.required(data.startTime, 'Время начала') || 
                        validators.timeFormat24(data.startTime);
      errors.endTime = validators.required(data.endTime, 'Время окончания') || 
                      validators.timeFormat24(data.endTime);
      
      const timeRangeError = validators.timeRange(data.startTime, data.endTime);
      if (timeRangeError) {
        errors.endTime = timeRangeError;
      }

      return errors;
    },
    onSubmit: async (data) => {
      if (!user) throw new Error('Пользователь не авторизован');
      if (!selectedOrg) throw new Error('Выберите организацию');

      const payload = {
        usrId: user.id,
        orgId: selectedOrg.orgId,
        visitDate: data.visitDate,
        startTime: data.startTime,
        endTime: data.endTime,
        description: data.description || ''
      };

      await postApi('/activ', payload);

      router.push('/activities');
    }
  });

  const handleOrgSelect = (org: Organization | null) => {
    if (!org) return;
    setSelectedOrg(org);
    handleChange({
      target: {
        name: 'orgId',
        value: org.orgId.toString()
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
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

          <form onSubmit={handleSubmit} className="space-y-8">
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
              <FormField
                name="visitDate"
                type="date"
                label="Дата визита"
                required
                value={data.visitDate}
                onChange={handleChange}
              />

              <FormField
                name="startTime"
                type="time"
                label="Время начала"
                required
                value={data.startTime}
                onChange={handleChange}
                placeholder="09:00"
              />

              <FormField
                name="endTime"
                type="time"
                label="Время окончания"
                required
                value={data.endTime}
                onChange={handleChange}
                placeholder="18:00"
              />
            </div>
            
            <div className="text-xs text-center" style={{ color: 'var(--muted-foreground)' }}>
              Время указывается в 24-часовом формате (например: 09:00, 14:30, 18:00)
            </div>

            {/* Описание */}
            <FormField
              name="description"
              type="textarea"
              label="Описание"
              value={data.description}
              onChange={handleChange}
              placeholder="Опишите детали визита..."
            />

            {/* Сообщения об ошибках и успехе */}
            <ErrorMessage message={error || ''} />
            <SuccessMessage message={success ? 'Активность успешно создана!' : ''} />

            {/* Кнопка отправки */}
            <div className="flex justify-end">
              <FormButton
                type="submit"
                loading={loading}
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
  );
}