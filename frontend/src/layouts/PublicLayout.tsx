import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/layout/PageTransition';
import { FloatingWhatsApp } from '@/components/layout/FloatingWhatsApp';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { useLenis } from '@/hooks/useLenis';

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
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
