import { useRef } from 'react';
import { useInView } from 'framer-motion';

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
    amount: options.amount ?? 0.2,
    margin: '0px 0px -80px 0px',
  });

  return { ref, isInView };
}
