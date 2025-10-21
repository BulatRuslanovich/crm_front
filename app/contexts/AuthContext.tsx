'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { initApi, postApi, setRefreshTokenCallback } from '../utils/api';
import { User } from '../types/common';
import { decodeJWT } from '../utils/tokenUtils';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthContextType {
  tokens: AuthTokens | null;
  user: User | null;
  setTokens: (tokens: AuthTokens | null) => void;
  setUser: (user: User | null) => void;
  refreshAccessToken: () => Promise<boolean>;
  logout: () => Promise<void>;
  isRefreshing: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [tokens, setTokensState] = useState<AuthTokens | null>(null);
  const [user, setUserState] = useState<User | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    const userData = localStorage.getItem('user');

    if (accessToken && refreshToken) {
      setTokensState({ accessToken, refreshToken });
    }

    if (userData) {
      try {
        setUserState(JSON.parse(userData));
      } catch {
        // Error parsing user data - clear invalid data
        localStorage.removeItem('user');
      }
    }
  }, []);

  const setTokens = useCallback((newTokens: AuthTokens | null) => {
    setTokensState(newTokens);

    if (newTokens) {
      localStorage.setItem('token', newTokens.accessToken);
      localStorage.setItem('refreshToken', newTokens.refreshToken);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
  }, []);

  const setUser = useCallback((newUser: User | null) => {
    setUserState(newUser);

    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('user');
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      if (tokens?.refreshToken) {
        await postApi(
          '/user/logout',
          { refreshToken: tokens.refreshToken },
          false
        );
      }
    } catch {
      // Error during logout - continue with cleanup
    } finally {
      setTokens(null);
      setUser(null);
    }
  }, [tokens?.refreshToken, setTokens, setUser]);

  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    if (isRefreshing || !tokens?.refreshToken) {
      return false;
    }

    setIsRefreshing(true);

    try {
      const data = await postApi(
        '/user/refresh',
        { refreshToken: tokens.refreshToken },
        false
      );
      setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      return true;
    } catch {
      // Error refreshing token - logout user
      await logout();
      return false;
    } finally {
      setIsRefreshing(false);
    }
  }, [tokens?.refreshToken, isRefreshing, logout, setTokens]);

  // Обновляем API клиент при изменении токенов
  useEffect(() => {
    const getAuthHeaders = (): Record<string, string> => {
      const token = tokens?.accessToken || localStorage.getItem('token');
      return token ? { Authorization: `Bearer ${token}` } : {};
    };

    initApi('http://localhost:5555/api', getAuthHeaders);

    // Устанавливаем callback для обновления токенов
    setRefreshTokenCallback(refreshAccessToken);
  }, [tokens?.accessToken, refreshAccessToken]);

  // Автоматическое обновление токенов перед истечением
  useEffect(() => {
    if (!tokens?.accessToken) return;

    const checkTokenExpiration = () => {
      const tokenInfo = decodeJWT(tokens.accessToken);
      if (tokenInfo) {
        const now = Math.floor(Date.now() / 1000);
        const fiveMinutes = 5 * 60;

        if (tokenInfo.exp - now < fiveMinutes) {
          refreshAccessToken();
        }
      }
    };

    // Проверяем каждые 2 минуты
    const interval = setInterval(checkTokenExpiration, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, [tokens?.accessToken, refreshAccessToken]);

  const isAuthenticated = !!tokens?.accessToken;

  return (
    <AuthContext.Provider
      value={{
        tokens,
        user,
        setTokens,
        setUser,
        refreshAccessToken,
        logout,
        isRefreshing,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useRequireAuth() {
  const { isAuthenticated, isRefreshing, tokens } = useAuth();

  useEffect(() => {
    // Не перенаправляем, если идет процесс обновления токенов или если токены еще загружаются
    if (!isRefreshing && !isAuthenticated && tokens === null) {
      // Добавляем небольшую задержку, чтобы дать время на загрузку из localStorage
      const timer = setTimeout(() => {
        window.location.href = '/login';
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isRefreshing, tokens]);

  return { isAuthenticated, isRefreshing };
}
