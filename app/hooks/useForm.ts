'use client';

import { useState, useCallback } from 'react';

interface UseFormOptions<T> {
  initialData: T;
  onSubmit: (data: T) => Promise<void>;
  validate?: (data: T) => Record<keyof T, string | null>;
}

interface UseFormReturn<T> {
  data: T;
  loading: boolean;
  error: string | null;
  success: boolean;
  setData: (data: T) => void;
  setError: (error: string | null) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  reset: () => void;
}

export function useForm<T extends Record<string, unknown>>({
  initialData,
  onSubmit,
  validate
}: UseFormOptions<T>): UseFormReturn<T> {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Валидация
      if (validate) {
        const errors = validate(data);
        const firstError = Object.values(errors).find(error => error !== null);
        if (firstError) {
          setError(firstError);
          return;
        }
      }

      await onSubmit(data);
      setSuccess(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [data, onSubmit, validate]);

  const reset = useCallback(() => {
    setData(initialData);
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, [initialData]);

  return {
    data,
    loading,
    error,
    success,
    setData,
    setError,
    handleChange,
    handleSubmit,
    reset
  };
}
