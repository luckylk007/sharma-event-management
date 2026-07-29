import type { CSSProperties } from 'react';
import { cn } from '@/utils/cn';

interface SkeletonProps {
  className?: string;
  style?: CSSProperties;
}

export function Skeleton({ className, style }: SkeletonProps) {
  return <div className={cn('skeleton-shimmer rounded-none', className)} style={style} />;
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2.5', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn('h-3', i === lines - 1 ? 'w-2/3' : 'w-full')} />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-4/3 w-full" />
      <Skeleton className="h-4 w-1/3" />
      <SkeletonText lines={2} />
    </div>
  );
}
