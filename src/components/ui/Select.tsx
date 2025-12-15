'use client';

import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  options?: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, icon, options, children, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-light tracking-wide text-gray-700">
            {label}
            {props.required && <span className="text-[var(--color-rose)] ml-1">*</span>}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--color-rose)] transition-colors duration-300 z-10">
              {icon}
            </div>
          )}
          <select
            className={cn(
              'w-full px-4 py-3 rounded-xl border-2 border-[var(--color-accent)]/20',
              'bg-white/90 backdrop-blur-sm',
              'text-gray-900 font-light',
              'transition-all duration-300',
              'focus:outline-none focus:ring-2 focus:ring-[var(--color-rose)]/20 focus:border-[var(--color-rose)]',
              'hover:border-[var(--color-rose)]/40',
              'appearance-none cursor-pointer',
              error && 'border-red-300 focus:border-red-400 focus:ring-red-100',
              icon && 'pl-12',
              className
            )}
            ref={ref}
            {...props}
          >
            {options ? options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            )) : children}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && (
          <p className="text-sm text-red-500 font-light flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };
