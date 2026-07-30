import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiArrowUpRight } from 'react-icons/fi';

import { servicesApi } from '@/api';
import type { Service } from '@/types';
import { SEO } from '@/components/seo/SEO';
import { JsonLd, breadcrumbSchema } from '@/components/seo/JsonLd';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/Button';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { Reveal, RevealGroup } from '@/components/common/Reveal';
import { fadeUp } from '@/animations/variants';
import { getFaIcon } from '@/utils/iconMap';
import { SITE } from '@/constants';
import { IMAGES } from '@/constants/images';

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    servicesApi
      .getAll()
      .then((res) => mounted && setServices(res.data))
      .catch(() => {})
      .finally(() => mounted && setIsLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <SEO
        title="Our Services"
        description={`Explore the full range of event planning services offered by ${SITE.fullName} — weddings, corporate events, birthdays, kitty parties and religious ceremonies across Uttarakhand.`}
        url="/services"
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
        ])}
      />

      {/* ---------------- HERO ---------------- */}
      <section className="relative flex h-[55svh] min-h-[420px] w-full items-end overflow-hidden bg-[var(--color-ink)]">
        <OptimizedImage
          src={IMAGES.pages.servicesHero}
          alt="Our Services"
          loading="eager"
          wrapperClassName="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)] via-[var(--color-ink)]/70 to-black/75" />
        <div className="container-custom relative z-10 pb-16 pt-32">
          <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Services' }]} className="mb-6" />
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl font-display text-5xl leading-[1.05] text-[var(--color-cream)] sm:text-6xl lg:text-7xl"
          >
            Services Crafted for Every Celebration
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="mt-5 max-w-xl text-[var(--color-muted)]"
          >
            From intimate gatherings to grand celebrations — explore the experiences we design
            and execute with precision, right across Haldwani, Kathgodam and Nainital.
          </motion.p>
        </div>
      </section>

      {/* ---------------- GRID ---------------- */}
      <section className="py-24 sm:py-32">
        <div className="container-custom">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : services.length > 0 ? (
            <RevealGroup className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
              {services.map((service) => {
                const Icon = getFaIcon(service.icon);
                return (
                  <motion.div key={service._id} variants={fadeUp}>
                    <Link to={`/services/${service.slug}`} className="group block">
                      <div className="relative aspect-[4/3] w-full overflow-hidden">
                        <OptimizedImage
                          src={service.banner.url}
                          alt={service.banner.alt || service.title}
                          wrapperClassName="h-full w-full"
                          className="transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                        <div className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center border border-[var(--color-gold)]/60 bg-[var(--color-ink)]/70 text-[var(--color-gold)] backdrop-blur-sm">
                          <Icon size={18} />
                        </div>
                      </div>
                      <div className="border border-t-0 border-[var(--color-line)] p-7 transition-colors duration-500 group-hover:border-[var(--color-gold)]/50">
                        <h3 className="font-display text-2xl text-[var(--color-cream)]">
                          {service.title}
                        </h3>
                        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[var(--color-muted)]">
                          {service.shortDescription}
                        </p>
                        <span className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--color-gold)]">
                          View Details
                          <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5" />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </RevealGroup>
          ) : (
            <p className="text-center text-[var(--color-muted)]">
              Services will be listed here shortly. Please check back soon.
            </p>
          )}
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="border-t border-[var(--color-line)] bg-[var(--color-charcoal)] py-24 sm:py-28">
        <Reveal className="container-custom text-center">
          <p className="eyebrow mb-5">Not Sure Where to Start?</p>
          <h2 className="mx-auto max-w-2xl font-display text-4xl leading-[1.15] text-[var(--color-cream)] sm:text-5xl">
            Let's Design a Package That Fits Your Vision
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[var(--color-muted)]">
            Every celebration is different — talk to our team and we'll tailor the perfect plan
            for your event, guest count and budget.
          </p>
          <div className="mt-9 flex justify-center">
            <MagneticButton>
              <Link to="/contact">
                <Button size="lg" icon={<FiArrowUpRight />}>
                  Get a Free Consultation
                </Button>
              </Link>
            </MagneticButton>
          </div>
        </Reveal>
      </section>
    </>
  );
}
