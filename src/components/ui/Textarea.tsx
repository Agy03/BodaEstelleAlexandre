'use client';

import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-light tracking-wide text-gray-700">
            {label}
            {props.required && <span className="text-[var(--color-rose)] ml-1">*</span>}
          </label>
        )}
        <textarea
          className={cn(
            'w-full px-4 py-3 rounded-xl border-2 border-[var(--color-accent)]/20',
            'bg-white/90 backdrop-blur-sm',
            'text-gray-900 placeholder:text-gray-400 font-light',
            'transition-all duration-300',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-rose)]/20 focus:border-[var(--color-rose)]',
            'hover:border-[var(--color-rose)]/40',
            'resize-none',
            'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60',
            error && 'border-red-300 focus:border-red-400 focus:ring-red-100',
            className
          )}
          ref={ref}
          {...props}
        />
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

Textarea.displayName = 'Textarea';

export { Textarea };
