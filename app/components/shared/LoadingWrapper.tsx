'use client';

import { ReactNode } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface LoadingWrapperProps {
  loading: boolean;
  children?: ReactNode;
  loadingText?: string;
  className?: string;
}

export function LoadingWrapper({
  loading,
  children,
  loadingText = 'Загрузка...',
  className = '',
}: LoadingWrapperProps) {
  if (loading) {
    return (
      <div
        className={`flex items-center justify-center min-h-[200px] ${className}`}
      >
        <LoadingSpinner text={loadingText} />
      </div>
    );
  }

  return <>{children}</>;
}
