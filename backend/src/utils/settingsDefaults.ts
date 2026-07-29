import type { Prisma } from '@prisma/client';

export const defaultAddress = {
  street: 'Near Talli Haldwani, Nainital Road',
  city: 'Haldwani',
  state: 'Uttarakhand',
  pincode: '263139',
  country: 'India',
};

export const defaultBusinessHours = {
  weekdays: '9:00 AM – 7:00 PM',
  saturday: '10:00 AM – 5:00 PM',
  sunday: 'By Appointment',
};

export const defaultSocialLinks = {
  facebook: 'https://facebook.com/sharmaevents',
  instagram: 'https://instagram.com/sharmaevents',
  youtube: 'https://youtube.com/@sharmaevents',
  twitter: '',
  linkedin: '',
};

export const defaultSmtp = {
  host: 'smtp.gmail.com',
  port: 587,
  user: '',
  pass: '',
  from: 'Sharma Event Management <noreply@sharmaevents.com>',
};

export const defaultSeo = {
  metaTitle: 'Sharma Event Management | Wedding & Event Planners in Haldwani',
  metaDescription:
    'Premium wedding, corporate and social event planning across Haldwani, Kathgodam and Nainital, Uttarakhand.',
  metaKeywords: ['event management haldwani', 'wedding planner kathgodam', 'events nainital'],
  ogImage: '',
};

export const defaultAbout = {
  story: '',
  mission: '',
  vision: '',
  timeline: [] as Array<{ year: string; title: string; description: string }>,
  values: [] as Array<{ title: string; description: string; icon: string }>,
  team: [] as Array<{
    name: string;
    role: string;
    bio: string;
    image: string;
    social?: { linkedin?: string; instagram?: string };
  }>,
  whyChooseUs: [] as string[],
};

export const defaultHome = {
  heroTitle: 'Moments Worth Remembering',
  heroSubtitle: 'Premium event planning across Haldwani, Kathgodam & Nainital',
  heroImage: '',
  heroCta: 'Plan Your Event',
  stats: [] as Array<{ label: string; value: number; suffix: string }>,
  process: [] as Array<{ step: number; title: string; description: string }>,
  faqs: [] as Array<{ question: string; answer: string }>,
};

export const defaultMapEmbedUrl =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3476.5!2d79.5125!3d29.2183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDEzJzA1LjkiTiA3OcKwMzAnNDUuMCJF!5e0!3m2!1sen!2sin!4v1';

export function buildDefaultSettingsData(
  overrides: Record<string, unknown> = {}
): Prisma.SettingsCreateInput {
  return {
    companyName: 'Sharma Event Management',
    tagline: 'Crafting Unforgettable Moments in Uttarakhand',
    logo: '/logo.svg',
    logoDark: '/logo-dark.svg',
    favicon: '/favicon.ico',
    email: 'hello@sharmaevents.com',
    phone: '+91 98765 43210',
    whatsapp: '+919876543210',
    address: defaultAddress,
    businessHours: defaultBusinessHours,
    socialLinks: defaultSocialLinks,
    mapEmbedUrl: defaultMapEmbedUrl,
    smtp: defaultSmtp,
    seoDefaults: defaultSeo,
    about: defaultAbout,
    home: defaultHome,
    privacyPolicy: '',
    termsConditions: '',
    newsletterEnabled: true,
    ...overrides,
  };
}
