'use client';

import {
  ApiError,
  ValidationError,
  AuthenticationError,
  NetworkError,
} from './api';

export function handleApiError(error: unknown): string {
  if (error instanceof ValidationError) {
    return error.message;
  }

  if (error instanceof AuthenticationError) {
    return 'Ошибка авторизации';
  }

  if (error instanceof NetworkError) {
    return error.message;
  }

  if (error instanceof ApiError) {
    switch (error.status) {
      case 400:
        return error.message || 'Некорректные данные';
      case 403:
        return 'У вас нет прав для выполнения этого действия';
      case 404:
        return 'Запрашиваемый ресурс не найден';
      case 422:
        return error.message || 'Ошибка валидации данных';
      case 500:
        return 'Внутренняя ошибка сервера. Попробуйте позже';
      default:
        return error.message || 'Произошла ошибка при выполнении запроса';
    }
  }

  // Для обычных Error
  if (error instanceof Error) {
    return error.message;
  }

  // Для неизвестных ошибок
  return 'Произошла неизвестная ошибка';
}

export function logApiError(error: unknown, context?: string) {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.group(`🚨 API Error${context ? ` in ${context}` : ''}`);
    // eslint-disable-next-line no-console
    console.error('Error:', error);

    if (error instanceof ApiError) {
      // eslint-disable-next-line no-console
      console.error('Status:', error.status);
      // eslint-disable-next-line no-console
      console.error('Status Text:', error.statusText);
      // eslint-disable-next-line no-console
      console.error('Response:', error.response);
    }

    // eslint-disable-next-line no-console
    console.groupEnd();
  }
}

export function useErrorHandler() {
  const handleError = (error: unknown, context?: string) => {
    logApiError(error, context);
    return handleApiError(error);
  };

  return { handleError };
}
