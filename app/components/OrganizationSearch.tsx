'use client';

import { useState, useEffect, useRef } from 'react';
import { Building2, Search, X } from 'lucide-react';

interface Organization {
  orgId: number;
  name: string;
  inn: string;
  latitude: number;
  longitude: number;
  address: string;
}

interface OrganizationSearchProps {
  onSelect: (org: Organization | null) => void;
  selectedOrg?: Organization | null;
  placeholder?: string;
  error?: string;
}

export default function OrganizationSearch({ 
  onSelect, 
  selectedOrg, 
  placeholder = "Начните вводить название организации...",
  error 
}: OrganizationSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search function
  const searchOrganizations = async (term: string) => {
    if (term.length < 2) {
      setOrganizations([]);
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const token = localStorage.getItem('token');

      //
      if (!token) {
        throw new Error('Токен не найден');
      }

      const response = await fetch(
        `http://localhost:5555/api/org?searchTerm=${encodeURIComponent(term)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Ошибка при поиске организаций');
      }

      const data = await response.json();
      setOrganizations(data);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Произошла ошибка');
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchOrganizations(value);
    }, 300);
  };

  const handleSelect = (org: Organization) => {
    onSelect(org);
    setSearchTerm(org.name);
    setIsOpen(false);
    setOrganizations([]);
  };

  const handleClear = () => {
    onSelect(null);
    setSearchTerm('');
    setIsOpen(false);
    setOrganizations([]);
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    setIsOpen(true);
    if (searchTerm.length >= 2 && organizations.length === 0) {
      searchOrganizations(searchTerm);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (selectedOrg) {
      setSearchTerm(selectedOrg.name);
    } else {
      setSearchTerm('');
    }
  }, [selectedOrg]);

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
        <Building2 size={16} />
        Организация *
      </label>
      
      <div className="relative">
        <div className="relative">
          <Search 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
            style={{ color: 'var(--muted-foreground)' }}
          />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleFocus}
            className="form-input pl-10 pr-10"
            placeholder={placeholder}
            autoComplete="off"
            style={{ paddingLeft: '2.5rem' }}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 transition-colors"
              style={{ color: 'var(--muted-foreground)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--foreground)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted-foreground)'}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div 
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            {loading && (
              <div className="p-3 text-center text-sm text-gray-500">
                Поиск...
              </div>
            )}
            
            {!loading && organizations.length === 0 && searchTerm.length >= 2 && (
              <div className="p-3 text-center text-sm text-gray-500">
                Организации не найдены
              </div>
            )}
            
            {!loading && searchTerm.length < 2 && (
              <div className="p-3 text-center text-sm text-gray-500">
                Введите минимум 2 символа для поиска
              </div>
            )}

            {organizations.map((org) => (
              <button
                key={org.orgId}
                type="button"
                onClick={() => handleSelect(org)}
                className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0 transition-colors"
              >
                <div className="font-medium text-sm text-gray-900 dark:text-gray-100">{org.name}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-1">
                  <span className="truncate">{org.address}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected organization info */}
      {selectedOrg && (
        <div className="mt-2 p-2 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
          <div className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
            {selectedOrg.name}
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
            {selectedOrg.address}
          </div>
        </div>
      )}

      {/* Error messages */}
      {(error || errorMessage) && (
        <div className="mt-2 text-sm text-red-600">
          {error || errorMessage}
        </div>
      )}
    </div>
  );
}
