import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FiMenu,
  FiX,
  FiArrowUpRight,
  FiChevronDown,
  FiArrowRight,
} from 'react-icons/fi';
import { NAV_LINKS, SITE } from '@/constants';
import { menuOverlay, staggerContainer, fadeUp } from '@/animations/variants';
import { servicesApi } from '@/api';
import { getFaIcon } from '@/utils/iconMap';
import { cn } from '@/utils/cn';
import type { Service } from '@/types';

const MEGA_EASE = [0.16, 1, 0.3, 1] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [megaPinned, setMegaPinned] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [activeService, setActiveService] = useState<Service | null>(null);
  const location = useLocation();
  const megaTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const megaRef = useRef<HTMLDivElement>(null);
  const megaPinnedRef = useRef(false);

  useEffect(() => {
    megaPinnedRef.current = megaPinned;
  }, [megaPinned]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setMegaOpen(false);
    setMegaPinned(false);
    megaPinnedRef.current = false;
    setMobileServicesOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    let cancelled = false;
    servicesApi
      .getAll()
      .then((res) => {
        if (cancelled) return;
        const list = res.data ?? [];
        setServices(list);
        setActiveService(list[0] ?? null);
      })
      .catch(() => {
        /* megamenu degrades gracefully */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const openMega = useCallback(() => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current);
    setMegaOpen(true);
  }, []);

  const closeMega = useCallback((delay = 200) => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current);
    megaTimeout.current = setTimeout(() => {
      megaPinnedRef.current = false;
      setMegaPinned(false);
      setMegaOpen(false);
    }, delay);
  }, []);

  const dismissMega = useCallback(() => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current);
    megaPinnedRef.current = false;
    setMegaPinned(false);
    setMegaOpen(false);
  }, []);

  const handleServicesTrigger = useCallback(() => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current);
    // If already pinned open, click closes. Otherwise open + pin
    // (avoids hover-open then click-toggle-close race).
    if (megaOpen && megaPinnedRef.current) {
      dismissMega();
      return;
    }
    megaPinnedRef.current = true;
    setMegaPinned(true);
    setMegaOpen(true);
  }, [megaOpen, dismissMega]);

  useEffect(() => {
    return () => {
      if (megaTimeout.current) clearTimeout(megaTimeout.current);
    };
  }, []);

  useEffect(() => {
    if (!megaOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismissMega();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [megaOpen, dismissMega]);

  const isServicesActive =
    location.pathname === '/services' || location.pathname.startsWith('/services/');

  const navSolid = scrolled || menuOpen || megaOpen;

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 border-b border-line bg-[#0a0a0a] transition-shadow duration-500',
          navSolid
            ? 'shadow-[0_8px_32px_rgba(0,0,0,0.45)]'
            : 'shadow-[0_4px_24px_rgba(0,0,0,0.35)]'
        )}
        style={{ backgroundColor: '#0a0a0a' }}
      >
        <div className="container-custom relative flex h-20 items-center justify-between sm:h-24">
          <Link
            to="/"
            className="group flex flex-col leading-none"
            onClick={() => setMenuOpen(false)}
            style={{ textShadow: '0 1px 12px rgba(0,0,0,0.55)' }}
          >
            <span className="font-display text-2xl tracking-wide text-cream sm:text-3xl">
              Sharma <span className="text-gold">Events</span>
            </span>
            <span className="mt-1 hidden text-[0.6rem] uppercase tracking-[0.35em] text-muted sm:block">
              Haldwani &middot; Uttarakhand
            </span>
          </Link>

          <nav className="hidden items-center gap-8 xl:gap-10 lg:flex">
            {NAV_LINKS.map((link) => {
              if (link.to === '/services') {
                return (
                  <div
                    key={link.to}
                    className="relative"
                    onMouseEnter={openMega}
                    onMouseLeave={() => closeMega(200)}
                  >
                    <button
                      type="button"
                      aria-expanded={megaOpen}
                      aria-haspopup="true"
                      onPointerDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleServicesTrigger();
                      }}
                      className={cn(
                        'relative inline-flex items-center gap-1.5 text-sm uppercase tracking-widest transition-colors duration-300',
                        'after:absolute after:-bottom-1.5 after:left-0 after:h-px after:bg-gold after:transition-all after:duration-300',
                        isServicesActive || megaOpen
                          ? 'text-cream after:w-full'
                          : 'text-muted after:w-0 hover:text-cream hover:after:w-full'
                      )}
                    >
                      Services
                      <FiChevronDown
                        className={cn(
                          'size-3.5 transition-transform duration-300',
                          megaOpen && 'rotate-180'
                        )}
                      />
                    </button>
                  </div>
                );
              }

              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'relative text-sm uppercase tracking-widest transition-colors duration-300 hover:text-cream',
                      'after:absolute after:-bottom-1.5 after:left-0 after:h-px after:bg-gold after:transition-all after:duration-300',
                      isActive
                        ? 'text-cream after:w-full'
                        : 'text-muted after:w-0 hover:after:w-full'
                    )
                  }
                  style={{ textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}
                >
                  {link.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="hidden lg:block">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 border border-gold bg-ink/50 px-6 py-3 text-xs uppercase tracking-widest text-gold transition-colors duration-300 hover:bg-gold hover:text-ink"
            >
              Plan Your Event
              <FiArrowUpRight className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <button
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((prev) => !prev)}
            className="relative z-10 text-cream lg:hidden"
          >
            {menuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
          </button>
        </div>

        {/* Desktop Services megamenu */}
        <AnimatePresence>
          {megaOpen && (
            <motion.div
              ref={megaRef}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: MEGA_EASE }}
              onMouseEnter={openMega}
              onMouseLeave={() => closeMega(200)}
              className="fixed inset-x-0 top-20 z-[60] border-t border-line bg-ink shadow-[0_24px_64px_rgba(0,0,0,0.55)] sm:top-24"
            >
              <div className="container-custom grid gap-0 py-8 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="pr-6">
                  <p className="mb-5 text-[0.65rem] uppercase tracking-[0.35em] text-gold">
                    Our Services
                  </p>
                  <ul className="grid gap-1 sm:grid-cols-2">
                    {services.map((service) => {
                      const Icon = getFaIcon(service.icon);
                      const active = activeService?._id === service._id;
                      return (
                        <li key={service._id}>
                          <Link
                            to={`/services/${service.slug}`}
                            onMouseEnter={() => setActiveService(service)}
                            onFocus={() => setActiveService(service)}
                            className={cn(
                              'group flex gap-3 rounded-sm border border-transparent p-3 transition-all duration-300',
                              active
                                ? 'border-line bg-graphite'
                                : 'hover:border-line hover:bg-graphite/60'
                            )}
                          >
                            <span
                              className={cn(
                                'mt-0.5 flex size-10 shrink-0 items-center justify-center border transition-colors duration-300',
                                active
                                  ? 'border-gold text-gold'
                                  : 'border-line text-muted group-hover:border-gold/60 group-hover:text-gold'
                              )}
                            >
                              <Icon className="size-4" />
                            </span>
                            <span className="min-w-0">
                              <span className="block font-display text-lg leading-tight text-cream">
                                {service.title}
                              </span>
                              <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-muted">
                                {service.shortDescription}
                              </span>
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-line pt-5">
                    <Link
                      to="/services"
                      className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold transition-colors hover:text-gold-light"
                    >
                      View all services
                      <FiArrowRight className="size-3.5" />
                    </Link>
                    <span className="text-line">|</span>
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted transition-colors hover:text-cream"
                    >
                      Get a free consultation
                      <FiArrowUpRight className="size-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="relative hidden min-h-[280px] overflow-hidden border border-line lg:block">
                  <AnimatePresence mode="wait">
                    {activeService && (
                      <motion.div
                        key={activeService._id}
                        initial={{ opacity: 0, scale: 1.04 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: MEGA_EASE }}
                        className="absolute inset-0"
                      >
                        <img
                          src={activeService.banner?.url}
                          alt={activeService.banner?.alt || activeService.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/20" />
                        <div className="absolute inset-x-0 bottom-0 space-y-3 p-6">
                          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-gold">
                            Featured
                          </p>
                          <h3 className="font-display text-2xl text-cream">
                            {activeService.title}
                          </h3>
                          <p className="line-clamp-2 text-sm text-muted">
                            {activeService.shortDescription}
                          </p>
                          <Link
                            to={`/services/${activeService.slug}`}
                            className="inline-flex items-center gap-2 border border-gold px-4 py-2.5 text-[0.65rem] uppercase tracking-widest text-gold transition-colors hover:bg-gold hover:text-ink"
                          >
                            Explore service
                            <FiArrowUpRight />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Dim backdrop behind megamenu */}
      <AnimatePresence>
        {megaOpen && (
          <motion.button
            type="button"
            aria-label="Close services menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 hidden bg-black/45 lg:block"
            onClick={dismissMega}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            variants={menuOverlay}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40 flex flex-col justify-between bg-ink px-6 pb-10 pt-28 lg:hidden"
          >
            <motion.nav
              variants={staggerContainer(0.08)}
              initial="hidden"
              animate="visible"
              className="flex flex-1 flex-col justify-center gap-1 overflow-y-auto"
            >
              {NAV_LINKS.map((link) => {
                if (link.to === '/services') {
                  return (
                    <motion.div key={link.to} variants={fadeUp} className="border-b border-line">
                      <button
                        type="button"
                        onClick={() => setMobileServicesOpen((v) => !v)}
                        className={cn(
                          'flex w-full items-center justify-between py-4 font-display text-4xl',
                          isServicesActive || mobileServicesOpen ? 'text-gold' : 'text-cream'
                        )}
                      >
                        Services
                        <FiChevronDown
                          className={cn(
                            'size-6 transition-transform duration-300',
                            mobileServicesOpen && 'rotate-180'
                          )}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {mobileServicesOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: MEGA_EASE }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-1 pb-5">
                              <Link
                                to="/services"
                                className="block py-2 text-sm uppercase tracking-widest text-muted"
                              >
                                All Services
                              </Link>
                              {services.map((service) => {
                                const Icon = getFaIcon(service.icon);
                                return (
                                  <Link
                                    key={service._id}
                                    to={`/services/${service.slug}`}
                                    className="flex items-center gap-3 py-2.5 text-cream"
                                  >
                                    <Icon className="size-4 text-gold" />
                                    <span className="font-display text-xl">{service.title}</span>
                                  </Link>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                }

                return (
                  <motion.div key={link.to} variants={fadeUp}>
                    <NavLink
                      to={link.to}
                      end={link.to === '/'}
                      className={({ isActive }) =>
                        cn(
                          'block border-b border-line py-4 font-display text-4xl',
                          isActive ? 'text-gold' : 'text-cream'
                        )
                      }
                    >
                      {link.label}
                    </NavLink>
                  </motion.div>
                );
              })}
            </motion.nav>

            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-6">
              <Link
                to="/contact"
                className="flex items-center justify-center gap-2 border border-gold py-4 text-sm uppercase tracking-widest text-gold"
              >
                Plan Your Event
                <FiArrowUpRight />
              </Link>
              <div className="flex items-center justify-between text-xs uppercase tracking-widest text-muted">
                <a href={`tel:${SITE.phoneRaw}`}>{SITE.phone}</a>
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
