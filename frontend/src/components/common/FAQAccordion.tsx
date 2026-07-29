import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';
import type { FAQ } from '@/types';
import { cn } from '@/utils/cn';

interface FAQAccordionProps {
  faqs: FAQ[];
  className?: string;
}

export function FAQAccordion({ faqs, className }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={cn('divide-y divide-[var(--color-line)] border-t border-[var(--color-line)]', className)}>
      {faqs.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={idx} className="py-6">
            <button
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="flex w-full items-center justify-between gap-6 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-display text-xl text-[var(--color-cream)] sm:text-2xl">
                {faq.question}
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex h-8 w-8 shrink-0 items-center justify-center border border-[var(--color-line)] text-[var(--color-gold)]"
              >
                <FiPlus size={16} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-3xl pt-4 leading-relaxed text-[var(--color-muted)]">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
