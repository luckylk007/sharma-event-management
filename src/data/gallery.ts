import { IMAGES } from '@/constants/images';
import type { GalleryItem } from '@/types';

const now = '2026-01-01T00:00:00.000Z';

const posterGallery: GalleryItem[] = IMAGES.posters.map((url, i) => ({
  _id: `gal-poster-${i + 1}`,
  image: {
    url,
    alt: `Mata Ka Jagrata event poster ${i + 1}`,
    width: 3,
    height: 4,
  },
  category: 'Mata Ka Jagrata' as const,
  title: `Jagrata Poster ${i + 1}`,
  isFeatured: i < 4,
  order: i + 1,
  createdAt: now,
  updatedAt: now,
}));

export const staticGallery: GalleryItem[] = [
  { _id: 'gal-1', image: { url: IMAGES.wedding.mandap, alt: 'Wedding mandap floral decor' }, category: 'Wedding', title: 'Floral Wedding Mandap', isFeatured: true, order: 1, createdAt: now, updatedAt: now },
  { _id: 'gal-2', image: { url: IMAGES.wedding.couple, alt: 'Bride and groom ceremony' }, category: 'Wedding', title: 'Wedding Ceremony Moments', isFeatured: true, order: 2, createdAt: now, updatedAt: now },
  { _id: 'gal-3', image: { url: IMAGES.wedding.rituals, alt: 'Hindu wedding pheras ceremony' }, category: 'Wedding', title: 'Wedding Rituals', isFeatured: false, order: 3, createdAt: now, updatedAt: now },
  { _id: 'gal-4', image: { url: IMAGES.wedding.courtyard, alt: 'Indian wedding courtyard with marigolds' }, category: 'Wedding', title: 'Wedding Courtyard Decor', isFeatured: false, order: 4, createdAt: now, updatedAt: now },
  { _id: 'gal-5', image: { url: IMAGES.wedding.bride, alt: 'Indian bride in traditional lehenga' }, category: 'Wedding', title: 'Bridal Portrait', isFeatured: false, order: 5, createdAt: now, updatedAt: now },
  { _id: 'gal-6', image: { url: IMAGES.corporate.conference, alt: 'Indian corporate conference hall' }, category: 'Corporate', title: 'Annual Business Conference', isFeatured: true, order: 1, createdAt: now, updatedAt: now },
  { _id: 'gal-7', image: { url: IMAGES.corporate.stage, alt: 'Indian product launch stage' }, category: 'Corporate', title: 'Product Launch Stage', isFeatured: false, order: 2, createdAt: now, updatedAt: now },
  { _id: 'gal-8', image: { url: IMAGES.corporate.networking, alt: 'Indian corporate networking event' }, category: 'Corporate', title: 'Networking Session', isFeatured: false, order: 3, createdAt: now, updatedAt: now },
  { _id: 'gal-9', image: { url: IMAGES.corporate.meeting, alt: 'Indian business seminar' }, category: 'Corporate', title: 'Dealer Meet Seminar', isFeatured: false, order: 4, createdAt: now, updatedAt: now },
  { _id: 'gal-10', image: { url: IMAGES.corporate.seminar, alt: 'Indian corporate meeting room' }, category: 'Corporate', title: 'Corporate Retreat Setup', isFeatured: false, order: 5, createdAt: now, updatedAt: now },
  { _id: 'gal-11', image: { url: IMAGES.birthday.hero, alt: 'Indian birthday party decor' }, category: 'Birthday', title: 'Themed Balloon Decor', isFeatured: true, order: 1, createdAt: now, updatedAt: now },
  { _id: 'gal-12', image: { url: IMAGES.birthday.cake, alt: 'Indian birthday cake celebration' }, category: 'Birthday', title: 'Birthday Cake Moment', isFeatured: false, order: 2, createdAt: now, updatedAt: now },
  { _id: 'gal-13', image: { url: IMAGES.birthday.kids, alt: 'Indian kids birthday party' }, category: 'Birthday', title: 'Kids Birthday Fun', isFeatured: false, order: 3, createdAt: now, updatedAt: now },
  { _id: 'gal-14', image: { url: IMAGES.birthday.balloons, alt: 'Indian festive birthday balloons' }, category: 'Birthday', title: 'Milestone Birthday', isFeatured: false, order: 4, createdAt: now, updatedAt: now },
  { _id: 'gal-15', image: { url: IMAGES.birthday.celebration, alt: 'Indian family birthday celebration' }, category: 'Birthday', title: 'Birthday Party Setup', isFeatured: false, order: 5, createdAt: now, updatedAt: now },
  { _id: 'gal-16', image: { url: IMAGES.kitty.hero, alt: 'Indian kitty party theme decor' }, category: 'Kitty Party', title: 'Themed Table Setting', isFeatured: true, order: 1, createdAt: now, updatedAt: now },
  { _id: 'gal-17', image: { url: IMAGES.kitty.table, alt: 'Indian ladies kitty lunch table' }, category: 'Kitty Party', title: 'Ladies Kitty Lunch', isFeatured: false, order: 2, createdAt: now, updatedAt: now },
  { _id: 'gal-18', image: { url: IMAGES.kitty.decor, alt: 'Festive Indian kitty party decor' }, category: 'Kitty Party', title: 'Festive Kitty Decor', isFeatured: false, order: 3, createdAt: now, updatedAt: now },
  { _id: 'gal-19', image: { url: IMAGES.kitty.gathering, alt: 'Indian ladies kitty gathering' }, category: 'Kitty Party', title: 'Kitty Party Gathering', isFeatured: false, order: 4, createdAt: now, updatedAt: now },
  { _id: 'gal-20', image: { url: IMAGES.kitty.festive, alt: 'Colorful Indian kitty party setup' }, category: 'Kitty Party', title: 'Colorful Kitty Setup', isFeatured: false, order: 5, createdAt: now, updatedAt: now },
  ...posterGallery,
];
