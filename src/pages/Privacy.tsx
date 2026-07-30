import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

import { settingsApi } from '@/api';
import { SEO } from '@/components/seo/SEO';
import { JsonLd, breadcrumbSchema } from '@/components/seo/JsonLd';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { SkeletonText } from '@/components/ui/Skeleton';
import { SITE } from '@/constants';

export default function Privacy() {
  const [content, setContent] = useState('');
  const [companyName, setCompanyName] = useState<string>(SITE.fullName);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    settingsApi
      .getPrivacy()
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
        title="Privacy Policy"
        description={`Read the privacy policy of ${companyName} to understand how we collect, use and protect your information.`}
        url="/privacy-policy"
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Privacy Policy', url: '/privacy-policy' },
        ])}
      />

      <section className="border-b border-[var(--color-line)] pb-14 pt-32 sm:pt-40">
        <div className="container-custom">
          <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Privacy Policy' }]} className="mb-6" />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl text-[var(--color-cream)] sm:text-5xl"
          >
            Privacy Policy
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
                {companyName} ("we", "our", "us") respects your privacy and is committed to
                protecting the personal information you share with us. This policy explains what
                information we collect, how we use it, and the choices you have.
              </p>
              <h2>Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as your name, email
                address, phone number and event details when you submit an enquiry through our
                website or contact us directly.
              </p>
              <h2>How We Use Your Information</h2>
              <p>
                We use the information we collect to respond to your enquiries, plan and deliver
                our event management services, and — with your consent — to send updates about
                our offerings.
              </p>
              <h2>Data Protection</h2>
              <p>
                We take reasonable technical and organisational measures to safeguard your
                personal information against unauthorised access, alteration or disclosure.
              </p>
              <h2>Contact Us</h2>
              <p>
                If you have any questions about this privacy policy, please reach out to us at{' '}
                {SITE.email}.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
