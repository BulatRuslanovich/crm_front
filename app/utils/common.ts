'use client';

import { User } from '../types/common';

// Утилиты для работы с localStorage
export const storage = {
  getToken: (): string | null => localStorage.getItem('token'),
  setToken: (token: string): void => localStorage.setItem('token', token),
  removeToken: (): void => localStorage.removeItem('token'),
  
  getRefreshToken: (): string | null => localStorage.getItem('refreshToken'),
  setRefreshToken: (token: string): void => localStorage.setItem('refreshToken', token),
  removeRefreshToken: (): void => localStorage.removeItem('refreshToken'),
  
  getUser: (): User | null => {
    const userData = localStorage.getItem('user');
    if (!userData) return null;
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  },
  setUser: (user: User): void => localStorage.setItem('user', JSON.stringify(user)),
  removeUser: (): void => localStorage.removeItem('user'),
  
  clear: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
};

// Утилиты для валидации
export const validators = {
  required: (value: string, fieldName: string): string | null => {
    if (!value || value.trim() === '') {
      return `${fieldName} обязателен`;
    }
    return null;
  },
  
  minLength: (value: string, min: number, fieldName: string): string | null => {
    if (value.length < min) {
      return `${fieldName} должен содержать минимум ${min} символов`;
    }
    return null;
  },
  
  email: (value: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Некорректный email';
    }
    return null;
  },
  
  passwordMatch: (password: string, confirmPassword: string): string | null => {
    if (password !== confirmPassword) {
      return 'Пароли не совпадают';
    }
    return null;
  },
  
  timeRange: (startTime: string, endTime: string): string | null => {
    if (startTime >= endTime) {
      return 'Время окончания должно быть позже времени начала';
    }
    return null;
  },
  
  timeFormat24: (time: string): string | null => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) {
      return 'Время должно быть в формате ЧЧ:ММ (24-часовой формат)';
    }
    return null;
  }
};

// Утилиты для форматирования
export const formatters = {
  formatDate: (date: string | Date): string => {
    const d = new Date(date);
    return d.toLocaleDateString('ru-RU');
  },
  
  formatTime: (time: string): string => {
    // Убираем секунды если они есть (HH:MM:SS -> HH:MM)
    return time.substring(0, 5);
  },
  
  formatTime24: (time: string): string => {
    // Принудительно форматируем в 24-часовой формат
    const [hours, minutes] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  },
  
  formatDateTime: (dateTime: string): string => {
    const d = new Date(dateTime);
    return d.toLocaleString('ru-RU');
  },
  
  formatFullName: (user: User): string => {
    const parts = [user.lastName, user.firstName, user.middleName].filter(Boolean);
    return parts.join(' ');
  }
};
