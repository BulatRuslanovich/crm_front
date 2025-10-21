'use client';

import { User } from '../types/common';


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
