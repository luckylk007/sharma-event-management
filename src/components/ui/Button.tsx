import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonOwnProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children?: ReactNode;
}

export type ButtonProps = ButtonOwnProps &
  Omit<HTMLMotionProps<'button'>, keyof ButtonOwnProps> &
  Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>;

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-gold)] text-[var(--color-ink)] border border-[var(--color-gold)] hover:bg-[var(--color-gold-light)] hover:border-[var(--color-gold-light)]',
  secondary:
    'bg-[var(--color-cream)] text-[var(--color-ink)] border border-[var(--color-cream)] hover:bg-white',
  outline:
    'bg-transparent text-[var(--color-cream)] border border-[var(--color-line)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]',
  ghost: 'bg-transparent text-[var(--color-cream)] border border-transparent hover:text-[var(--color-gold)]',
  link: 'bg-transparent text-[var(--color-gold)] border-none underline-offset-4 hover:underline p-0',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'text-xs px-5 py-2.5 tracking-wide',
  md: 'text-sm px-7 py-3.5 tracking-wide',
  lg: 'text-sm px-9 py-4 tracking-widest',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      icon,
      iconPosition = 'right',
      fullWidth = false,
      disabled,
      className,
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'relative inline-flex items-center justify-center gap-2.5 font-medium uppercase',
          'transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50',
          variant !== 'link' && sizeStyles[size],
          variantStyles[variant],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-current border-t-transparent" />
        ) : (
          <>
            {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
            <span>{children}</span>
            {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
