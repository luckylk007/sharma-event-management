import { IMAGES } from '@/constants/images';
import type { Testimonial } from '@/types';

const now = '2026-01-01T00:00:00.000Z';

export const staticTestimonials: Testimonial[] = [
  {
    _id: 'tm-1',
    name: 'Ananya & Vikram Rawat',
    role: 'Bride & Groom',
    content:
      'Sharma Event Management made our wedding absolutely magical. From the mandap decor to coordinating every single vendor, their team handled everything so smoothly that we could actually enjoy our own wedding day. Highly recommend them to any couple getting married in Haldwani!',
    rating: 5,
    avatar: { url: IMAGES.avatars.a1, alt: 'Ananya and Vikram Rawat' },
    eventType: 'Wedding',
    isPublished: true,
    order: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: 'tm-2',
    name: 'Deepak Bisht',
    role: 'HR Head, Kumaon Trading Co., Kathgodam',
    content:
      'We hired Sharma Event Management for our annual dealer conference and they exceeded expectations. The stage setup, audio-visual quality and on-ground coordination were all top-notch. Our dealers from across the region were genuinely impressed.',
    rating: 5,
    avatar: { url: IMAGES.avatars.a2, alt: 'Deepak Bisht' },
    eventType: 'Corporate',
    isPublished: true,
    order: 2,
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: 'tm-3',
    name: 'Neha Pandey',
    role: 'Mother of the Birthday Girl',
    content:
      "My daughter's princess-themed birthday party was beyond anything I could have imagined. The decor, the cake, the entertainment, everything was perfect. Sharma Event Management truly understands how to create magical moments for kids.",
    rating: 5,
    avatar: { url: IMAGES.avatars.a3, alt: 'Neha Pandey' },
    eventType: 'Birthday',
    isPublished: true,
    order: 3,
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: 'tm-4',
    name: 'Shalini Joshi',
    role: 'Kitty Group Coordinator, Haldwani',
    content:
      'Our kitty group has used Sharma Event Management for three parties now, and every single time the theme, decor and games have been fantastic. They make our monthly get-togethers something we genuinely look forward to.',
    rating: 5,
    avatar: { url: IMAGES.avatars.a4, alt: 'Shalini Joshi' },
    eventType: 'Kitty Party',
    isPublished: true,
    order: 4,
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: 'tm-5',
    name: 'Ramesh Chandra Pant',
    role: 'Homeowner, Kathgodam',
    content:
      'We organized our family Mata Ka Jagrata through Sharma Event Management and were deeply touched by how respectfully they handled every arrangement. The bhajan mandali, decor and prasad service were all beautifully coordinated through the night.',
    rating: 5,
    avatar: { url: IMAGES.avatars.a5, alt: 'Ramesh Chandra Pant' },
    eventType: 'Mata Ka Jagrata',
    isPublished: true,
    order: 5,
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: 'tm-6',
    name: 'Kavita & Suresh Mehra',
    role: "Bride's Parents",
    content:
      'As parents of the bride, we were nervous about managing a 400-guest wedding, but the Sharma Event Management team took every worry off our shoulders. Their attention to detail and calm, professional approach made all the difference.',
    rating: 4,
    avatar: { url: IMAGES.avatars.a6, alt: 'Kavita and Suresh Mehra' },
    eventType: 'Wedding',
    isPublished: true,
    order: 6,
    createdAt: now,
    updatedAt: now,
  },
  {
    _id: 'tm-7',
    name: 'Anil Rawat',
    role: 'General Manager, Uttarakhand Motors, Rudrapur',
    content:
      'Our product launch event organized by Sharma Event Management was executed flawlessly, from branding to catering to guest coordination. They understood our corporate requirements perfectly and delivered on every promise.',
    rating: 5,
    avatar: { url: IMAGES.avatars.a7, alt: 'Anil Rawat' },
    eventType: 'Corporate',
    isPublished: true,
    order: 7,
    createdAt: now,
    updatedAt: now,
  },
];
