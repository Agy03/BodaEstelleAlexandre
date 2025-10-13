'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'text' | 'circular' | 'card';
}

export function Skeleton({ className, variant = 'default' }: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gradient-to-r from-[var(--color-rose)]/10 via-[var(--color-secondary)]/10 to-[var(--color-accent)]/10 rounded-lg';
  
  const variants = {
    default: '',
    text: 'h-4 w-full',
    circular: 'rounded-full aspect-square',
    card: 'h-64 w-full rounded-2xl',
  };

  return (
    <div
      className={cn(
        baseClasses,
        variants[variant],
        className
      )}
      style={{
        backgroundSize: '200% 100%',
        animation: 'shimmer 2s infinite',
      }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md shadow-[var(--color-rose)]/5 border-2 border-[var(--color-accent)]/10 p-6 space-y-4">
      <Skeleton variant="circular" className="w-16 h-16 mx-auto" />
      <div className="space-y-3">
        <Skeleton variant="text" className="h-6 w-3/4 mx-auto" />
        <Skeleton variant="text" className="h-4 w-full" />
        <Skeleton variant="text" className="h-4 w-5/6" />
        <Skeleton variant="text" className="h-4 w-4/6 mx-auto" />
      </div>
      <Skeleton className="h-10 w-32 mx-auto rounded-full" />
    </div>
  );
}

export function SkeletonGallery() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Skeleton key={i} variant="card" />
      ))}
    </div>
  );
}

export function SkeletonList() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-white/90 rounded-2xl border-2 border-[var(--color-accent)]/10">
          <Skeleton variant="circular" className="w-12 h-12" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="h-5 w-1/3" />
            <Skeleton variant="text" className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
