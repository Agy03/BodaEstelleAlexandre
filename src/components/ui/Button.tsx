'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-full font-light tracking-wide transition-all duration-300 shadow-md hover:shadow-xl',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-gradient-to-r from-[var(--color-rose)] to-[var(--color-secondary)] text-white hover:from-[var(--color-secondary)] hover:to-[var(--color-rose)] focus-visible:ring-[var(--color-rose)] shadow-[var(--color-rose)]/20 hover:shadow-[var(--color-rose)]/30':
              variant === 'primary',
            'bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-accent)] text-white hover:opacity-90 focus-visible:ring-[var(--color-secondary)] shadow-[var(--color-secondary)]/20':
              variant === 'secondary',
            'border-2 border-[var(--color-rose)] text-[var(--color-rose)] hover:bg-[var(--color-rose)] hover:text-white shadow-[var(--color-rose)]/10':
              variant === 'outline',
            'text-gray-600 hover:bg-[var(--color-rose)]/5 hover:text-[var(--color-rose)] shadow-none': variant === 'ghost',
          },
          {
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-base': size === 'md',
            'px-6 py-3 text-lg': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
