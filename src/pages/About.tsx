import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiArrowUpRight, FiCheck } from 'react-icons/fi';
import { FaInstagram, FaLinkedinIn } from 'react-icons/fa';

import { useSettings } from '@/hooks/useSettings';
import { SEO } from '@/components/seo/SEO';
import { JsonLd, breadcrumbSchema, organizationSchema } from '@/components/seo/JsonLd';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Reveal, RevealGroup } from '@/components/common/Reveal';
import { fadeUp, scaleIn, slideInLeft, slideInRight } from '@/animations/variants';
import { getFaIcon } from '@/utils/iconMap';
import { SITE } from '@/constants';
import { IMAGES } from '@/constants/images';

export default function About() {
  const { settings } = useSettings();

  const companyName = settings?.companyName || SITE.fullName;
  const about = settings?.about;

  return (
    <>
      <SEO
        title="About Us"
        description={`Learn the story, mission and values behind ${companyName} — premium event planners serving Haldwani, Kathgodam and Nainital.`}
        url="/about"
      />
      <JsonLd
        data={[
          organizationSchema(),
          breadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'About', url: '/about' },
          ]),
        ]}
      />

      {/* ---------------- HERO ---------------- */}
      <section className="relative flex h-[60svh] min-h-[440px] w-full items-end overflow-hidden bg-[var(--color-ink)]">
        <OptimizedImage
          src={IMAGES.pages.aboutHero}
          alt={companyName}
          loading="eager"
          wrapperClassName="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)] via-[var(--color-ink)]/70 to-black/75" />
        <div className="container-custom relative z-10 pb-16 pt-32">
          <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'About Us' }]} className="mb-6" />
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl font-display text-5xl leading-[1.05] text-[var(--color-cream)] sm:text-6xl lg:text-7xl"
          >
            The People Behind Your Perfect Day
          </motion.h1>
        </div>
      </section>

      {/* ---------------- STORY ---------------- */}
      <section className="py-24 sm:py-32">
        <div className="container-custom grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal variants={slideInLeft} className="order-2 lg:order-1">
            <p className="eyebrow mb-4">Our Story</p>
            <h2 className="font-display text-4xl leading-[1.1] text-[var(--color-cream)] sm:text-5xl">
              Built on Passion, Grown Through Trust
            </h2>
            <div
              className="mt-6 space-y-5 text-base leading-relaxed text-[var(--color-muted)] sm:text-lg [&_p]:mb-5 [&_p:last-child]:mb-0"
              dangerouslySetInnerHTML={{
                __html: about?.story || `<p>${SITE.description}</p>`,
              }}
            />
          </Reveal>
          <Reveal
            variants={slideInRight}
            className="relative order-1 aspect-[4/5] w-full overflow-hidden lg:order-2"
          >
            <OptimizedImage
              src={IMAGES.pages.aboutStory}
              alt="Our story"
              wrapperClassName="h-full w-full"
            />
          </Reveal>
        </div>
      </section>

      {/* ---------------- MISSION / VISION ---------------- */}
      <section className="border-y border-[var(--color-line)] bg-[var(--color-charcoal)] py-24 sm:py-32">
        <div className="container-custom grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Reveal variants={fadeUp} className="border border-[var(--color-line)] p-10 sm:p-14">
            <p className="eyebrow mb-4">Our Mission</p>
            <h3 className="font-display text-3xl text-[var(--color-cream)] sm:text-4xl">
              Purposeful Celebrations
            </h3>
            <p className="mt-6 leading-relaxed text-[var(--color-muted)]">
              {about?.mission ||
                'To design and deliver flawless events that reflect the true spirit of every celebration — with honesty, creativity and care in every detail.'}
            </p>
          </Reveal>
          <Reveal variants={fadeUp} className="border border-[var(--color-gold)]/40 p-10 sm:p-14">
            <p className="eyebrow mb-4">Our Vision</p>
            <h3 className="font-display text-3xl text-[var(--color-cream)] sm:text-4xl">
              Uttarakhand's Most Trusted Name
            </h3>
            <p className="mt-6 leading-relaxed text-[var(--color-muted)]">
              {about?.vision ||
                'To be the region\'s most trusted event partner, known for elevating every gathering into an unforgettable experience.'}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- TIMELINE ---------------- */}
      {!!about?.timeline?.length && (
        <section className="py-24 sm:py-32">
          <div className="container-custom">
            <SectionHeading
              eyebrow="Our Journey"
              title="Milestones Along the Way"
              description="A decade-long journey defined by growth, trust and unforgettable celebrations."
            />

            <div className="relative mt-16 mx-auto max-w-3xl">
              <div className="absolute bottom-0 left-[7px] top-0 w-px bg-[var(--color-line)] sm:left-1/2" />
              <div className="space-y-12">
                {about.timeline.map((item, idx) => (
                  <Reveal
                    key={idx}
                    variants={idx % 2 === 0 ? slideInLeft : slideInRight}
                    className="relative pl-10 sm:grid sm:grid-cols-2 sm:gap-10 sm:pl-0"
                  >
                    <span className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-[var(--color-gold)] bg-[var(--color-ink)] sm:left-1/2 sm:-translate-x-1/2" />
                    <div
                      className={
                        idx % 2 === 0
                          ? 'sm:col-start-1 sm:pr-14 sm:text-right'
                          : 'sm:col-start-2 sm:pl-14'
                      }
                    >
                      <p className="font-display text-3xl text-[var(--color-gold)]">{item.year}</p>
                      <h4 className="mt-2 font-display text-xl text-[var(--color-cream)]">
                        {item.title}
                      </h4>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                        {item.description}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ---------------- VALUES ---------------- */}
      {!!about?.values?.length && (
        <section className="border-y border-[var(--color-line)] bg-[var(--color-charcoal)] py-24 sm:py-32">
          <div className="container-custom">
            <SectionHeading
              eyebrow="What Drives Us"
              title="Our Core Values"
              description="The principles that guide every decision we make and every event we design."
            />
            <RevealGroup
              className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
              stagger={0.1}
            >
              {about.values.map((value, idx) => {
                const Icon = getFaIcon(value.icon);
                return (
                  <motion.div
                    key={idx}
                    variants={fadeUp}
                    className="border border-[var(--color-line)] bg-[var(--color-ink)] p-8 transition-colors duration-500 hover:border-[var(--color-gold)]/50"
                  >
                    <Icon className="text-3xl text-[var(--color-gold)]" />
                    <h3 className="mt-6 font-display text-xl text-[var(--color-cream)]">
                      {value.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
                      {value.description}
                    </p>
                  </motion.div>
                );
              })}
            </RevealGroup>
          </div>
        </section>
      )}

      {/* ---------------- TEAM ---------------- */}
      {!!about?.team?.length && (
        <section className="py-24 sm:py-32">
          <div className="container-custom">
            <SectionHeading
              eyebrow="Meet The Team"
              title="The Faces Behind the Magic"
              description="A dedicated team of planners, designers and coordinators devoted to your celebration."
            />
            <RevealGroup
              className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
              stagger={0.1}
            >
              {about.team.map((member, idx) => (
                <motion.div key={idx} variants={fadeUp} className="group">
                  <div className="relative aspect-[4/5] w-full overflow-hidden">
                    <OptimizedImage
                      src={member.image}
                      alt={member.name}
                      wrapperClassName="h-full w-full"
                      className="grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                    />
                    {(member.social?.linkedin || member.social?.instagram) && (
                      <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-3 bg-gradient-to-t from-black/80 to-transparent p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                        {member.social?.linkedin && (
                          <a
                            href={member.social.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${member.name} on LinkedIn`}
                            className="flex h-9 w-9 items-center justify-center border border-[var(--color-gold)] text-[var(--color-gold)] transition-colors hover:bg-[var(--color-gold)] hover:text-[var(--color-ink)]"
                          >
                            <FaLinkedinIn size={14} />
                          </a>
                        )}
                        {member.social?.instagram && (
                          <a
                            href={member.social.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${member.name} on Instagram`}
                            className="flex h-9 w-9 items-center justify-center border border-[var(--color-gold)] text-[var(--color-gold)] transition-colors hover:bg-[var(--color-gold)] hover:text-[var(--color-ink)]"
                          >
                            <FaInstagram size={14} />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  <h3 className="mt-6 font-display text-2xl text-[var(--color-cream)]">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-xs uppercase tracking-widest text-[var(--color-gold)]">
                    {member.role}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
                    {member.bio}
                  </p>
                </motion.div>
              ))}
            </RevealGroup>
          </div>
        </section>
      )}

      {/* ---------------- WHY CHOOSE US ---------------- */}
      {!!about?.whyChooseUs?.length && (
        <section className="border-y border-[var(--color-line)] bg-[var(--color-charcoal)] py-24 sm:py-32">
          <div className="container-custom grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <Reveal variants={slideInLeft}>
              <p className="eyebrow mb-4">Why Choose Us</p>
              <h2 className="font-display text-4xl leading-[1.1] text-[var(--color-cream)] sm:text-5xl">
                What Sets {companyName} Apart
              </h2>
              <p className="mt-6 leading-relaxed text-[var(--color-muted)]">
                We combine local expertise with a genuine passion for celebration — here's why
                families and businesses across Uttarakhand trust us with their most important
                days.
              </p>
            </Reveal>
            <RevealGroup className="space-y-5" stagger={0.08}>
              {about.whyChooseUs.map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  className="flex items-start gap-4 border-b border-[var(--color-line)] pb-5"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border border-[var(--color-gold)] text-[var(--color-gold)]">
                    <FiCheck size={13} />
                  </span>
                  <p className="text-sm leading-relaxed text-[var(--color-cream)]/90 sm:text-base">
                    {item}
                  </p>
                </motion.div>
              ))}
            </RevealGroup>
          </div>
        </section>
      )}

      {/* ---------------- CTA ---------------- */}
      <section className="py-24 sm:py-28">
        <Reveal variants={scaleIn} className="container-custom text-center">
          <p className="eyebrow mb-5">Let's Work Together</p>
          <h2 className="mx-auto max-w-2xl font-display text-4xl leading-[1.15] text-[var(--color-cream)] sm:text-5xl">
            Let's Bring Your Vision to Life
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[var(--color-muted)]">
            Tell us about your celebration and discover how our team can craft an experience
            worth remembering.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-5">
            <MagneticButton>
              <Link to="/contact">
                <Button size="lg" icon={<FiArrowUpRight />}>
                  Start Planning
                </Button>
              </Link>
            </MagneticButton>
            <Link to="/services">
              <Button variant="outline" size="lg" icon={<FiArrowRight />}>
                Explore Services
              </Button>
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
