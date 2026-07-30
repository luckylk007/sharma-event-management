import { motion } from 'framer-motion';

export function LoadingScreen() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[var(--color-ink)]">
      <motion.span
        initial={{ opacity: 0, letterSpacing: '0.1em' }}
        animate={{ opacity: 1, letterSpacing: '0.35em' }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="font-display text-2xl uppercase text-[var(--color-cream)]"
      >
        Sharma <span className="text-[var(--color-gold)]">Events</span>
      </motion.span>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="mt-6 h-px w-24 origin-left bg-[var(--color-gold)]"
      />
    </div>
  );
}
