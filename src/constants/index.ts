import type { GalleryCategory } from '@/types';

export const SITE = {
  name: 'Sharma Events',
  fullName: 'Sharma Event Management',
  tagline: 'Crafting Unforgettable Moments in Uttarakhand',
  description:
    'Premium event planning and management across Haldwani, Kathgodam, Nainital and Uttarakhand — weddings, corporate events, birthdays and celebrations.',
  url: 'https://sharma.lacebylennox.in',
  email: 'info@sharmaeventmanagement.com',
  phone: '+91 94120 12345',
  phoneRaw: '+919412012345',
  whatsapp: '+919412012345',
  address: {
    street: 'Nainital Road, Near Rajpura Chauraha',
    city: 'Haldwani',
    state: 'Uttarakhand',
    pincode: '263139',
    country: 'India',
  },
  social: {
    facebook: 'https://facebook.com/sharmaeventmanagement',
    instagram: 'https://instagram.com/sharmaeventmanagement',
    youtube: 'https://youtube.com/@sharmaeventmanagement',
    twitter: '',
    linkedin: '',
  },
} as const;

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
] as const;

export const FOOTER_LINKS = {
  company: [
    { label: 'About Us', to: '/about' },
    { label: 'Our Services', to: '/services' },
    { label: 'Gallery', to: '/gallery' },
    { label: 'Blog', to: '/blog' },
  ],
  legal: [
    { label: 'Privacy Policy', to: '/privacy-policy' },
    { label: 'Terms & Conditions', to: '/terms-conditions' },
  ],
  support: [
    { label: 'Contact Us', to: '/contact' },
    { label: 'Get a Quote', to: '/contact' },
  ],
} as const;

export const GALLERY_CATEGORIES: (GalleryCategory | 'All')[] = [
  'All',
  'Wedding',
  'Corporate',
  'Birthday',
  'Kitty Party',
  'Mata Ka Jagrata',
];

export const SERVICE_LOCATIONS = ['Haldwani', 'Kathgodam', 'Nainital', 'Uttarakhand'] as const;

export const DEFAULT_MAP_EMBED =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3476.5!2d79.5125!3d29.2183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDEzJzA1LjkiTiA3OcKwMzAnNDUuMCJF!5e0!3m2!1sen!2sin!4v1';

export const CONTACT_SUBJECTS = [
  'Wedding Planning',
  'Corporate Event',
  'Birthday Party',
  'Kitty Party',
  'Mata Ka Jagrata',
  'General Enquiry',
] as const;
