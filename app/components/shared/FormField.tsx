'use client';

import { forwardRef } from 'react';
import { TimePicker } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

interface FormFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  type?: 'text' | 'password' | 'email' | 'date' | 'time' | 'textarea';
  label?: string;
  error?: string;
  required?: boolean;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ 
    type = 'text', 
    label, 
    error, 
    required, 
    className = '', 
    value,
    onChange,
    ...props 
  }, ref) => {
    
    const handleTimeChange = (time: Dayjs | null) => {
      const timeString = time ? time.format('HH:mm') : '';
      onChange?.({ target: { name: props.name, value: timeString } } as React.ChangeEvent<HTMLInputElement>);
    };

    const renderInput = () => {
      if (type === 'time') {
        return (
          <TimePicker
            value={value ? dayjs(value as string, 'HH:mm') : null}
            onChange={handleTimeChange}
            format="HH:mm"
            placeholder={props.placeholder as string}
            style={{ 
              width: '100%',
              height: '63%',
              backgroundColor: 'var(--input)',
              borderColor: 'var(--input-border)',
              color: 'var(--foreground)'
            }}
            className="time-picker-theme"
          />
        );
      }

      if (type === 'textarea') {
        return (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className={`form-input min-h-[100px] resize-y ${className}`}
            value={value}
            onChange={onChange as unknown as React.ChangeEventHandler<HTMLTextAreaElement>}
            name={props.name}
            placeholder={props.placeholder}
          />
        );
      }

      return (
        <input
          ref={ref}
          type={type}
          className={`form-input ${className}`}
          value={value}
          onChange={onChange}
          {...props}
        />
      );
    };

    return (
      <div>
        {label && (
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
            {label} {required && '*'}
          </label>
        )}
        
        {renderInput()}
        
        {error && (
          <div className="error-message mt-2">
            {error}
          </div>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';
