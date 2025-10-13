'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white/90 backdrop-blur-sm rounded-2xl shadow-md shadow-[var(--color-rose)]/5 border-2 border-[var(--color-accent)]/10 p-6',
        hover && 'transition-all duration-500 hover:shadow-2xl hover:shadow-[var(--color-rose)]/10 hover:-translate-y-2 hover:border-[var(--color-rose)]/20',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mb-6', className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h3 className={cn('text-2xl font-light text-[var(--color-rose)] tracking-wide', className)}>{children}</h3>
  );
}

export function CardContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('text-gray-600 leading-relaxed', className)}>{children}</div>;
}
