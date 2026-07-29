import { motion } from 'framer-motion';
import { fadeUp } from '@/animations/variants';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { cn } from '@/utils/cn';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
  titleClassName?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
  titleClassName,
}: SectionHeadingProps) {
  const { ref, isInView } = useScrollReveal<HTMLDivElement>();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeUp}
      className={cn(
        'max-w-2xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className
      )}
    >
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h2
        className={cn(
          'font-display text-4xl leading-[1.1] text-[var(--color-cream)] sm:text-5xl',
          titleClassName
        )}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">
          {description}
        </p>
      )}
      <div
        className={cn(
          'mt-6 h-px w-16 bg-[var(--color-gold)]',
          align === 'center' && 'mx-auto'
        )}
      />
    </motion.div>
  );
}
