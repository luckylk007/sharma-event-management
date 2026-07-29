import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

type BadgeVariant = 'gold' | 'outline' | 'muted' | 'success' | 'warning' | 'danger';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  gold: 'bg-[var(--color-gold)]/10 text-[var(--color-gold)] border-[var(--color-gold)]/40',
  outline: 'bg-transparent text-[var(--color-cream)] border-[var(--color-line)]',
  muted: 'bg-[var(--color-graphite)] text-[var(--color-muted)] border-[var(--color-line)]',
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  danger: 'bg-red-500/10 text-red-400 border-red-500/30',
};

export function Badge({ children, variant = 'gold', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 border px-3 py-1 text-[0.65rem] font-medium uppercase tracking-widest',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
