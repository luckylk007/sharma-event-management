import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { cn } from '@/utils/cn';

interface PaginationProps {
  page: number;
  pages: number;
  onChange: (page: number) => void;
  className?: string;
}

export function Pagination({ page, pages, onChange, className }: PaginationProps) {
  if (pages <= 1) return null;

  const items: (number | 'ellipsis')[] = [];
  const windowSize = 1;
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || Math.abs(i - page) <= windowSize) {
      items.push(i);
    } else if (items[items.length - 1] !== 'ellipsis') {
      items.push('ellipsis');
    }
  }

  return (
    <div className={cn('flex items-center justify-center gap-2 pt-8', className)}>
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        aria-label="Previous page"
        className="flex h-9 w-9 items-center justify-center border border-[var(--color-line)] text-[var(--color-muted)] transition-colors hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <FiChevronLeft size={16} />
      </button>

      {items.map((item, idx) =>
        item === 'ellipsis' ? (
          <span key={`e-${idx}`} className="px-1 text-[var(--color-muted)]">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={cn(
              'flex h-9 min-w-9 items-center justify-center border px-2 text-sm transition-colors',
              item === page
                ? 'border-[var(--color-gold)] bg-[var(--color-gold)]/10 text-[var(--color-gold)]'
                : 'border-[var(--color-line)] text-[var(--color-muted)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]'
            )}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onChange(Math.min(pages, page + 1))}
        disabled={page >= pages}
        aria-label="Next page"
        className="flex h-9 w-9 items-center justify-center border border-[var(--color-line)] text-[var(--color-muted)] transition-colors hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <FiChevronRight size={16} />
      </button>
    </div>
  );
}
