'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { initApi, postApi } from '../utils/api';
import { User } from '../types/common';

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

  useEffect(() => {
    const getAuthHeaders = (): Record<string, string> => {
      const token = localStorage.getItem('token');
      return token ? { Authorization: `Bearer ${token}` } : {};
    };
    
    initApi('http://localhost:5555/api', getAuthHeaders);
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
        await postApi('/user/logout', { refreshToken: tokens.refreshToken }, false);
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
      const data = await postApi('/user/refresh', { refreshToken: tokens.refreshToken }, false);
      setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken
      });
      return true;
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

export function useAuthenticatedFetch() {
  const { tokens, refreshAccessToken, logout } = useAuth();

  const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    if (!tokens?.accessToken) {
      throw new Error('No access token available');
    }

    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${tokens.accessToken}`,
    };

    let response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      const refreshed = await refreshAccessToken();
      
      if (refreshed) {
        const newAccessToken = localStorage.getItem('token');
        if (newAccessToken) {
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
