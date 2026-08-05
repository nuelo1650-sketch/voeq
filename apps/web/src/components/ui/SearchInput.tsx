'use client';

import { useState, type FormEvent } from 'react';
import { cn } from '@/lib/utils';
import { SearchIcon, CloseIcon } from '@/components/icons';

interface SearchInputProps {
  placeholder?: string;
  defaultValue?: string;
  size?: 'md' | 'lg';
  onSubmit?: (query: string) => void;
  className?: string;
  autoFocus?: boolean;
}

export function SearchInput({
  placeholder = 'Search vendors, services, or categories',
  defaultValue = '',
  size = 'md',
  onSubmit,
  className,
  autoFocus,
}: SearchInputProps) {
  const [value, setValue] = useState(defaultValue);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    if (onSubmit) {
      onSubmit(q);
    } else {
      window.location.href = '/search?q=' + encodeURIComponent(q);
    }
  };

  const sizeClasses = size === 'lg' ? 'h-14 text-base px-12' : 'h-11 text-sm px-10';
  const iconSize = size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';
  const iconPos = size === 'lg' ? 'left-4' : 'left-3';

  return (
    <form onSubmit={handleSubmit} className={cn('relative w-full', className)}>
      <div className={cn('pointer-events-none absolute inset-y-0 flex items-center text-forest-700/40 dark:text-cream-100/40', iconPos)}>
        <SearchIcon className={iconSize} />
      </div>
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={cn(
          'w-full rounded-full border border-cream-300 bg-cream-50 text-forest-900',
          'placeholder:text-forest-700/40',
          'focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent',
          'dark:border-forest-700 dark:bg-forest-800 dark:text-cream-100 dark:placeholder:text-cream-100/40',
          sizeClasses,
        )}
        aria-label="Search"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue('')}
          className="absolute inset-y-0 right-3 flex items-center text-forest-700/40 hover:text-forest-700 dark:text-cream-100/40 dark:hover:text-cream-100"
          aria-label="Clear search"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      )}
    </form>
  );
}
