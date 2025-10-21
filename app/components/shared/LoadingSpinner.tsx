'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function LoadingSpinner({ size = 'md', text, className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-[var(--primary)] ${sizeClasses[size]}`}></div>
      {text && (
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          {text}
        </p>
      )}
    </div>
  );
}
