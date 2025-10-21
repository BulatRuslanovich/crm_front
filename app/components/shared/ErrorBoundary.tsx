'use client';

import { ReactNode } from 'react';
import { ErrorMessage } from './ErrorMessage';

interface ErrorBoundaryProps {
  error: string | null;
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}

export function ErrorBoundary({ 
  error, 
  children, 
  fallback,
  className = '' 
}: ErrorBoundaryProps) {
  if (error) {
    return (
      <div className={className}>
        {fallback || <ErrorMessage message={error} />}
      </div>
    );
  }

  return <>{children}</>;
}
