import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

import { settingsApi } from '@/api';
import { SEO } from '@/components/seo/SEO';
import { JsonLd, breadcrumbSchema } from '@/components/seo/JsonLd';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { SkeletonText } from '@/components/ui/Skeleton';
import { SITE } from '@/constants';

export default function Terms() {
  const [content, setContent] = useState('');
  const [companyName, setCompanyName] = useState<string>(SITE.fullName);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    settingsApi
      .getTerms()
      .then((res) => {
        if (!mounted) return;
        setContent(res.data.content);
        setCompanyName(res.data.companyName || SITE.fullName);
      })
      .catch(() => {})
      .finally(() => mounted && setIsLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <SEO
        title="Terms & Conditions"
        description={`Read the terms and conditions governing the use of ${companyName}'s website and event management services.`}
        url="/terms-conditions"
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Terms & Conditions', url: '/terms-conditions' },
        ])}
      />

      <section className="border-b border-[var(--color-line)] pb-14 pt-32 sm:pt-40">
        <div className="container-custom">
          <Breadcrumb
            items={[{ label: 'Home', to: '/' }, { label: 'Terms & Conditions' }]}
            className="mb-6"
          />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl text-[var(--color-cream)] sm:text-5xl"
          >
            Terms &amp; Conditions
          </motion.h1>
          <p className="mt-4 text-sm text-[var(--color-muted)]">
            Last updated: {format(new Date(), 'MMMM d, yyyy')}
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-custom max-w-3xl">
          {isLoading ? (
            <SkeletonText lines={10} />
          ) : content ? (
            <div className="prose-luxury" dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            <div className="prose-luxury">
              <p>
                These terms and conditions govern your use of the {companyName} website and the
                booking of our event planning services. By engaging our services, you agree to
                the terms outlined below.
              </p>
              <h2>Bookings & Payments</h2>
              <p>
                A confirmation deposit is required to secure your event date. Full payment
                schedules will be outlined in your service agreement prior to the event.
              </p>
              <h2>Cancellations & Rescheduling</h2>
              <p>
                Cancellation and rescheduling policies vary depending on the services booked and
                the notice period provided. Please refer to your signed agreement for specific
                terms.
              </p>
              <h2>Client Responsibilities</h2>
              <p>
                Clients are responsible for providing accurate event details and timely
                approvals to ensure smooth planning and execution.
              </p>
              <h2>Limitation of Liability</h2>
              <p>
                While we take every precaution to ensure your event runs smoothly, {companyName}{' '}
                shall not be held liable for circumstances beyond our reasonable control.
              </p>
              <h2>Contact Us</h2>
              <p>
                For any questions regarding these terms, please contact us at {SITE.email}.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
