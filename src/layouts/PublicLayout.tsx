import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/layout/PageTransition';
import { FloatingWhatsApp } from '@/components/layout/FloatingWhatsApp';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { useLenis } from '@/hooks/useLenis';

function PageFallback() {
  return (
    <div className="flex min-h-[50vh] w-full flex-col items-center justify-center bg-[var(--color-ink)]">
      <span className="font-display text-xl uppercase tracking-[0.3em] text-[var(--color-cream)]">
        Sharma <span className="text-[var(--color-gold)]">Events</span>
      </span>
      <div className="mt-5 h-px w-16 animate-pulse bg-[var(--color-gold)]" />
    </div>
  );
}

export function PublicLayout() {
  const location = useLocation();
  useLenis();

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <PageTransition key={location.pathname}>
            <Suspense fallback={<PageFallback />}>
              <Outlet />
            </Suspense>
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
