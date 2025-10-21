'use client';

import { ReactNode } from 'react';
import { useRequireAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isRefreshing } = useRequireAuth();

  if (isRefreshing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg" style={{ color: 'var(--muted-foreground)' }}>
          Проверка аутентификации...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // useRequireAuth уже перенаправит на /login
  }

  return <>{children}</>;
}
