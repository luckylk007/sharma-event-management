import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface ScrollRevealOptions {
  once?: boolean;
  amount?: number | 'some' | 'all';
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {}
) {
  const ref = useRef<T>(null);
  const isInView = useInView(ref, {
    once: options.once ?? true,
    // Lower threshold so soft navigations / Lenis still trigger
    amount: options.amount ?? 0.05,
    margin: '0px 0px -40px 0px',
  });

  return { ref, isInView };
}
