import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiHome } from 'react-icons/fi';

import { SEO } from '@/components/seo/SEO';
import { Button } from '@/components/ui/Button';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { NAV_LINKS } from '@/constants';

export default function NotFound() {
  return (
    <>
      <SEO title="Page Not Found" description="The page you're looking for doesn't exist." noIndex />
      <section className="relative flex min-h-[85svh] flex-col items-center justify-center overflow-hidden px-6 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(201,162,39,0.08),_transparent_60%)]" />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="eyebrow relative mb-6"
        >
          Error 404
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="relative font-display text-7xl leading-none text-[var(--color-cream)] sm:text-8xl lg:text-9xl"
        >
          Lost the <span className="text-gradient-gold">Invitation?</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="relative mt-7 max-w-md text-[var(--color-muted)]"
        >
          The page you're looking for may have been moved, renamed, or never existed. Let's get
          you back to the celebration.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
          className="relative mt-10 flex flex-wrap items-center justify-center gap-5"
        >
          <MagneticButton>
            <Link to="/">
              <Button size="lg" icon={<FiHome />} iconPosition="left">
                Back to Home
              </Button>
            </Link>
          </MagneticButton>
          <Link to="/contact">
            <Button variant="outline" size="lg" icon={<FiArrowRight />}>
              Contact Us
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-[var(--color-line)] pt-8"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-xs uppercase tracking-widest text-[var(--color-muted)] transition-colors duration-300 hover:text-[var(--color-gold)]"
            >
              {link.label}
            </Link>
          ))}
        </motion.div>
      </section>
    </>
  );
}
