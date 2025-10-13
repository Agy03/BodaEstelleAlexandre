'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="flex items-center gap-3 cursor-pointer group">
        <div className="relative">
          <input
            type="radio"
            className={cn(
              'peer w-5 h-5 cursor-pointer appearance-none',
              'border-2 border-[var(--color-accent)]/30 rounded-full',
              'transition-all duration-300',
              'checked:border-[var(--color-rose)] checked:border-[6px]',
              'hover:border-[var(--color-rose)]/50',
              'focus:outline-none focus:ring-2 focus:ring-[var(--color-rose)]/20',
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        <span className="text-gray-700 font-light group-hover:text-[var(--color-rose)] transition-colors duration-300">
          {label}
        </span>
      </label>
    );
  }
);

Radio.displayName = 'Radio';

export { Radio };
