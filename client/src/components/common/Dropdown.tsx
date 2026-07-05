import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '../../utils/cn';

interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  color?: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  (
    { options, value, onChange, placeholder = 'Select...', label, error, disabled, className, size = 'md' },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const selectedOption = options.find((o) => o.value === value);

    const toggle = useCallback(() => {
      if (!disabled) setIsOpen((prev) => !prev);
    }, [disabled]);

    const handleSelect = useCallback(
      (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
      },
      [onChange]
    );

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (!isOpen) return;
        if (e.key === 'Escape') setIsOpen(false);
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    return (
      <div ref={containerRef} className={cn('relative w-full', className)}>
        {label && (
          <label className="block text-sm font-medium text-kanban-text mb-1">{label}</label>
        )}
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          className={cn(
            'relative flex items-center justify-between rounded-md border bg-white cursor-pointer transition-colors',
            'focus-within:outline-none focus-within:ring-2 focus-within:ring-kanban-primary/20 focus-within:border-kanban-primary',
            size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-3 py-2 text-sm',
            disabled && 'opacity-50 cursor-not-allowed bg-gray-50',
            error ? 'border-red-300 focus-within:border-red-500 focus-within:ring-red-200' : 'border-kanban-border'
          )}
          onClick={toggle}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
        >
          <div className="flex items-center gap-2 truncate">
            {selectedOption?.icon && <span className="flex-shrink-0">{selectedOption.icon}</span>}
            {selectedOption?.color && (
              <span
                className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: selectedOption.color }}
              />
            )}
            <span className={cn(!selectedOption && 'text-kanban-textMuted')}>
              {selectedOption?.label || placeholder}
            </span>
          </div>
          <svg
            className={cn(
              'h-4 w-4 text-kanban-textMuted transition-transform duration-200 flex-shrink-0 ml-2',
              isOpen && 'rotate-180'
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {isOpen && (
          <ul
            className="absolute z-50 mt-1 w-full rounded-md bg-white shadow-lg border border-kanban-border max-h-60 overflow-auto py-1 text-sm focus:outline-none"
            role="listbox"
          >
            {options.map((option) => (
              <li
                key={option.value}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 cursor-pointer select-none transition-colors',
                  option.value === value ? 'bg-kanban-primary/10 text-kanban-primary' : 'hover:bg-kanban-bg text-kanban-text'
                )}
                onClick={() => handleSelect(option.value)}
                role="option"
                aria-selected={option.value === value}
              >
                {option.icon && <span className="flex-shrink-0">{option.icon}</span>}
                {option.color && (
                  <span
                    className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: option.color }}
                  />
                )}
                <span className="truncate">{option.label}</span>
                {option.value === value && (
                  <svg className="ml-auto h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </li>
            ))}
          </ul>
        )}

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Dropdown.displayName = 'Dropdown';