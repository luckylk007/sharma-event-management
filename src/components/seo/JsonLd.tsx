import { Helmet } from 'react-helmet-async';

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export function JsonLd({ data }: JsonLdProps) {
  const items = Array.isArray(data) ? data : [data];

  return (
    <Helmet>
      {items.map((item, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  );
}

const SITE_URL = 'https://sharmaevents.com';

export function organizationSchema(overrides: Record<string, unknown> = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Sharma Event Management',
    alternateName: 'Sharma Events',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    sameAs: [
      'https://facebook.com/sharmaevents',
      'https://instagram.com/sharmaevents',
      'https://youtube.com/@sharmaevents',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-98765-43210',
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['en', 'hi'],
    },
    ...overrides,
  };
}

export function localBusinessSchema(overrides: Record<string, unknown> = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'EventPlanningService',
    name: 'Sharma Event Management',
    image: `${SITE_URL}/logo.svg`,
    '@id': SITE_URL,
    url: SITE_URL,
    telephone: '+91-98765-43210',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Near Talli Haldwani, Nainital Road',
      addressLocality: 'Haldwani',
      addressRegion: 'Uttarakhand',
      postalCode: '263139',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 29.2183,
      longitude: 79.5130,
    },
    areaServed: ['Haldwani', 'Kathgodam', 'Nainital', 'Uttarakhand'],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '10:00',
        closes: '17:00',
      },
    ],
    sameAs: [
      'https://facebook.com/sharmaevents',
      'https://instagram.com/sharmaevents',
      'https://youtube.com/@sharmaevents',
    ],
    ...overrides,
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function serviceSchema(service: {
  name: string;
  description: string;
  image: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: service.name,
    name: service.name,
    description: service.description,
    image: service.image,
    url: service.url,
    provider: {
      '@type': 'EventPlanningService',
      name: 'Sharma Event Management',
      url: SITE_URL,
    },
    areaServed: ['Haldwani', 'Kathgodam', 'Nainital', 'Uttarakhand'],
  };
}

export function articleSchema(article: {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      '@type': 'Person',
      name: article.authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Sharma Event Management',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
  };
}
