import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiArrowUpRight, FiCheck } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { servicesApi } from '@/api';
import type { Service } from '@/types';
import { SEO } from '@/components/seo/SEO';
import {
  JsonLd,
  breadcrumbSchema,
  faqSchema as buildFaqSchema,
  serviceSchema,
} from '@/components/seo/JsonLd';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { Skeleton } from '@/components/ui/Skeleton';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FAQAccordion } from '@/components/common/FAQAccordion';
import { Lightbox } from '@/components/common/Lightbox';
import { ContactForm } from '@/components/common/ContactForm';
import { Reveal, RevealGroup } from '@/components/common/Reveal';
import { fadeUp, scaleIn } from '@/animations/variants';
import { getFaIcon } from '@/utils/iconMap';
import { SITE } from '@/constants';
import { cn } from '@/utils/cn';

function isPopulatedService(item: Service | string): item is Service {
  return typeof item !== 'string';
}

export default function ServiceDetail() {
  const { slug = '' } = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setNotFound(false);
    setService(null);

    servicesApi
      .getBySlug(slug)
      .then((res) => {
        if (mounted) setService(res.data);
      })
      .catch(() => {
        if (mounted) setNotFound(true);
      })
      .finally(() => mounted && setIsLoading(false));

    return () => {
      mounted = false;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <div className="container-custom py-32">
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="mt-6 h-[50vh] w-full" />
      </div>
    );
  }

  if (notFound || !service) {
    return (
      <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <p className="eyebrow mb-4">Error 404</p>
        <h1 className="font-display text-5xl text-[var(--color-cream)] sm:text-6xl">
          Service Not Found
        </h1>
        <p className="mt-5 max-w-md text-[var(--color-muted)]">
          The service you're looking for may have been renamed or is no longer offered.
        </p>
        <Link to="/services" className="mt-8">
          <Button icon={<FiArrowRight />}>Browse All Services</Button>
        </Link>
      </section>
    );
  }

  const relatedServices = (service.relatedServices || []).filter(isPopulatedService);
  const isJagrata = service.slug === 'mata-ka-jagrata';
  const galleryImages = (
    isJagrata ? service.gallery : [service.banner, ...service.gallery]
  ).map((media) => ({
    url: media.url,
    alt: media.alt,
    caption: media.caption,
  }));
  const canonicalUrl = `/services/${service.slug}`;
  const Icon = getFaIcon(service.icon);

  return (
    <>
      <SEO
        title={service.seo?.metaTitle || service.title}
        description={service.seo?.metaDescription || service.shortDescription}
        keywords={service.seo?.keywords}
        image={service.seo?.ogImage || service.banner.url}
        url={canonicalUrl}
      />
      <JsonLd
        data={[
          serviceSchema({
            name: service.title,
            description: service.shortDescription,
            image: service.banner.url,
            url: `${SITE.url}${canonicalUrl}`,
          }),
          breadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Services', url: '/services' },
            { name: service.title, url: canonicalUrl },
          ]),
          ...(service.faqs.length ? [buildFaqSchema(service.faqs)] : []),
        ]}
      />

      {/* ---------------- HERO ---------------- */}
      <section className="relative flex h-[60svh] min-h-[440px] w-full items-end overflow-hidden bg-[var(--color-ink)]">
        <OptimizedImage
          src={service.banner.url}
          alt={service.banner.alt || service.title}
          loading="eager"
          wrapperClassName="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)] via-[var(--color-ink)]/70 to-black/75" />
        <div className="container-custom relative z-10 pb-16 pt-32">
          <Breadcrumb
            items={[{ label: 'Home', to: '/' }, { label: 'Services', to: '/services' }, { label: service.title }]}
            className="mb-6"
          />
          <div className="mb-5 flex h-14 w-14 items-center justify-center border border-[var(--color-gold)]/60 bg-[var(--color-ink)]/60 text-[var(--color-gold)] backdrop-blur-sm">
            <Icon size={22} />
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl font-display text-5xl leading-[1.05] text-[var(--color-cream)] sm:text-6xl lg:text-7xl"
          >
            {service.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="mt-5 max-w-xl text-[var(--color-muted)]"
          >
            {service.shortDescription}
          </motion.p>
        </div>
      </section>

      {/* ---------------- OVERVIEW ---------------- */}
      <section className="py-24 sm:py-28">
        <div className="container-custom grid grid-cols-1 gap-14 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow mb-4">Overview</p>
            <h2 className="font-display text-3xl leading-[1.15] text-[var(--color-cream)] sm:text-4xl">
              What to Expect
            </h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">
              {service.overview
                .split(/\n+/)
                .filter(Boolean)
                .map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
            </div>
          </Reveal>

          {service.includedServices.length > 0 && (
            <Reveal className="border border-[var(--color-line)] bg-[var(--color-charcoal)] p-8 sm:p-10">
              <p className="eyebrow">What's Included</p>
              <ul className="space-y-4">
                {service.includedServices.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-[var(--color-cream)]/90 sm:text-base">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-[var(--color-gold)] text-[var(--color-gold)]">
                      <FiCheck size={11} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
      </section>

      {/* ---------------- PACKAGES ---------------- */}
      {service.packages.length > 0 && (
        <section className="border-y border-[var(--color-line)] bg-[var(--color-charcoal)] py-24 sm:py-32">
          <div className="container-custom">
            <SectionHeading
              eyebrow="Packages"
              title="Choose What Suits You"
              description="Transparent packages designed to fit different scales and budgets — fully customisable on request."
            />
            <RevealGroup
              className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
              stagger={0.1}
            >
              {service.packages.map((pkg, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  className={`relative flex flex-col border p-8 sm:p-10 ${
                    pkg.isPopular
                      ? 'border-[var(--color-gold)] bg-[var(--color-ink)]'
                      : 'border-[var(--color-line)] bg-[var(--color-ink)]'
                  }`}
                >
                  {pkg.isPopular && (
                    <Badge
                      variant="gold"
                      className="absolute -top-3 left-8 z-10 bg-[var(--color-charcoal)]"
                    >
                      Most Popular
                    </Badge>
                  )}
                  <h3 className="font-display text-2xl text-[var(--color-cream)]">{pkg.name}</h3>
                  <p className="mt-3 font-display text-3xl text-[var(--color-gold)]">
                    {pkg.price}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-[var(--color-muted)]">
                    {pkg.description}
                  </p>
                  <ul className="mt-6 flex-1 space-y-3">
                    {pkg.features.map((feature, fIdx) => (
                      <li
                        key={fIdx}
                        className="flex items-start gap-3 text-sm text-[var(--color-cream)]/90"
                      >
                        <FiCheck className="mt-0.5 shrink-0 text-[var(--color-gold)]" size={14} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link to="/contact" className="mt-8">
                    <Button variant={pkg.isPopular ? 'primary' : 'outline'} fullWidth>
                      Enquire Now
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </RevealGroup>
          </div>
        </section>
      )}

      {/* ---------------- GALLERY ---------------- */}
      {service.gallery.length > 0 && (
        <section className="py-24 sm:py-32">
          <div className="container-custom">
            <SectionHeading
              eyebrow={isJagrata ? 'Posters' : 'Gallery'}
              title={
                isJagrata
                  ? 'Mata Ka Jagrata Posters'
                  : `${service.title} in Action`
              }
              description={
                isJagrata
                  ? 'A carousel of our Jagrata event posters and invitations.'
                  : "A closer look at moments from events we've styled and executed."
              }
            />

            {isJagrata ? (
              <div className="relative mt-16">
                <Swiper
                  modules={[Autoplay, Navigation, Pagination]}
                  slidesPerView={1.15}
                  spaceBetween={16}
                  centeredSlides
                  loop={galleryImages.length > 2}
                  autoplay={{ delay: 3500, disableOnInteraction: false }}
                  navigation
                  pagination={{ clickable: true }}
                  breakpoints={{
                    640: { slidesPerView: 2.1, spaceBetween: 20, centeredSlides: false },
                    1024: { slidesPerView: 3.2, spaceBetween: 24, centeredSlides: false },
                    1280: { slidesPerView: 4, spaceBetween: 24, centeredSlides: false },
                  }}
                  className={cn(
                    'jagrata-poster-swiper !pb-12',
                    '[&_.swiper-button-next]:text-[var(--color-gold)]',
                    '[&_.swiper-button-prev]:text-[var(--color-gold)]',
                    '[&_.swiper-pagination-bullet]:bg-[var(--color-muted)]',
                    '[&_.swiper-pagination-bullet-active]:bg-[var(--color-gold)]'
                  )}
                >
                  {galleryImages.map((img, idx) => (
                    <SwiperSlide key={`${img.url}-${idx}`}>
                      <button
                        type="button"
                        onClick={() => setLightboxIndex(idx)}
                        className="group block w-full overflow-hidden"
                      >
                        <OptimizedImage
                          src={img.url}
                          alt={img.alt}
                          aspectRatio="3 / 4"
                          wrapperClassName="w-full"
                          className="transition-transform duration-700 group-hover:scale-105"
                        />
                      </button>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            ) : (
              <RevealGroup
                className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
                stagger={0.06}
              >
                {galleryImages.map((img, idx) => (
                  <motion.button
                    key={idx}
                    variants={scaleIn}
                    onClick={() => setLightboxIndex(idx)}
                    className="group relative aspect-square w-full overflow-hidden"
                  >
                    <OptimizedImage
                      src={img.url}
                      alt={img.alt}
                      wrapperClassName="h-full w-full"
                      className="transition-transform duration-700 group-hover:scale-110"
                    />
                  </motion.button>
                ))}
              </RevealGroup>
            )}
          </div>
        </section>
      )}

      <Lightbox
        images={galleryImages}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />

      {/* ---------------- FAQ ---------------- */}
      {service.faqs.length > 0 && (
        <section className="border-y border-[var(--color-line)] bg-[var(--color-charcoal)] py-24 sm:py-32">
          <div className="container-custom max-w-4xl">
            <SectionHeading
              eyebrow="FAQs"
              title="Questions About This Service"
              description={`Everything you need to know before booking your ${service.title.toLowerCase()}.`}
            />
            <div className="mt-14">
              <FAQAccordion faqs={service.faqs} />
            </div>
          </div>
        </section>
      )}

      {/* ---------------- CTA + CONTACT FORM ---------------- */}
      <section className="py-24 sm:py-32">
        <div className="container-custom grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="eyebrow mb-4">Get Started</p>
            <h2 className="font-display text-4xl leading-[1.1] text-[var(--color-cream)] sm:text-5xl">
              Let's Plan Your {service.title}
            </h2>
            <p className="mt-6 leading-relaxed text-[var(--color-muted)]">
              Share a few details about your event and our team will reach out within 24 hours
              with a tailored plan and quote.
            </p>
            <div className="mt-9 flex flex-wrap gap-5">
              <MagneticButton>
                <a href={`tel:${SITE.phone}`}>
                  <Button size="lg" icon={<FiArrowUpRight />}>
                    Call {SITE.phone}
                  </Button>
                </a>
              </MagneticButton>
            </div>
          </Reveal>
          <Reveal className="border border-[var(--color-line)] bg-[var(--color-charcoal)] p-8 sm:p-10">
            <ContactForm
              defaultMessage={`I'm interested in your "${service.title}" service. Please share more details.`}
            />
          </Reveal>
        </div>
      </section>

      {/* ---------------- RELATED SERVICES ---------------- */}
      {relatedServices.length > 0 && (
        <section className="border-t border-[var(--color-line)] bg-[var(--color-charcoal)] py-24 sm:py-32">
          <div className="container-custom">
            <SectionHeading eyebrow="Explore More" title="Related Services" />
            <RevealGroup
              className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
              stagger={0.1}
            >
              {relatedServices.map((related) => {
                const RelatedIcon = getFaIcon(related.icon);
                return (
                  <motion.div key={related._id} variants={fadeUp}>
                    <Link to={`/services/${related.slug}`} className="group block">
                      <div className="relative aspect-[4/3] w-full overflow-hidden">
                        <OptimizedImage
                          src={related.banner.url}
                          alt={related.banner.alt || related.title}
                          wrapperClassName="h-full w-full"
                          className="transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center border border-[var(--color-gold)]/60 bg-[var(--color-ink)]/70 text-[var(--color-gold)] backdrop-blur-sm">
                          <RelatedIcon size={18} />
                        </div>
                      </div>
                      <h3 className="mt-5 font-display text-xl text-[var(--color-cream)] transition-colors duration-300 group-hover:text-[var(--color-gold)]">
                        {related.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-[var(--color-muted)]">
                        {related.shortDescription}
                      </p>
                    </Link>
                  </motion.div>
                );
              })}
            </RevealGroup>
          </div>
        </section>
      )}
    </>
  );
}
