import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiArrowUpRight, FiMapPin, FiPhone, FiClock } from 'react-icons/fi';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import { blogsApi, galleryApi, servicesApi, testimonialsApi } from '@/api';
import type { Blog, GalleryItem, Service, Testimonial } from '@/types';
import { useSettings } from '@/hooks/useSettings';
import { SEO } from '@/components/seo/SEO';
import { JsonLd, localBusinessSchema } from '@/components/seo/JsonLd';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton';
import { Counter } from '@/components/common/Counter';
import { FAQAccordion } from '@/components/common/FAQAccordion';
import { Lightbox } from '@/components/common/Lightbox';
import { Reveal, RevealGroup } from '@/components/common/Reveal';
import { fadeUp, reveal, scaleIn, slideInLeft, slideInRight } from '@/animations/variants';
import { getFaIcon } from '@/utils/iconMap';
import { SITE, DEFAULT_MAP_EMBED } from '@/constants';
import { IMAGES } from '@/constants/images';
import { cn } from '@/utils/cn';

export default function Home() {
  const { settings } = useSettings();

  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);

  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    servicesApi
      .getAll()
      .then((res) => mounted && setServices(res.data.slice(0, 6)))
      .catch(() => {})
      .finally(() => mounted && setServicesLoading(false));

    galleryApi
      .getAll({ featured: true, limit: 8 })
      .then((res) => mounted && setGallery(res.data))
      .catch(() => {})
      .finally(() => mounted && setGalleryLoading(false));

    testimonialsApi
      .getAll()
      .then((res) => mounted && setTestimonials(res.data))
      .catch(() => {})
      .finally(() => mounted && setTestimonialsLoading(false));

    blogsApi
      .getAll({ limit: 3 })
      .then((res) => mounted && setBlogs(res.data))
      .catch(() => {})
      .finally(() => mounted && setBlogsLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const heroTitle = settings?.home.heroTitle || SITE.tagline;
  const heroSubtitle =
    settings?.home.heroSubtitle ||
    'Premium wedding, corporate, birthday and celebration planning across Haldwani, Kathgodam, Nainital and Uttarakhand.';
  const heroImage =
    settings?.home.heroImage ||
    IMAGES.pages.homeHero;
  const heroCta = settings?.home.heroCta || 'Plan Your Event';
  const stats = settings?.home.stats || [];
  const process = settings?.home.process || [];
  const faqs = settings?.home.faqs || [];
  const companyName = settings?.companyName || SITE.fullName;

  const lightboxImages = gallery.map((item) => ({
    url: item.image.url,
    alt: item.image.alt || item.title,
    caption: item.title,
  }));

  return (
    <>
      <SEO
        title={companyName}
        description={settings?.seoDefaults.metaDescription || SITE.description}
        keywords={settings?.seoDefaults.keywords}
        url="/"
      />
      <JsonLd data={localBusinessSchema()} />

      {/* ---------------- HERO ---------------- */}
      <section className="relative flex h-[100svh] min-h-[640px] w-full items-center overflow-hidden bg-[var(--color-ink)]">
        <OptimizedImage
          src={heroImage}
          alt={companyName}
          loading="eager"
          wrapperClassName="absolute inset-0"
          className="scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)] via-[var(--color-ink)]/65 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-ink)]/70 via-transparent to-transparent" />

        <div className="container-custom relative z-10 w-full pt-24 pb-16 sm:pt-28 sm:pb-20">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="eyebrow mb-6 flex items-center gap-3 pt-5 sm:pt-6"
          >
            <span className="h-px w-8 bg-[var(--color-gold)]" />
            {companyName}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="max-w-4xl font-display text-5xl leading-[1.05] text-[var(--color-cream)] sm:text-6xl md:text-7xl lg:text-8xl"
          >
            {heroTitle}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
            className="mt-7 max-w-xl text-base leading-relaxed text-[var(--color-muted)] sm:text-lg"
          >
            {heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            className="mt-10 flex flex-wrap items-center gap-5"
          >
            <MagneticButton>
              <Link to="/contact">
                <Button size="lg" icon={<FiArrowUpRight />}>
                  {heroCta}
                </Button>
              </Link>
            </MagneticButton>
            <Link to="/gallery">
              <Button variant="outline" size="lg">
                View Our Work
              </Button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 right-6 z-10 hidden flex-col items-center gap-3 sm:right-10 sm:flex lg:right-16"
        >
          <span className="text-[0.65rem] uppercase tracking-[0.3em] text-[var(--color-muted)] [writing-mode:vertical-rl]">
            Scroll
          </span>
          <span className="relative h-14 w-px overflow-hidden bg-[var(--color-line)]">
            <motion.span
              className="absolute inset-x-0 top-0 h-1/2 bg-[var(--color-gold)]"
              animate={{ y: ['-100%', '200%'] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
        </motion.div>
      </section>

      {/* ---------------- ABOUT PREVIEW ---------------- */}
      <section className="py-24 sm:py-32">
        <div className="container-custom grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="relative aspect-[4/5] w-full overflow-hidden"
          >
            <OptimizedImage
              src={
                settings?.about.team?.[0]?.image ||
                IMAGES.pages.aboutStory
              }
              alt={companyName}
              wrapperClassName="h-full w-full"
            />
            <div className="absolute -bottom-6 -right-6 hidden border border-[var(--color-gold)]/40 bg-[var(--color-ink)] px-8 py-6 sm:block">
              <p className="font-display text-4xl text-[var(--color-gold)]">
                {stats[2]?.value ? `${stats[2].value}${stats[2].suffix}` : '10+'}
              </p>
              <p className="mt-1 text-xs uppercase tracking-widest text-[var(--color-muted)]">
                {stats[2]?.label || 'Years of Experience'}
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <p className="eyebrow mb-4">About {companyName}</p>
            <h2 className="font-display text-4xl leading-[1.1] text-[var(--color-cream)] sm:text-5xl">
              A Decade of Crafting Celebrations That Feel Like You
            </h2>
            <p className="mt-6 line-clamp-6 text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">
              {settings?.about.story ||
                'From intimate gatherings to grand celebrations, we bring creativity, precision and heart to every event we plan across Uttarakhand.'}
            </p>

            <ul className="mt-8 space-y-4">
              {(settings?.about.whyChooseUs || []).slice(0, 3).map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-[var(--color-muted)] sm:text-base">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-gold)]" />
                  {item}
                </li>
              ))}
            </ul>

            <Link to="/about" className="mt-10 inline-block">
              <Button variant="outline" icon={<FiArrowRight />}>
                Discover Our Story
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ---------------- SERVICES ---------------- */}
      <section className="border-y border-[var(--color-line)] bg-[var(--color-charcoal)] py-24 sm:py-32">
        <div className="container-custom">
          <SectionHeading
            eyebrow="What We Offer"
            title="Signature Services"
            description="Every celebration is unique — explore the experiences we craft, tailored precisely to your vision."
          />

          {servicesLoading ? (
            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <RevealGroup className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
              {services.map((service) => {
                const Icon = getFaIcon(service.icon);
                return (
                  <motion.div key={service._id} variants={fadeUp}>
                    <Link
                      to={`/services/${service.slug}`}
                      className="group relative flex h-full flex-col border border-[var(--color-line)] bg-[var(--color-ink)] p-8 transition-colors duration-500 hover:border-[var(--color-gold)]/50"
                    >
                      <Icon className="text-3xl text-[var(--color-gold)]" />
                      <h3 className="mt-6 font-display text-2xl text-[var(--color-cream)]">
                        {service.title}
                      </h3>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-muted)]">
                        {service.shortDescription}
                      </p>
                      <span className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--color-gold)]">
                        Explore
                        <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5" />
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </RevealGroup>
          )}

          <div className="mt-14 flex justify-center">
            <Link to="/services">
              <Button variant="outline" size="lg" icon={<FiArrowRight />}>
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- STATISTICS ---------------- */}
      {stats.length > 0 && (
        <section className="relative overflow-hidden py-20 sm:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(201,162,39,0.08),_transparent_60%)]" />
          <div className="container-custom relative grid grid-cols-2 gap-10 sm:grid-cols-4">
            {stats.map((stat, idx) => (
              <Reveal key={idx} variants={scaleIn} className="text-center">
                <p className="font-display text-4xl text-[var(--color-gold)] sm:text-5xl lg:text-6xl">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-3 text-xs uppercase tracking-widest text-[var(--color-muted)] sm:text-sm">
                  {stat.label}
                </p>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- FEATURED GALLERY ---------------- */}
      <section className="py-24 sm:py-32">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Portfolio"
            title="Moments We've Created"
            description="A glimpse into the weddings, celebrations and gatherings we've had the honour of bringing to life."
          />

          {galleryLoading ? (
            <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full" />
              ))}
            </div>
          ) : gallery.length > 0 ? (
            <RevealGroup className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4" stagger={0.06}>
              {gallery.map((item, idx) => (
                <motion.button
                  key={item._id}
                  variants={scaleIn}
                  onClick={() => setLightboxIndex(idx)}
                  className={cn(
                    'group relative aspect-square w-full overflow-hidden',
                    idx === 0 && 'col-span-2 row-span-2 aspect-auto sm:aspect-square'
                  )}
                >
                  <OptimizedImage
                    src={item.image.url}
                    alt={item.image.alt || item.title}
                    wrapperClassName="h-full w-full"
                    className="transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/0 to-black/0 p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <p className="text-sm text-[var(--color-cream)]">{item.title}</p>
                  </div>
                </motion.button>
              ))}
            </RevealGroup>
          ) : null}

          <div className="mt-14 flex justify-center">
            <Link to="/gallery">
              <Button variant="outline" size="lg" icon={<FiArrowRight />}>
                View Full Gallery
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Lightbox
        images={lightboxImages}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />

      {/* ---------------- PROCESS ---------------- */}
      {process.length > 0 && (
        <section className="border-y border-[var(--color-line)] bg-[var(--color-charcoal)] py-24 sm:py-32">
          <div className="container-custom">
            <SectionHeading
              eyebrow="How We Work"
              title="Our Process"
              description="A refined, transparent approach that takes your event from first conversation to final applause."
            />

            <RevealGroup
              className="relative mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4"
              stagger={0.12}
            >
              <div className="absolute left-0 right-0 top-8 hidden h-px bg-[var(--color-line)] lg:block" />
              {process.map((step) => (
                <motion.div key={step.step} variants={fadeUp} className="relative">
                  <div className="relative z-10 flex h-16 w-16 items-center justify-center border border-[var(--color-gold)]/50 bg-[var(--color-charcoal)] font-display text-2xl text-[var(--color-gold)]">
                    {String(step.step).padStart(2, '0')}
                  </div>
                  <h3 className="mt-6 font-display text-xl text-[var(--color-cream)] sm:text-2xl">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </RevealGroup>
          </div>
        </section>
      )}

      {/* ---------------- TESTIMONIALS ---------------- */}
      {!testimonialsLoading && testimonials.length > 0 && (
        <section className="py-24 sm:py-32">
          <div className="container-custom">
            <SectionHeading
              eyebrow="Kind Words"
              title="What Our Clients Say"
              description="The trust of the families and businesses we've served means everything to us."
            />

            <Reveal className="mt-16">
              <Swiper
                modules={[Autoplay, Pagination]}
                slidesPerView={1}
                spaceBetween={32}
                loop={testimonials.length > 1}
                autoplay={{ delay: 5500, disableOnInteraction: false }}
                pagination={{ clickable: true, el: '.testimonial-pagination' }}
                breakpoints={{
                  768: { slidesPerView: 2 },
                  1200: { slidesPerView: 3 },
                }}
                className="!pb-4"
              >
                {testimonials.map((t) => (
                  <SwiperSlide key={t._id} className="h-auto">
                    <div className="flex h-full flex-col border border-[var(--color-line)] bg-[var(--color-charcoal)] p-8">
                      <FaQuoteLeft className="text-2xl text-[var(--color-gold)]/40" />
                      <p className="mt-6 flex-1 text-base leading-relaxed text-[var(--color-cream)]/90">
                        &ldquo;{t.content}&rdquo;
                      </p>
                      <div className="mt-8 flex items-center gap-1 text-[var(--color-gold)]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FaStar key={i} className={i < t.rating ? 'opacity-100' : 'opacity-20'} size={13} />
                        ))}
                      </div>
                      <div className="mt-4 flex items-center gap-4 border-t border-[var(--color-line)] pt-5">
                        {t.avatar?.url ? (
                          <OptimizedImage
                            src={t.avatar.url}
                            alt={t.name}
                            wrapperClassName="h-12 w-12 shrink-0 rounded-full"
                            className="rounded-full"
                          />
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-graphite)] font-display text-lg text-[var(--color-gold)]">
                            {t.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-[var(--color-cream)]">{t.name}</p>
                          <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">
                            {t.eventType || t.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="testimonial-pagination mt-10 flex justify-center gap-2 [&_.swiper-pagination-bullet]:h-1.5 [&_.swiper-pagination-bullet]:w-6 [&_.swiper-pagination-bullet]:rounded-none [&_.swiper-pagination-bullet]:bg-[var(--color-line)] [&_.swiper-pagination-bullet]:opacity-100 [&_.swiper-pagination-bullet]:transition-all [&_.swiper-pagination-bullet-active]:bg-[var(--color-gold)]" />
            </Reveal>
          </div>
        </section>
      )}

      {/* ---------------- FAQ ---------------- */}
      {faqs.length > 0 && (
        <section className="border-y border-[var(--color-line)] bg-[var(--color-charcoal)] py-24 sm:py-32">
          <div className="container-custom max-w-4xl">
            <SectionHeading
              eyebrow="FAQs"
              title="Common Questions"
              description="Answers to what clients most often ask us before booking their event."
            />
            <div className="mt-14">
              <FAQAccordion faqs={faqs} />
            </div>
          </div>
        </section>
      )}

      {/* ---------------- CTA BAND ---------------- */}
      <section className="relative overflow-hidden py-24 sm:py-28">
        <div className="absolute inset-0">
          <OptimizedImage
            src={IMAGES.pages.cta}
            alt="Celebration"
            wrapperClassName="h-full w-full"
          />
          <div className="absolute inset-0 bg-[var(--color-ink)]/85" />
        </div>
        <Reveal variants={reveal} className="container-custom relative text-center">
          <p className="eyebrow mb-5">Let's Get Started</p>
          <h2 className="mx-auto max-w-2xl font-display text-4xl leading-[1.15] text-[var(--color-cream)] sm:text-5xl">
            Ready to Plan an Event That Feels Effortlessly Yours?
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[var(--color-muted)]">
            Share your vision with us and let's begin crafting a celebration your guests will
            remember for years to come.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-5">
            <MagneticButton>
              <Link to="/contact">
                <Button size="lg" icon={<FiArrowUpRight />}>
                  Get a Free Consultation
                </Button>
              </Link>
            </MagneticButton>
            <a href={`tel:${settings?.phone || SITE.phone}`}>
              <Button variant="outline" size="lg" icon={<FiPhone />} iconPosition="left">
                {settings?.phone || SITE.phone}
              </Button>
            </a>
          </div>
        </Reveal>
      </section>

      {/* ---------------- LATEST BLOGS ---------------- */}
      <section className="py-24 sm:py-32">
        <div className="container-custom">
          <SectionHeading
            eyebrow="From the Journal"
            title="Latest Insights"
            description="Planning tips, trends and stories from behind the scenes of our celebrations."
          />

          {blogsLoading ? (
            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : blogs.length > 0 ? (
            <RevealGroup className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
              {blogs.map((blog) => (
                <motion.div key={blog._id} variants={fadeUp}>
                  <Link to={`/blog/${blog.slug}`} className="group block">
                    <div className="aspect-[4/3] w-full overflow-hidden">
                      <OptimizedImage
                        src={blog.featuredImage.url}
                        alt={blog.featuredImage.alt || blog.title}
                        wrapperClassName="h-full w-full"
                        className="transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <p className="mt-5 text-xs uppercase tracking-widest text-[var(--color-gold)]">
                      {blog.category}
                    </p>
                    <h3 className="mt-2 font-display text-2xl text-[var(--color-cream)] transition-colors duration-300 group-hover:text-[var(--color-gold)]">
                      {blog.title}
                    </h3>
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[var(--color-muted)]">
                      {blog.excerpt}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--color-cream)]">
                      Read More
                      <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </RevealGroup>
          ) : null}

          <div className="mt-14 flex justify-center">
            <Link to="/blog">
              <Button variant="outline" size="lg" icon={<FiArrowRight />}>
                View All Articles
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- MAP ---------------- */}
      <section className="border-t border-[var(--color-line)] bg-[var(--color-charcoal)] py-24 sm:py-32">
        <div className="container-custom grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.4fr]">
          <Reveal variants={slideInLeft}>
            <p className="eyebrow mb-4">Visit Us</p>
            <h2 className="font-display text-3xl leading-tight text-[var(--color-cream)] sm:text-4xl">
              Find Our Studio
            </h2>
            <ul className="mt-8 space-y-6 text-sm text-[var(--color-muted)] sm:text-base">
              <li className="flex items-start gap-4">
                <FiMapPin className="mt-0.5 shrink-0 text-[var(--color-gold)]" size={18} />
                <span>
                  {(settings?.address.street || SITE.address.street) + ', '}
                  {(settings?.address.city || SITE.address.city) + ', '}
                  {settings?.address.state || SITE.address.state}{' '}
                  {settings?.address.pincode || SITE.address.pincode}
                </span>
              </li>
              <li className="flex items-center gap-4">
                <FiPhone className="shrink-0 text-[var(--color-gold)]" size={18} />
                <a href={`tel:${settings?.phone || SITE.phone}`} className="hover:text-[var(--color-gold)]">
                  {settings?.phone || SITE.phone}
                </a>
              </li>
              <li className="flex items-start gap-4">
                <FiClock className="mt-0.5 shrink-0 text-[var(--color-gold)]" size={18} />
                <span>{settings?.businessHours.weekdays || '9:00 AM – 7:00 PM, Mon – Fri'}</span>
              </li>
            </ul>
            <Link to="/contact" className="mt-9 inline-block">
              <Button icon={<FiArrowRight />}>Get Directions</Button>
            </Link>
          </Reveal>

          <Reveal variants={slideInRight} className="h-[380px] w-full overflow-hidden sm:h-[450px]">
            <iframe
              src={settings?.mapEmbedUrl || DEFAULT_MAP_EMBED}
              title="Studio location map"
              loading="lazy"
              className="h-full w-full grayscale invert-[92%] contrast-[90%]"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
