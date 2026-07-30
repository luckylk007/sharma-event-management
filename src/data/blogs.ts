import { IMAGES } from '@/constants/images';
import type { Blog } from '@/types';
import {
  weddingBlogContent,
  corporateBlogContent,
  birthdayBlogContent,
  corporateOrganizerBlogContent,
  jagrataBlogContent,
} from './contentHtml';

const now = '2026-01-01T00:00:00.000Z';
const author = {
  name: 'Rajesh Sharma',
  avatar: IMAGES.team.founder,
  bio: 'Founder of Sharma Event Management with over 12 years of experience planning weddings, corporate events and celebrations across Haldwani, Kathgodam and Nainital.',
};

const baseBlogs = [
  {
    title: 'Best Wedding Planner in Haldwani: Your Complete Guide to Dream Weddings',
    slug: 'best-wedding-planner-haldwani',
    excerpt:
      'Everything you need to know about hiring the best wedding planner in Haldwani, from budgeting and venue selection to what full-service planning actually includes.',
    content: weddingBlogContent,
    featuredImage: {
      url: IMAGES.wedding.hero,
      alt: 'Best wedding planner in Haldwani decorating a wedding mandap',
    },
    category: 'Wedding',
    tags: ['Wedding Planner Haldwani', 'Wedding Planning Uttarakhand', 'Kathgodam Weddings', 'Nainital Weddings'],
    author,
    readingTime: 10,
    isFeatured: true,
    isPublished: true,
    publishedAt: '2026-01-10T00:00:00.000Z',
    faqs: [
      {
        question: 'How much does a wedding planner in Haldwani typically cost?',
        answer:
          'Costs vary based on guest count and decor complexity, typically starting around ₹2,50,000 for intimate weddings and scaling up for larger, multi-day celebrations.',
      },
      {
        question: 'How far in advance should I book a wedding planner in Haldwani?',
        answer:
          'It is best to book at least 3-6 months in advance, especially during the peak wedding season between October and February.',
      },
      {
        question: 'Can a wedding planner help with destination weddings near Nainital?',
        answer:
          'Yes, experienced local planners regularly manage destination-style weddings at resorts near Nainital and Bhimtal, including guest travel and accommodation.',
      },
      {
        question: 'What is included in full wedding planning services?',
        answer:
          'Full-service planning typically includes venue selection, decor design, vendor coordination, guest logistics and complete on-day execution.',
      },
      {
        question: 'Do wedding planners in Haldwani handle small, intimate weddings too?',
        answer:
          'Yes, most professional planners, including Sharma Event Management, handle weddings of every size, from intimate gatherings to grand multi-day celebrations.',
      },
    ],
    seo: {
      metaTitle: 'Best Wedding Planner in Haldwani | Complete Guide 2026',
      metaDescription:
        'Looking for the best wedding planner in Haldwani? Discover expert tips on choosing a planner, budgeting, venues and more for weddings in Haldwani, Kathgodam and Nainital.',
      keywords: ['Wedding Planner Haldwani', 'best wedding planner Haldwani', 'wedding planning Kathgodam', 'wedding venues Nainital'],
      ogTitle: 'Best Wedding Planner in Haldwani: Complete Guide',
      ogDescription: 'Your complete guide to finding the best wedding planner in Haldwani, Kathgodam and Nainital.',
      ogImage: IMAGES.wedding.couple,
    },
    relatedPosts: [],
  },
  {
    title: 'Best Event Management Company in Kathgodam for Unforgettable Celebrations',
    slug: 'best-event-management-company-kathgodam',
    excerpt:
      'Discover what makes an event management company in Kathgodam truly stand out, from vendor networks to local expertise and transparent budgeting.',
    content: corporateBlogContent,
    featuredImage: {
      url: IMAGES.corporate.hero,
      alt: 'Best event management company in Kathgodam organizing a corporate event',
    },
    category: 'Events',
    tags: ['Event Management Company Kathgodam', 'Event Planner Uttarakhand', 'Haldwani Events', 'Corporate Events Kumaon'],
    author,
    readingTime: 9,
    isFeatured: true,
    isPublished: true,
    publishedAt: '2026-01-18T00:00:00.000Z',
    faqs: [
      {
        question: 'What types of events does an event management company in Kathgodam handle?',
        answer:
          'A full-service company handles weddings, corporate events, birthday celebrations, kitty parties and religious functions such as Mata Ka Jagrata.',
      },
      {
        question: 'How early should I book an event management company for a corporate event?',
        answer:
          'We recommend booking at least 6-8 weeks in advance for corporate events to secure the best venues and allow sufficient planning time.',
      },
      {
        question: 'Can an event management company arrange accommodation for outstation guests?',
        answer:
          'Yes, most full-service companies coordinate accommodation, travel and hospitality for outstation guests attending events in Kathgodam.',
      },
      {
        question: 'What is the average cost of hiring an event management company in Kathgodam?',
        answer:
          'Costs vary widely based on event type and scale, typically starting from ₹75,000 for smaller gatherings and scaling up for larger celebrations.',
      },
      {
        question: 'Do event companies in Kathgodam handle both indoor and outdoor venues?',
        answer:
          'Yes, experienced local companies manage both indoor banquet venues and outdoor lawns or resort properties, adapting plans to seasonal weather conditions.',
      },
    ],
    seo: {
      metaTitle: 'Best Event Management Company in Kathgodam | 2026 Guide',
      metaDescription:
        'Find the best event management company in Kathgodam for weddings, corporate events and celebrations. Expert tips on choosing the right local event partner.',
      keywords: [
        'Event Management Company Kathgodam',
        'best event planner Kathgodam',
        'event management Haldwani',
        'corporate events Uttarakhand',
      ],
      ogTitle: 'Best Event Management Company in Kathgodam',
      ogDescription: 'How to choose the best event management company for unforgettable celebrations in Kathgodam.',
      ogImage: IMAGES.wedding.courtyard,
    },
    relatedPosts: [],
  },
  {
    title: 'Birthday Party Planner in Haldwani: Creating Magical Celebrations',
    slug: 'birthday-party-planner-haldwani',
    excerpt:
      'A complete guide to hiring a birthday party planner in Haldwani, covering themes, budgeting, venues and tips for a stress-free celebration.',
    content: birthdayBlogContent,
    featuredImage: {
      url: IMAGES.birthday.hero,
      alt: 'Birthday party planner in Haldwani setting up themed decor',
    },
    category: 'Birthday',
    tags: ['Birthday Planner Haldwani', 'Kids Birthday Party Uttarakhand', 'Party Planner Kathgodam'],
    author,
    readingTime: 9,
    isFeatured: false,
    isPublished: true,
    publishedAt: '2026-02-02T00:00:00.000Z',
    faqs: [
      {
        question: 'How much notice do I need to give a birthday party planner in Haldwani?',
        answer:
          'We recommend 3-4 weeks notice for mid-sized parties and 6-8 weeks for larger milestone celebrations, though shorter timelines can often be accommodated.',
      },
      {
        question: 'Can birthday planners customize themes for adult milestone birthdays?',
        answer:
          'Yes, professional planners design fully customized themes for milestone birthdays of every age, from sweet sixteens to golden anniversaries.',
      },
      {
        question: 'What is the average cost of a professional birthday party in Haldwani?',
        answer:
          'Costs typically start from ₹25,000 for smaller home-based celebrations and scale up based on guest count and theme complexity.',
      },
      {
        question: 'Do birthday planners provide entertainment like magicians or DJs?',
        answer:
          'Yes, most planners coordinate a range of entertainment options including magicians, DJs, puppet shows and photo booths depending on the age group.',
      },
      {
        question: 'Can outdoor birthday parties be planned during monsoon season in Haldwani?',
        answer:
          'Yes, though a backup indoor space or tent arrangement is always recommended during the monsoon months to guard against sudden weather changes.',
      },
    ],
    seo: {
      metaTitle: 'Birthday Party Planner in Haldwani | Themes, Tips & Pricing',
      metaDescription:
        'Hire the best birthday party planner in Haldwani for magical celebrations. Explore themes, budgeting tips and venue ideas for kids and milestone birthdays.',
      keywords: ['Birthday Planner Haldwani', 'birthday party organizer Haldwani', 'kids party planner Kathgodam'],
      ogTitle: 'Birthday Party Planner in Haldwani',
      ogDescription: 'Creating magical birthday celebrations across Haldwani, Kathgodam and Nainital.',
      ogImage: IMAGES.birthday.hero,
    },
    relatedPosts: [],
  },
  {
    title: 'Corporate Event Organizer in Haldwani: Professional Events That Impress',
    slug: 'corporate-event-organizer-haldwani',
    excerpt:
      'Learn how a professional corporate event organizer in Haldwani can help you host conferences, product launches and dealer meets that impress every guest.',
    content: corporateOrganizerBlogContent,
    featuredImage: {
      url: IMAGES.corporate.hero,
      alt: 'Corporate event organizer in Haldwani managing a business conference',
    },
    category: 'Corporate',
    tags: ['Corporate Event Organizer Haldwani', 'Business Events Uttarakhand', 'Conference Planner Kathgodam'],
    author,
    readingTime: 9,
    isFeatured: false,
    isPublished: true,
    publishedAt: '2026-02-15T00:00:00.000Z',
    faqs: [
      {
        question: 'What is the typical cost of organizing a corporate event in Haldwani?',
        answer:
          'Costs depend on attendee count and technical requirements, typically starting from ₹75,000 for smaller seminars and scaling up for larger conferences.',
      },
      {
        question: 'Can a corporate event organizer manage hybrid events with virtual attendees?',
        answer:
          'Yes, experienced organizers provide live streaming and hybrid event support to include remote attendees alongside in-person guests.',
      },
      {
        question: 'How far in advance should companies book venues for annual conferences?',
        answer:
          'We recommend booking at least 6-8 weeks in advance to secure preferred venues and allow sufficient time for branding and technical setup.',
      },
      {
        question: 'Do corporate event organizers in Haldwani handle offsite retreats near Nainital?',
        answer:
          'Yes, many organizers regularly plan offsite retreats at resorts around Nainital and Bhimtal, combining business sessions with team-building activities.',
      },
      {
        question: 'What technical equipment is typically included in corporate event packages?',
        answer:
          'Packages typically include audio-visual equipment, staging, lighting and backup power, with additional technical production available for larger events.',
      },
    ],
    seo: {
      metaTitle: 'Corporate Event Organizer in Haldwani | Professional Business Events',
      metaDescription:
        'Hire a professional corporate event organizer in Haldwani for conferences, product launches, dealer meets and offsite retreats across Kumaon.',
      keywords: ['Corporate Event Organizer Haldwani', 'corporate events Kathgodam', 'business event planner Uttarakhand'],
      ogTitle: 'Corporate Event Organizer in Haldwani',
      ogDescription: 'Professional corporate events that impress, planned across Haldwani, Kathgodam and Nainital.',
      ogImage: IMAGES.corporate.hero,
    },
    relatedPosts: [],
  },
  {
    title: 'Complete Guide to Mata Ka Jagrata Event Planning in Haldwani',
    slug: 'mata-ka-jagrata-event-planning-haldwani',
    excerpt:
      'A complete guide to organizing a Mata Ka Jagrata in Haldwani, covering bhajan mandali selection, decor, catering, budgeting and planning timelines.',
    content: jagrataBlogContent,
    featuredImage: {
      url: IMAGES.jagrata.hero,
      alt: 'Mata Ka Jagrata event planning with traditional deity decoration in Haldwani',
    },
    category: 'Religious',
    tags: ['Mata Ka Jagrata Organizer Haldwani', 'Jagrata Planning Uttarakhand', 'Bhajan Mandali Kathgodam'],
    author,
    readingTime: 9,
    isFeatured: false,
    isPublished: true,
    publishedAt: '2026-03-01T00:00:00.000Z',
    faqs: [
      {
        question: 'How far in advance should I book a bhajan mandali for a Jagrata?',
        answer:
          'We recommend booking at least 3-4 weeks in advance, and earlier still during the Navratri season when demand for popular mandalis is especially high.',
      },
      {
        question: 'What is the typical duration of a Mata Ka Jagrata event?',
        answer:
          'A Jagrata typically runs through the night, beginning in the evening and concluding with the aarti at dawn.',
      },
      {
        question: 'Can Jagrata events be organized at home as well as in banquet halls?',
        answer:
          'Yes, Jagratas can be organized at home, in community halls, temple courtyards, or banquet venues depending on guest count and preference.',
      },
      {
        question: 'What is included in prasad and catering arrangements for a Jagrata?',
        answer:
          'Arrangements typically include prasad distribution as well as full meal or refreshment service for guests, phased throughout the night.',
      },
      {
        question: 'How much does it cost to organize a Mata Ka Jagrata in Haldwani?',
        answer:
          'Costs typically start from ₹35,000 for home-based gatherings and scale up based on guest count, mandali selection and decor requirements.',
      },
    ],
    seo: {
      metaTitle: 'Mata Ka Jagrata Event Planning in Haldwani | Complete Guide',
      metaDescription:
        'Planning a Mata Ka Jagrata in Haldwani? Explore our complete guide covering bhajan mandali booking, decor, catering, budgeting and timelines.',
      keywords: ['Mata Ka Jagrata Organizer Haldwani', 'Jagrata planner Kathgodam', 'bhajan mandali booking Uttarakhand'],
      ogTitle: 'Mata Ka Jagrata Event Planning Guide',
      ogDescription: 'A complete guide to organizing a beautiful and respectful Mata Ka Jagrata in Haldwani.',
      ogImage: IMAGES.jagrata.hero,
    },
    relatedPosts: [],
  },
];

export const staticBlogs: Blog[] = baseBlogs.map((b, i) => ({
  ...b,
  _id: `blog-${i + 1}`,
  views: 100 + i * 37,
  createdAt: now,
  updatedAt: now,
  relatedPosts: [],
}));

for (const blog of staticBlogs) {
  blog.relatedPosts = staticBlogs.filter((b) => b._id !== blog._id).slice(0, 2);
}
