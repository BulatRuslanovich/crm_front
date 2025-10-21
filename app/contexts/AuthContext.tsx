'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  login: string;
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

  // Загружаем токены и пользователя из localStorage при инициализации
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
      } catch (error) {
        console.error('Error parsing user data:', error);
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
        await fetch('http://localhost:5555/api/user/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refreshToken: tokens.refreshToken
          }),
        });
      }
    } catch (error) {
      console.error('Error during logout:', error);
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
      const response = await fetch('http://localhost:5555/api/user/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: tokens.refreshToken
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTokens({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken
        });
        return true;
      } else {
        // Refresh token недействителен, очищаем все токены
        await logout();
        return false;
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      await logout();
      return false;
    } finally {
      setIsRefreshing(false);
    }
  }, [tokens?.refreshToken, isRefreshing, logout, setTokens]);

  const isAuthenticated = !!(tokens?.accessToken && user);

  return (
    <AuthContext.Provider value={{ 
      tokens, 
      user, 
      setTokens, 
      setUser, 
      refreshAccessToken, 
      logout, 
      isRefreshing, 
      isAuthenticated 
    }}>
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

// Хук для автоматического обновления токенов при запросах
export function useAuthenticatedFetch() {
  const { tokens, refreshAccessToken, logout } = useAuth();

  const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    if (!tokens?.accessToken) {
      throw new Error('No access token available');
    }

    // Добавляем токен к запросу
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${tokens.accessToken}`,
    };

    let response = await fetch(url, {
      ...options,
      headers,
    });

    // Если токен истек (401), пытаемся обновить его
    if (response.status === 401) {
      const refreshed = await refreshAccessToken();
      
      if (refreshed) {
        // Получаем обновленные токены из localStorage
        const newAccessToken = localStorage.getItem('token');
        if (newAccessToken) {
          // Повторяем запрос с новым токеном
          const newHeaders = {
            ...options.headers,
            'Authorization': `Bearer ${newAccessToken}`,
          };
          
          response = await fetch(url, {
            ...options,
            headers: newHeaders,
          });
        } else {
          await logout();
          window.location.href = '/login';
          throw new Error('Authentication failed');
        }
      } else {
        // Не удалось обновить токен, перенаправляем на логин
        window.location.href = '/login';
        throw new Error('Authentication failed');
      }
    }

    return response;
  };

  return authenticatedFetch;
}

export function useRequireAuth() {
  const { isAuthenticated, isRefreshing } = useAuth();
  
  useEffect(() => {
    if (!isRefreshing && !isAuthenticated) {
      window.location.href = '/login';
    }
  }, [isAuthenticated, isRefreshing]);
  
  return { isAuthenticated, isRefreshing };
}
