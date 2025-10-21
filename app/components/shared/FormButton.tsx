'use client';

interface FormButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function FormButton({
  children,
  loading = false,
  loadingText = 'Загрузка...',
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  ...props
}: FormButtonProps) {
  const baseClasses =
    'form-button hover-lift flex items-center justify-center gap-2';

  const variantClasses = {
    primary: 'bg-[var(--primary)] hover:bg-[var(--primary-hover)]',
    secondary:
      'bg-[var(--secondary)] hover:bg-[var(--secondary)] text-[var(--secondary-foreground)]',
    danger: 'bg-[var(--error)] hover:bg-red-600',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}
