'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { isTokenExpiringSoon, getTimeUntilExpiration } from '../utils/tokenUtils';


export function useTokenRefresh() {
  const { tokens, refreshAccessToken } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!tokens?.accessToken) {
      return;
    }

    const checkAndRefreshToken = async () => {
      if (isTokenExpiringSoon(tokens.accessToken)) {
        console.log('Token is expiring soon, refreshing...');
        await refreshAccessToken();
      }
    };

    // Проверяем токен каждые 30 секунд
    intervalRef.current = setInterval(checkAndRefreshToken, 30000);

    // Также устанавливаем таймер для обновления токена перед истечением
    const timeUntilExpiration = getTimeUntilExpiration(tokens.accessToken);
    const refreshTime = Math.max(60000, timeUntilExpiration - 300000); // обновляем за 5 минут до истечения, но не раньше чем через минуту

    if (refreshTime > 0) {
      timeoutRef.current = setTimeout(async () => {
        console.log('Scheduled token refresh...');
        await refreshAccessToken();
      }, refreshTime);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [tokens?.accessToken, refreshAccessToken]);

  // Очищаем интервалы при размонтировании
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
}
