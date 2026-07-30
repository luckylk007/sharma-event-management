import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { pageVariants } from '@/animations/variants';

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      // Prefer transform over opacity alone so pages never look "blank" if animation stalls
      style={{ willChange: 'opacity, transform' }}
    >
      {children}
    </motion.div>
  );
}
