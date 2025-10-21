'use client';

import { forwardRef } from 'react';

// Простой компонент для текстовых полей
export const SimpleInput = forwardRef<HTMLInputElement, {
  label?: string;
  error?: string;
  required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>>(
  ({ label, error, required, className = '', ...props }, ref) => {
    return (
      <div>
        {label && (
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
            {label} {required && '*'}
          </label>
        )}
        
        <input
          ref={ref}
          className={`form-input ${className}`}
          {...props}
        />
        
        {error && (
          <div className="error-message mt-2">
            {error}
          </div>
        )}
      </div>
    );
  }
);

SimpleInput.displayName = 'SimpleInput';

// Простой компонент для textarea
export const SimpleTextarea = forwardRef<HTMLTextAreaElement, {
  label?: string;
  error?: string;
  required?: boolean;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ label, error, required, className = '', ...props }, ref) => {
    return (
      <div>
        {label && (
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
            {label} {required && '*'}
          </label>
        )}
        
        <textarea
          ref={ref}
          className={`form-input min-h-[100px] resize-y ${className}`}
          {...props}
        />
        
        {error && (
          <div className="error-message mt-2">
            {error}
          </div>
        )}
      </div>
    );
  }
);

SimpleTextarea.displayName = 'SimpleTextarea';
