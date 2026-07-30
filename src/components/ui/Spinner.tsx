import { cn } from '@/utils/cn';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'h-4 w-4 border-[1.5px]',
  md: 'h-7 w-7 border-2',
  lg: 'h-12 w-12 border-2',
};

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-block animate-spin rounded-full border-[var(--color-gold)] border-t-transparent',
        sizeMap[size],
        className
      )}
    />
  );
}
