'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { User as UserIcon } from 'lucide-react';
import { User } from '../types/common';

interface UserDropdownProps {
  user: User;
  onLogout: () => Promise<void>;
}

export default function UserDropdown({ user, onLogout }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdown = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdown.current &&
        !dropdown.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleLogout = async () => {
    await onLogout();
    setIsOpen(false);
  };

  return (
    <div className='relative' ref={dropdown}>
      <button
        className='flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700'
        style={{ background: 'var(--muted)' }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className='w-8 h-8 rounded-full gradient-bg flex items-center justify-center'>
          <span className='text-sm font-bold text-white'>
            {user.firstName[0]}
            {user.lastName[0]}
          </span>
        </div>

        <div className='hidden sm:block'>
          <div
            className='text-sm font-medium'
            style={{ color: 'var(--foreground)' }}
          >
            {user.lastName} {user.firstName}
          </div>
          <div className='text-xs' style={{ color: 'var(--muted-foreground)' }}>
            {user.login}
          </div>
        </div>

        <svg
          className={`w-4 h-4 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 9l-7 7-7-7'
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className='absolute right-0 mt-2 w-48 rounded-lg shadow-xl py-1 user-dropdown-menu'
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <Link
            href='/profile'
            className='flex items-center gap-3 px-4 py-2 text-sm transition-colors hover:opacity-80'
            style={{ color: 'var(--foreground)' }}
            onClick={() => setIsOpen(false)}
          >
            <UserIcon size={16} />
            Профиль
          </Link>
          <button
            onClick={handleLogout}
            className='w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors hover:opacity-80'
            style={{ color: 'var(--error)' }}
          >
            <svg
              className='w-4 h-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
              />
            </svg>
            Выйти
          </button>
        </div>
      )}
    </div>
  );
}
