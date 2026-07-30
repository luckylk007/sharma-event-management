import { IMAGES } from '@/constants/images';
import { privacyPolicyHtml, termsConditionsHtml } from './contentHtml';
import type { Settings } from '@/types';

const now = '2026-01-01T00:00:00.000Z';

export const staticSettings: Settings = {
  _id: 'settings-1',
  companyName: 'Sharma Event Management',
  tagline: 'Crafting Unforgettable Moments in Uttarakhand',
  logo: '/logo.svg',
  logoDark: '/logo-dark.svg',
  favicon: '/favicon.ico',
  email: 'info@sharmaeventmanagement.com',
  phone: '+91 94120 12345',
  whatsapp: '+919412012345',
  address: {
    street: 'Nainital Road, Near Rajpura Chauraha',
    city: 'Haldwani',
    state: 'Uttarakhand',
    pincode: '263139',
    country: 'India',
  },
  businessHours: {
    weekdays: '9:00 AM – 7:00 PM',
    saturday: '10:00 AM – 6:00 PM',
    sunday: 'By Appointment Only',
  },
  socialLinks: {
    facebook: 'https://facebook.com/sharmaeventmanagement',
    instagram: 'https://instagram.com/sharmaeventmanagement',
    youtube: 'https://youtube.com/@sharmaeventmanagement',
    twitter: '',
    linkedin: '',
  },
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13767.5!2d79.5199!3d29.2183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDEzJzA1LjkiTiA3OcKwMzEnMTEuNiJF!5e0!3m2!1sen!2sin!4v1700000000000',
  seoDefaults: {
    metaTitle: 'Sharma Event Management | Best Event Planners in Haldwani, Kathgodam & Nainital',
    metaDescription:
      "Sharma Event Management is Haldwani's premium event planning company, specialising in weddings, corporate events, birthday parties, kitty parties and Mata Ka Jagrata across Haldwani, Kathgodam, Nainital and Rudrapur.",
    keywords: [
      'event management Haldwani',
      'wedding planner Haldwani',
      'event planner Kathgodam',
      'corporate events Uttarakhand',
      'birthday party planner Haldwani',
      'Mata Ka Jagrata organizer',
    ],
    ogTitle: 'Sharma Event Management | Premium Events in Haldwani & Kumaon',
    ogDescription:
      'From dream weddings to corporate conferences, we plan and execute unforgettable events across Haldwani, Kathgodam, Nainital and Rudrapur.',
    ogImage: IMAGES.wedding.hero,
  },
  about: {
    story:
      "<p>Sharma Event Management was founded in Haldwani over a decade ago with a simple belief: every celebration, big or small, deserves the same level of care, creativity and precision. What began as a small family-run decor business serving local weddings has grown into one of Kumaon's most trusted full-service event management companies, now serving families and businesses across Haldwani, Kathgodam, Nainital and Rudrapur.</p><p>Over the years, we have had the privilege of planning and executing hundreds of weddings, corporate conferences, birthday celebrations, kitty parties and religious functions, including countless Mata Ka Jagrata evenings that hold deep meaning for the families who trust us with them.</p>",
    mission:
      'To design and deliver exceptional, stress-free celebrations for every client by combining meticulous planning, creative design and genuine local expertise across Haldwani, Kathgodam, Nainital and Rudrapur.',
    vision:
      "To be recognised as the most trusted and creative event management company in Uttarakhand, known for transforming every occasion into a lasting memory for our clients and their guests.",
    timeline: [
      { year: '2014', title: 'The Beginning', description: 'Sharma Event Management was founded in Haldwani as a small decor and catering coordination service for local weddings.' },
      { year: '2016', title: 'Expansion to Kathgodam', description: 'We opened our services to Kathgodam, taking on our first large-scale banquet weddings and corporate gatherings.' },
      { year: '2018', title: '200th Event Milestone', description: 'We celebrated the successful planning and execution of our 200th event, spanning weddings, birthdays and religious functions.' },
      { year: '2021', title: 'Corporate Division Launched', description: 'In response to growing demand, we launched a dedicated corporate events division serving businesses across the region.' },
      { year: '2024', title: '500+ Events and Counting', description: 'Today we proudly serve Haldwani, Kathgodam, Nainital and Rudrapur, having successfully executed over 500 celebrations.' },
    ],
    values: [
      { title: 'Excellence', description: 'We hold every detail, from the smallest table setting to the grandest stage design, to the highest standard.', icon: 'FaAward' },
      { title: 'Integrity', description: 'We believe in transparent pricing, honest timelines, and always doing right by our clients.', icon: 'FaHandshake' },
      { title: 'Creativity', description: 'Every event we plan is designed to reflect the unique personality and story of the people celebrating it.', icon: 'FaLightbulb' },
      { title: 'Client-First', description: 'Your vision and comfort always come first. We listen carefully and adapt to make every celebration truly yours.', icon: 'FaHeart' },
    ],
    team: [
      {
        name: 'Rajesh Sharma',
        role: 'Founder & Chief Event Planner',
        bio: 'With over 12 years of experience, Rajesh founded Sharma Event Management with a passion for turning ordinary celebrations into extraordinary memories across Kumaon.',
        image: IMAGES.team.founder,
        social: { linkedin: 'https://linkedin.com', instagram: 'https://instagram.com' },
      },
      {
        name: 'Priya Sharma',
        role: 'Creative Director',
        bio: 'Priya leads decor and design for every event, bringing a keen eye for colour, theme and detail to weddings and celebrations across Haldwani and Nainital.',
        image: IMAGES.team.creative,
        social: { linkedin: 'https://linkedin.com', instagram: 'https://instagram.com' },
      },
      {
        name: 'Amit Joshi',
        role: 'Head of Operations',
        bio: 'Amit manages vendor coordination and on-ground execution, ensuring every event across Kathgodam and Rudrapur runs precisely on schedule.',
        image: IMAGES.team.operations,
        social: { linkedin: 'https://linkedin.com', instagram: 'https://instagram.com' },
      },
    ],
    whyChooseUs: [
      'Over 10 years of local experience planning events across Haldwani, Kathgodam, Nainital and Rudrapur',
      "Strong, long-standing relationships with the region's best venues, caterers and decorators",
      'Transparent, itemised pricing with no hidden costs or last-minute surprises',
      'Dedicated on-ground team present at every event from setup to breakdown',
      'Custom design and theme development tailored to your vision and budget',
      'Proven track record with 500+ successfully executed weddings, corporate events and celebrations',
    ],
  },
  home: {
    heroTitle: 'Creating Unforgettable Moments Across Uttarakhand',
    heroSubtitle:
      'Premium wedding, corporate, birthday and celebration planning across Haldwani, Kathgodam, Nainital and Rudrapur.',
    heroImage: IMAGES.pages.homeHero,
    heroCta: 'Plan Your Event',
    stats: [
      { label: 'Events Executed', value: 500, suffix: '+' },
      { label: 'Happy Clients', value: 450, suffix: '+' },
      { label: 'Years of Experience', value: 10, suffix: '+' },
      { label: 'Cities Served', value: 4, suffix: '+' },
    ],
    process: [
      { step: 1, title: 'Consultation', description: 'We start with a detailed conversation to understand your vision, budget and event requirements.' },
      { step: 2, title: 'Planning & Design', description: 'Our team crafts a custom theme, timeline and budget plan tailored to your celebration.' },
      { step: 3, title: 'Vendor Coordination', description: 'We book and coordinate every vendor, from caterers to decorators to entertainment providers.' },
      { step: 4, title: 'Flawless Execution', description: 'On the big day, our on-ground team manages every detail so you can simply enjoy the celebration.' },
    ],
    faqs: [
      {
        question: 'Which cities does Sharma Event Management serve?',
        answer:
          'We proudly serve Haldwani, Kathgodam, Nainital and Rudrapur, along with surrounding areas across the Kumaon region of Uttarakhand.',
      },
      {
        question: 'What types of events do you plan?',
        answer:
          'We plan weddings, corporate events, birthday and private parties, kitty parties, and Mata Ka Jagrata celebrations, along with other custom events on request.',
      },
      {
        question: 'How far in advance should I book your services?',
        answer:
          'We recommend booking at least 6-8 weeks in advance for weddings and large events, and 2-3 weeks for smaller celebrations, though we can often accommodate shorter timelines.',
      },
      {
        question: 'Do you offer customised packages based on budget?',
        answer:
          'Yes, every package we offer can be customised based on your specific guest count, venue and budget. We are happy to build a fully bespoke proposal for your event.',
      },
      {
        question: 'How can I get a quote for my event?',
        answer:
          'Simply reach out through our contact page or WhatsApp, and our team will schedule a consultation to understand your requirements and provide a detailed quote.',
      },
    ],
  },
  privacyPolicy: privacyPolicyHtml,
  termsConditions: termsConditionsHtml,
  newsletterEnabled: true,
  createdAt: now,
  updatedAt: now,
};

/** Digits-only WhatsApp number for wa.me links */
export const whatsappNumber = staticSettings.whatsapp.replace(/\D/g, '');
