import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';
import { FiMapPin, FiMail, FiPhone } from 'react-icons/fi';
import { NAV_LINKS, FOOTER_LINKS, SITE } from '@/constants';
import { NewsletterForm } from '@/components/common/NewsletterForm';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-line)] bg-[var(--color-charcoal)]">
      <div className="container-custom py-20">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Link to="/" className="font-display text-3xl text-[var(--color-cream)]">
              Sharma <span className="text-[var(--color-gold)]">Events</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[var(--color-muted)]">
              {SITE.description}
            </p>
            <div className="mt-8 flex items-center gap-4">
              {[
                { href: SITE.social.facebook, Icon: FaFacebookF, label: 'Facebook' },
                { href: SITE.social.instagram, Icon: FaInstagram, label: 'Instagram' },
                { href: SITE.social.youtube, Icon: FaYoutube, label: 'YouTube' },
              ]
                .filter((item) => item.href)
                .map(({ href, Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center border border-[var(--color-line)] text-[var(--color-muted)] transition-all duration-300 hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
                  >
                    <Icon size={15} />
                  </a>
                ))}
            </div>
          </div>

          <div>
            <h4 className="eyebrow mb-6">Explore</h4>
            <ul className="space-y-3.5">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-[var(--color-muted)] transition-colors duration-300 hover:text-[var(--color-gold)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="eyebrow mb-6">Company</h4>
            <ul className="space-y-3.5">
              {[...FOOTER_LINKS.support, ...FOOTER_LINKS.legal].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-[var(--color-muted)] transition-colors duration-300 hover:text-[var(--color-gold)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="eyebrow mb-6">Stay Updated</h4>
            <p className="mb-5 text-sm leading-relaxed text-[var(--color-muted)]">
              Subscribe for planning inspiration and seasonal offers.
            </p>
            <NewsletterForm className="mb-8" />

            <ul className="space-y-3 text-sm text-[var(--color-muted)]">
              <li className="flex items-start gap-3">
                <FiMapPin className="mt-0.5 shrink-0 text-[var(--color-gold)]" size={15} />
                <span>
                  {SITE.address.street}, {SITE.address.city}, {SITE.address.state} {SITE.address.pincode}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="shrink-0 text-[var(--color-gold)]" size={15} />
                <a href={`tel:${SITE.phoneRaw}`} className="hover:text-[var(--color-gold)]">
                  {SITE.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="shrink-0 text-[var(--color-gold)]" size={15} />
                <a href={`mailto:${SITE.email}`} className="hover:text-[var(--color-gold)]">
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="hairline" />

      <div className="container-custom flex flex-col items-center justify-between gap-4 py-6 text-xs text-[var(--color-muted)] sm:flex-row">
        <p>&copy; {year} Sharma Event Management. All rights reserved.</p>
        <p className="uppercase tracking-widest">Crafted for unforgettable moments in Uttarakhand</p>
      </div>
    </footer>
  );
}
