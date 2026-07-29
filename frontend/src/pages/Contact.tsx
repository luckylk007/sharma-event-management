import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiMail, FiClock, FiArrowRight } from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa';

import { useSettings } from '@/hooks/useSettings';
import { SEO } from '@/components/seo/SEO';
import { JsonLd, breadcrumbSchema, localBusinessSchema } from '@/components/seo/JsonLd';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ContactForm } from '@/components/common/ContactForm';
import { Reveal } from '@/components/common/Reveal';
import { slideInLeft, slideInRight } from '@/animations/variants';
import { SITE, DEFAULT_MAP_EMBED } from '@/constants';
import { IMAGES } from '@/constants/images';

export default function Contact() {
  const { settings } = useSettings();

  const address = settings?.address || SITE.address;
  const phone = settings?.phone || SITE.phone;
  const email = settings?.email || SITE.email;
  const whatsapp = settings?.whatsapp || SITE.whatsapp;
  const hours = settings?.businessHours;
  const social = settings?.socialLinks || SITE.social;
  const mapEmbedUrl = settings?.mapEmbedUrl || DEFAULT_MAP_EMBED;

  const whatsappHref = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    "Hi! I'd like to enquire about planning an event."
  )}`;

  const infoItems = [
    {
      Icon: FiMapPin,
      label: 'Visit Our Studio',
      lines: [address.street, `${address.city}, ${address.state} ${address.pincode}`],
    },
    {
      Icon: FiPhone,
      label: 'Call Us',
      lines: [phone],
      href: `tel:${phone}`,
    },
    {
      Icon: FiMail,
      label: 'Email Us',
      lines: [email],
      href: `mailto:${email}`,
    },
    {
      Icon: FiClock,
      label: 'Business Hours',
      lines: [
        `Mon – Fri: ${hours?.weekdays || '9:00 AM – 7:00 PM'}`,
        `Saturday: ${hours?.saturday || '10:00 AM – 5:00 PM'}`,
        `Sunday: ${hours?.sunday || 'By Appointment'}`,
      ],
    },
  ];

  const socialLinks = [
    { href: social.facebook, Icon: FaFacebookF, label: 'Facebook' },
    { href: social.instagram, Icon: FaInstagram, label: 'Instagram' },
    { href: social.youtube, Icon: FaYoutube, label: 'YouTube' },
  ].filter((s) => s.href);

  return (
    <>
      <SEO
        title="Contact Us"
        description={`Get in touch with ${
          settings?.companyName || SITE.fullName
        } to start planning your wedding, corporate event, birthday or celebration in Haldwani, Kathgodam and Nainital.`}
        url="/contact"
      />
      <JsonLd
        data={[
          localBusinessSchema(),
          breadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Contact', url: '/contact' },
          ]),
        ]}
      />

      {/* ---------------- HERO ---------------- */}
      <section className="relative flex h-[50svh] min-h-[380px] w-full items-end overflow-hidden bg-[var(--color-ink)]">
        <img
          src={IMAGES.pages.contactHero}
          alt="Contact us"
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)] via-[var(--color-ink)]/70 to-black/75" />
        <div className="container-custom relative z-10 pb-14 pt-32">
          <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} className="mb-6" />
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl font-display text-5xl leading-[1.05] text-[var(--color-cream)] sm:text-6xl lg:text-7xl"
          >
            Let's Start Planning
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="mt-5 max-w-xl text-[var(--color-muted)]"
          >
            Tell us a little about your celebration — our team usually responds within 24 hours.
          </motion.p>
        </div>
      </section>

      {/* ---------------- INFO + FORM ---------------- */}
      <section className="py-24 sm:py-32">
        <div className="container-custom grid grid-cols-1 gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <Reveal variants={slideInLeft}>
            <p className="eyebrow mb-4">Get In Touch</p>
            <h2 className="font-display text-3xl leading-[1.15] text-[var(--color-cream)] sm:text-4xl">
              We'd Love to Hear About Your Event
            </h2>
            <p className="mt-5 leading-relaxed text-[var(--color-muted)]">
              Whether it's an intimate gathering or a grand celebration, reach out and let's
              start crafting something memorable together.
            </p>

            <div className="mt-10 space-y-8">
              {infoItems.map(({ Icon, label, lines, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-[var(--color-line)] text-[var(--color-gold)]">
                    <Icon size={18} />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[var(--color-gold)]">
                      {label}
                    </p>
                    {lines.map((line, idx) =>
                      href && idx === 0 ? (
                        <a
                          key={idx}
                          href={href}
                          className="mt-1.5 block text-sm text-[var(--color-cream)] transition-colors hover:text-[var(--color-gold)] sm:text-base"
                        >
                          {line}
                        </a>
                      ) : (
                        <p key={idx} className="mt-1.5 text-sm text-[var(--color-muted)] sm:text-base">
                          {line}
                        </p>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-[#25D366] px-6 py-3.5 text-sm uppercase tracking-widest text-white transition-transform duration-300 hover:-translate-y-0.5"
              >
                <FaWhatsapp size={18} />
                Chat on WhatsApp
              </a>
              {socialLinks.map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-12 w-12 items-center justify-center border border-[var(--color-line)] text-[var(--color-muted)] transition-all duration-300 hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal
            variants={slideInRight}
            className="border border-[var(--color-line)] bg-[var(--color-charcoal)] p-8 sm:p-12"
          >
            <h3 className="font-display text-2xl text-[var(--color-cream)] sm:text-3xl">
              Send Us an Enquiry
            </h3>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Fill in the details below and our team will get back to you shortly.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- MAP ---------------- */}
      <section className="border-t border-[var(--color-line)]">
        <div className="h-[420px] w-full sm:h-[520px]">
          <iframe
            src={mapEmbedUrl}
            title="Our location"
            loading="lazy"
            className="h-full w-full grayscale invert-[92%] contrast-[90%]"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      {/* ---------------- CTA STRIP ---------------- */}
      <section className="bg-[var(--color-charcoal)] py-14">
        <div className="container-custom flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
          <div>
            <p className="eyebrow mb-2">Prefer to talk directly?</p>
            <p className="font-display text-2xl text-[var(--color-cream)] sm:text-3xl">
              Call us at{' '}
              <a href={`tel:${phone}`} className="text-[var(--color-gold)]">
                {phone}
              </a>
            </p>
          </div>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 border border-[var(--color-gold)] px-7 py-3.5 text-xs uppercase tracking-widest text-[var(--color-gold)] transition-colors duration-300 hover:bg-[var(--color-gold)] hover:text-[var(--color-ink)]"
          >
            Message Us
            <FiArrowRight />
          </a>
        </div>
      </section>
    </>
  );
}
