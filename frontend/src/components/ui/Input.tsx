import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className, ...props }, ref) => {
    const autoId = useId();
    const inputId = id || autoId;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2 block text-xs uppercase tracking-widest text-[var(--color-muted)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full border-b bg-transparent px-0.5 py-3 text-[var(--color-cream)] placeholder:text-[var(--color-muted)]/60',
            'transition-colors duration-300 focus:outline-none',
            error
              ? 'border-red-400/70 focus:border-red-400'
              : 'border-[var(--color-line)] focus:border-[var(--color-gold)]',
            className
          )}
          aria-invalid={!!error}
          {...props}
        />
        {error ? (
          <p className="mt-1.5 text-xs text-red-400">{error}</p>
        ) : hint ? (
          <p className="mt-1.5 text-xs text-[var(--color-muted)]">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
