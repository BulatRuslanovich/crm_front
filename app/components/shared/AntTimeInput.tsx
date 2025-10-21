'use client';

import { TimePicker } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

interface AntTimeInputProps {
  name: string;
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  error?: string;
  className?: string;
}

export function AntTimeInput({
  name,
  label,
  value,
  onChange,
  required = false,
  placeholder = '09:00',
  error,
  className = ''
}: AntTimeInputProps) {
  
  const handleChange = (time: Dayjs | null) => {
    const timeString = time ? time.format('HH:mm') : '';
    
    const syntheticEvent = {
      target: {
        name,
        value: timeString
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange(syntheticEvent);
  };

  // Конвертируем строку времени в Dayjs объект
  const dayjsValue = value ? dayjs(value, 'HH:mm') : null;

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
          {label} {required && '*'}
        </label>
      )}
      
      <TimePicker
        value={dayjsValue}
        onChange={handleChange}
        format="HH:mm"
        placeholder={placeholder}
        size="large"
        style={{ 
          width: '100%',
          backgroundColor: 'var(--input)',
          borderColor: 'var(--input-border)',
          color: 'var(--input-foreground)'
        }}
        inputReadOnly={false}
        showNow={false}
        minuteStep={1}
        hourStep={1}
      />
      
      {error && (
        <div className="error-message mt-2">
          {error}
        </div>
      )}
    </div>
  );
}
