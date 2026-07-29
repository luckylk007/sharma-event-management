import { cn } from '@/utils/cn';

export interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: TabItem[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, active, onChange, className }: TabsProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap gap-1 overflow-x-auto border-b border-[var(--color-line)]',
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            'shrink-0 whitespace-nowrap border-b-2 px-4 py-3 text-xs uppercase tracking-widest transition-colors',
            active === tab.id
              ? 'border-[var(--color-gold)] text-[var(--color-gold)]'
              : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-cream)]'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
