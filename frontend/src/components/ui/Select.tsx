import { forwardRef, useId } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { cn } from '@/utils/cn';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, id, className, ...props }, ref) => {
    const autoId = useId();
    const selectId = id || autoId;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="mb-2 block text-xs uppercase tracking-widest text-[var(--color-muted)]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full appearance-none border-b bg-transparent px-0.5 py-3 pr-8 text-[var(--color-cream)]',
              'transition-colors duration-300 focus:outline-none',
              error
                ? 'border-red-400/70 focus:border-red-400'
                : 'border-[var(--color-line)] focus:border-[var(--color-gold)]',
              className
            )}
            aria-invalid={!!error}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="bg-[var(--color-charcoal)]">
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[var(--color-charcoal)]">
                {opt.label}
              </option>
            ))}
          </select>
          <FiChevronDown className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
        </div>
        {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
