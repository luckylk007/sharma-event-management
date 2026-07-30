import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getLenis } from '@/hooks/useLenis';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    });
    return () => window.cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
