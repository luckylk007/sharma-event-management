import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import type { ReactNode } from 'react';
import { fadeUp, staggerContainer } from '@/animations/variants';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { cn } from '@/utils/cn';

interface RevealProps {
  children: ReactNode;
  variants?: Variants;
  className?: string;
  amount?: number;
  once?: boolean;
}

/** Scroll-triggered reveal — falls back to visible so content never stays hidden. */
export function Reveal({ children, variants = fadeUp, className, amount, once }: RevealProps) {
  const { ref, isInView } = useScrollReveal<HTMLDivElement>({ amount, once });
  const [forceVisible, setForceVisible] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setForceVisible(true), 600);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView || forceVisible ? 'visible' : 'hidden'}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface RevealGroupProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  amount?: number;
  once?: boolean;
}

/** Scroll-triggered stagger container — children should be `motion.*` with their own `variants`. */
export function RevealGroup({
  children,
  className,
  stagger = 0.12,
  delayChildren = 0,
  amount,
  once,
}: RevealGroupProps) {
  const { ref, isInView } = useScrollReveal<HTMLDivElement>({ amount, once });
  const [forceVisible, setForceVisible] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setForceVisible(true), 600);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView || forceVisible ? 'visible' : 'hidden'}
      variants={staggerContainer(stagger, delayChildren)}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
