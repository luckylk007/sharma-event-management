import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import { cn } from '@/utils/cn';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex flex-wrap items-center gap-2 text-sm', className)}>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <span key={`${item.label}-${idx}`} className="flex items-center gap-2">
            {item.to && !isLast ? (
              <Link
                to={item.to}
                className="text-[var(--color-muted)] transition-colors hover:text-[var(--color-gold)]"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-[var(--color-cream)]' : 'text-[var(--color-muted)]'}>
                {item.label}
              </span>
            )}
            {!isLast && <FiChevronRight size={12} className="text-[var(--color-line)]" />}
          </span>
        );
      })}
    </nav>
  );
}
