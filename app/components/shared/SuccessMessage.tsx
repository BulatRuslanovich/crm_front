'use client';

interface SuccessMessageProps {
  message: string;
  className?: string;
}

export function SuccessMessage({ message, className = '' }: SuccessMessageProps) {
  if (!message) return null;

  return (
    <div className={`success-message ${className}`}>
      {message}
    </div>
  );
}
