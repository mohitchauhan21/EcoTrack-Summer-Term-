import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  variant?: 'default' | 'ghost';
}

export function Select({ value, onChange, options, className = '', placeholder, disabled, variant = 'default' }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : (placeholder || 'Select...');

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between focus:outline-none transition-colors text-left text-sm dark:text-zinc-100 text-gray-900 
          ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
          ${variant === 'default' ? 'dark:bg-zinc-800 bg-gray-50 border dark:border-white/[0.06] border-gray-200 rounded-lg px-4 py-3 focus:border-emerald-500/50' : ''}
          ${variant === 'ghost' ? 'bg-transparent border-none py-1' : ''}
        `}
      >
        <span className="truncate">{displayLabel}</span>
        <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 dark:text-zinc-400 text-gray-500 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full rounded-lg border dark:border-white/[0.06] border-gray-200 dark:bg-zinc-800 bg-white shadow-xl max-h-60 overflow-y-auto py-1">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <div
                key={option.value}
                onClick={() => {
                  if (!option.disabled) {
                    onChange(option.value);
                    setIsOpen(false);
                  }
                }}
                className={`px-4 py-2.5 text-sm transition-colors flex items-center
                  ${option.disabled 
                    ? 'opacity-50 cursor-not-allowed dark:text-zinc-500 text-gray-400' 
                    : 'cursor-pointer dark:hover:bg-emerald-500/10 hover:bg-emerald-50 dark:hover:text-emerald-400 hover:text-emerald-600 dark:text-zinc-300 text-gray-700'
                  }
                  ${isSelected && !option.disabled ? 'dark:bg-emerald-500/5 bg-emerald-50/80 font-medium dark:text-emerald-400 text-emerald-600' : ''}
                `}
              >
                {option.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
