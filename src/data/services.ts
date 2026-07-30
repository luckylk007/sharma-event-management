import { IMAGES } from '@/constants/images';
import type { Service } from '@/types';

const now = '2026-01-01T00:00:00.000Z';

const baseServices = [
  {
    title: 'Wedding Planning',
    slug: 'wedding-planning',
    shortDescription:
      'Full-service wedding planning across Haldwani, Kathgodam and Nainital, from venue selection to flawless on-day execution.',
    overview:
      '<p>Your wedding is one of the most significant days of your life, and at Sharma Event Management, we treat it with the care, precision and creativity it deserves. Our wedding planning services cover every stage of the journey, from the very first consultation where we get to know your vision, traditions and budget, to the final farewell as your celebration comes to a close. We specialise in planning weddings across Haldwani, Kathgodam, Nainital and Rudrapur, giving us deep knowledge of the best local venues, the most reliable vendors, and the seasonal considerations that can make or break an outdoor celebration in this beautiful but weather-variable region.</p><p>Our team manages venue selection and booking, complete decor and theme design for every function including haldi, mehendi, sangeet and the main ceremony, vendor coordination across catering, photography, music and transport, and full guest logistics including accommodation and travel arrangements for outstation guests. We understand that every family has its own unique traditions and expectations, whether it is a traditional Kumaoni ceremony, a grand multi-day celebration, or an intimate destination-style wedding at a resort near Nainital, and we tailor our approach accordingly.</p><p>What truly sets our wedding planning apart is the on-ground execution. On your wedding day, our dedicated team is present from early morning setup through to the final send-off, managing every vendor, troubleshooting issues quietly, and keeping the schedule running smoothly so that you and your family can be fully present in every moment rather than managing logistics. We have successfully planned and executed weddings ranging from intimate 100-guest ceremonies to grand 500-guest, multi-day celebrations, and we bring the same level of dedication and attention to detail to every event, regardless of scale or budget.</p>',
    banner: {
      url: IMAGES.wedding.hero,
      alt: 'Elegant wedding mandap decor in Haldwani',
    },
    includedServices: [
      'Venue Selection & Booking',
      'Complete Decor & Theme Design',
      'Vendor Coordination (Catering, Photography, Music)',
      'Mehendi, Haldi & Sangeet Styling',
      'Bridal & Groom Styling Coordination',
      'Guest Accommodation & Travel Management',
      'Invitation & Stationery Design',
      'On-Day Event Execution & Coordination',
    ],
    gallery: [
      { url: IMAGES.wedding.mandap, alt: 'Wedding mandap floral decoration' },
      { url: IMAGES.wedding.couple, alt: 'Bride and groom wedding ceremony' },
      { url: IMAGES.wedding.rituals, alt: 'Wedding reception decor setup' },
      { url: IMAGES.wedding.courtyard, alt: 'Indian wedding courtyard with marigold pathway' },
      { url: IMAGES.wedding.bride, alt: 'Indian bride in traditional lehenga' },
    ],
    faqs: [
      {
        question: 'How much does a wedding planner in Haldwani typically cost?',
        answer:
          'Costs vary based on guest count, venue and decor complexity. Our packages start from ₹2,50,000 for intimate weddings and scale up for larger, more elaborate celebrations. We provide a detailed, itemised quote after understanding your requirements.',
      },
      {
        question: 'How far in advance should I book your wedding planning services?',
        answer:
          'We recommend booking at least 3-6 months in advance, especially during the peak wedding season between October and February, to secure your preferred venue and vendors.',
      },
      {
        question: 'Can you plan destination-style weddings near Nainital?',
        answer:
          'Yes, we regularly plan resort and lakeside weddings near Nainital and Bhimtal, handling guest accommodation, transport and full on-ground coordination.',
      },
      {
        question: 'Do you handle small, intimate weddings as well as large ones?',
        answer:
          'Absolutely. We plan everything from intimate 100-guest ceremonies to grand multi-day celebrations for 500 or more guests, with the same level of attention to detail.',
      },
      {
        question: 'What is included in your full wedding planning package?',
        answer:
          'Our full-service package includes venue selection, decor and theme design, vendor coordination, guest logistics, and complete on-day execution from setup to send-off.',
      },
    ],
    packages: [
      {
        name: 'Silver',
        price: '₹2,50,000 onwards',
        description: 'Ideal for intimate weddings up to 150 guests with essential decor and vendor coordination.',
        features: [
          'Venue shortlisting & booking assistance',
          'Standard decor for one function',
          'Catering & photography coordination',
          'On-day coordination team (2 members)',
        ],
        isPopular: false,
      },
      {
        name: 'Gold',
        price: '₹5,00,000 onwards',
        description: 'Our most popular package for weddings up to 300 guests with multi-function decor and full coordination.',
        features: [
          'Complete decor for 3 functions (Haldi, Sangeet, Wedding)',
          'Dedicated vendor management team',
          'Guest accommodation coordination',
          'On-day coordination team (4-5 members)',
          'Custom invitation design',
        ],
        isPopular: true,
      },
      {
        name: 'Platinum',
        price: '₹10,00,000 onwards',
        description: 'A fully bespoke, luxury wedding experience for 300+ guests across multiple days.',
        features: [
          'Premium decor across all functions',
          'Celebrity-style stage & lighting design',
          'Complete guest travel & accommodation management',
          'Dedicated on-ground execution team',
          'Personal wedding concierge',
        ],
        isPopular: false,
      },
    ],
    icon: 'FaRing',
    order: 1,
    isPublished: true,
    seo: {
      metaTitle: 'Wedding Planning Services in Haldwani, Kathgodam & Nainital | Sharma Event Management',
      metaDescription:
        'Full-service wedding planning in Haldwani, Kathgodam and Nainital. Venue selection, decor, vendor coordination and flawless on-day execution by Sharma Event Management.',
      keywords: ['wedding planner Haldwani', 'wedding planning Kathgodam', 'wedding decor Nainital', 'best wedding planner Uttarakhand'],
      ogTitle: 'Wedding Planning in Haldwani | Sharma Event Management',
      ogDescription: 'Dream weddings, planned and executed flawlessly across Haldwani, Kathgodam and Nainital.',
      ogImage: IMAGES.wedding.hero,
    },
    relatedServices: [],
  },
  {
    title: 'Corporate Events',
    slug: 'corporate-events',
    shortDescription:
      'Professional corporate event management for conferences, product launches, dealer meets and team retreats across Uttarakhand.',
    overview:
      '<p>In today\'s competitive business environment, the way a company presents itself at conferences, product launches and dealer meets speaks volumes about its professionalism. Sharma Event Management offers comprehensive corporate event management services designed to help businesses across Haldwani, Kathgodam, Nainital and Rudrapur host events that leave a lasting impression on employees, clients and partners alike. From concept development to on-ground execution, our team manages every technical and logistical detail so your organisation can focus entirely on the content and objectives of the event.</p><p>Our corporate services span a wide range of formats, including large-scale conferences and seminars, product launch events, dealer and channel partner meets, employee recognition ceremonies, and offsite team-building retreats at scenic resorts near Nainital and Bhimtal. We handle venue sourcing and booking, stage and audio-visual setup, branding and signage design, catering and hospitality management, registration and guest coordination, and entertainment or speaker logistics, ensuring every element of your event runs precisely on schedule.</p><p>We understand that corporate clients operate on structured approval processes and tight timelines, and our team is experienced in navigating multiple rounds of internal sign-off while still delivering polished, professional results. Whether you are planning a half-day seminar for fifty attendees or a multi-day dealer conference for several hundred guests featuring elaborate stage production and gala dinners, our experienced team brings the technical capability, vendor relationships and local expertise needed to execute your vision seamlessly, on time and within budget.</p>',
    banner: {
      url: IMAGES.corporate.hero,
      alt: 'Corporate conference event setup',
    },
    includedServices: [
      'Venue Sourcing & Booking',
      'Stage & Audio-Visual Setup',
      'Event Branding & Signage',
      'Catering & Hospitality Management',
      'Registration & Guest Management',
      'Entertainment & Speaker Coordination',
      'Live Streaming & Hybrid Event Support',
      'Post-Event Reporting & Feedback',
    ],
    gallery: [
      { url: IMAGES.corporate.conference, alt: 'Corporate meeting event' },
      { url: IMAGES.corporate.meeting, alt: 'Business conference stage' },
      { url: IMAGES.corporate.stage, alt: 'Corporate networking event' },
      { url: IMAGES.corporate.networking, alt: 'Business seminar audience' },
      { url: IMAGES.corporate.seminar, alt: 'Corporate conference room setup' },
    ],
    faqs: [
      {
        question: 'What is the typical cost of organizing a corporate event in Haldwani?',
        answer:
          'Costs depend on attendee count, venue and technical production requirements. Our packages start from ₹75,000 for smaller seminars and scale up for larger, multi-day conferences.',
      },
      {
        question: 'Can you manage hybrid events with virtual attendees?',
        answer:
          'Yes, we provide live streaming and hybrid event support, allowing remote attendees to participate alongside your in-person guests.',
      },
      {
        question: 'How far in advance should we book for an annual conference?',
        answer:
          'We recommend booking at least 6-8 weeks in advance for large conferences to secure the best venues and ensure adequate time for branding and logistics planning.',
      },
      {
        question: 'Do you organize offsite retreats near Nainital?',
        answer:
          'Yes, we regularly organize corporate offsite retreats at resorts around Nainital and Bhimtal, combining strategic sessions with team-building activities.',
      },
      {
        question: 'What technical equipment is included in your packages?',
        answer:
          'Our packages include audio-visual equipment, staging, lighting, and backup power arrangements, with additional technical production available for larger events.',
      },
    ],
    packages: [
      {
        name: 'Essential',
        price: '₹75,000 onwards',
        description: 'Ideal for half-day seminars and small meetings up to 80 attendees.',
        features: ['Venue booking assistance', 'Basic AV setup', 'Registration desk management', 'Working lunch coordination'],
        isPopular: false,
      },
      {
        name: 'Professional',
        price: '₹1,50,000 onwards',
        description: 'Our most popular package for full-day conferences and product launches up to 200 attendees.',
        features: [
          'Complete stage & AV production',
          'Event branding & signage',
          'Catering & hospitality management',
          'On-ground coordination team',
        ],
        isPopular: true,
      },
      {
        name: 'Premium',
        price: '₹3,00,000 onwards',
        description: 'A comprehensive package for multi-day conferences, dealer meets and corporate retreats.',
        features: [
          'Multi-day event coordination',
          'Elaborate stage production & entertainment',
          'Guest accommodation management',
          'Live streaming & hybrid support',
          'Dedicated project manager',
        ],
        isPopular: false,
      },
    ],
    icon: 'FaBriefcase',
    order: 2,
    isPublished: true,
    seo: {
      metaTitle: 'Corporate Event Management in Haldwani & Kathgodam | Sharma Event Management',
      metaDescription:
        'Professional corporate event organizer in Haldwani for conferences, product launches, dealer meets and team retreats across Kathgodam, Nainital and Rudrapur.',
      keywords: ['corporate event organizer Haldwani', 'event management company Kathgodam', 'corporate events Uttarakhand'],
      ogTitle: 'Corporate Event Management | Sharma Event Management',
      ogDescription: 'Professional, polished corporate events across Haldwani, Kathgodam, Nainital and Rudrapur.',
      ogImage: IMAGES.corporate.hero,
    },
    relatedServices: [],
  },
  {
    title: 'Birthday & Private Parties',
    slug: 'birthday-private-parties',
    shortDescription:
      'Creative, fully-managed birthday and private party planning for every age and milestone across Haldwani and Kathgodam.',
    overview:
      '<p>Birthdays and private celebrations mark some of life\'s most personal milestones, and at Sharma Event Management, we believe every one of them deserves a thoughtfully designed celebration. From whimsical first birthdays and superhero-themed parties for young children, to elegant milestone celebrations for 50th and 60th birthdays, our team handles every detail so that hosts can be fully present in the moment rather than managing logistics behind the scenes.</p><p>Our birthday and private party planning services cover theme design and decor, custom cake and catering coordination, entertainment booking including magicians, DJs and games, photo booth and photography arrangements, venue selection whether at home, in a garden or at a banquet hall, and full invitation and return gift curation. We work closely with trusted local bakers, entertainers and decorators across Haldwani, Kathgodam and Nainital to bring your chosen theme to life, whether that is a jungle safari adventure, a princess fairy tale, or a sophisticated milestone dinner for close family and friends.</p><p>We understand that no two celebrations are alike, and our team takes the time to understand the personality and preferences of the birthday person before designing a celebration that feels genuinely personal. Whether you are planning an intimate home gathering for twenty guests or a grand milestone party for over a hundred, we bring the same creativity, attention to detail and seamless on-day coordination to every event we plan.</p>',
    banner: {
      url: IMAGES.birthday.hero,
      alt: 'Colorful birthday party decoration setup',
    },
    includedServices: [
      'Theme Design & Decor',
      'Custom Cake & Catering Coordination',
      'Entertainment (DJ, Magician, Games)',
      'Photo Booth & Photography',
      'Venue Selection & Setup',
      'Invitation & Return Gift Curation',
      'Balloon Decor & Backdrop Styling',
      'Full Event Coordination',
    ],
    gallery: [
      { url: IMAGES.birthday.balloons, alt: 'Birthday party balloon decoration' },
      { url: IMAGES.birthday.cake, alt: 'Birthday cake celebration' },
      { url: IMAGES.birthday.kids, alt: 'Kids birthday party setup' },
      { url: IMAGES.birthday.celebration, alt: 'Birthday celebration with candles' },
      { url: IMAGES.birthday.party, alt: 'Party celebration decor' },
    ],
    faqs: [
      {
        question: 'How much notice do I need to give for a birthday party?',
        answer:
          'We recommend 3-4 weeks notice for mid-sized parties and 6-8 weeks for larger milestone celebrations, though we can accommodate shorter timelines when possible.',
      },
      {
        question: 'Can you customize themes for adult milestone birthdays?',
        answer:
          'Yes, we design fully customized themes and decor for milestone birthdays of every age, from sweet sixteens to golden 50th celebrations.',
      },
      {
        question: 'What is the average cost of a professional birthday party?',
        answer:
          'Our packages start from ₹25,000 for smaller home-based celebrations and scale up based on guest count, theme complexity and venue.',
      },
      {
        question: 'Do you provide entertainment like magicians or DJs?',
        answer:
          'Yes, we coordinate a wide range of entertainment options including magicians, DJs, puppet shows, games and photo booths depending on the age group.',
      },
      {
        question: 'Can outdoor birthday parties be planned during monsoon season?',
        answer:
          'We always recommend a backup indoor space or tent arrangement for outdoor parties during the monsoon months to ensure the celebration proceeds smoothly regardless of weather.',
      },
    ],
    packages: [
      {
        name: 'Basic',
        price: '₹25,000 onwards',
        description: 'Perfect for intimate home-based celebrations up to 30 guests.',
        features: ['Balloon & backdrop decor', 'Basic cake coordination', 'Standard catering coordination'],
        isPopular: false,
      },
      {
        name: 'Deluxe',
        price: '₹50,000 onwards',
        description: 'Our most popular package for themed parties up to 80 guests.',
        features: ['Full theme design & decor', 'Custom cake & catering', 'Entertainment booking', 'Photo booth setup'],
        isPopular: true,
      },
      {
        name: 'Luxury',
        price: '₹1,00,000 onwards',
        description: 'A grand celebration package for milestone birthdays with 100+ guests.',
        features: [
          'Premium theme & decor installations',
          'Multi-course catering',
          'Live entertainment & DJ',
          'Professional photography & videography',
        ],
        isPopular: false,
      },
    ],
    icon: 'FaBirthdayCake',
    order: 3,
    isPublished: true,
    seo: {
      metaTitle: 'Birthday & Private Party Planner in Haldwani | Sharma Event Management',
      metaDescription:
        'Creative birthday and private party planning in Haldwani, Kathgodam and Nainital. Theme design, decor, catering and entertainment by Sharma Event Management.',
      keywords: ['birthday party planner Haldwani', 'private party planner Kathgodam', 'kids birthday party Haldwani'],
      ogTitle: 'Birthday & Private Parties | Sharma Event Management',
      ogDescription: 'Magical, fully-managed birthday celebrations across Haldwani, Kathgodam and Nainital.',
      ogImage: IMAGES.birthday.hero,
    },
    relatedServices: [],
  },
  {
    title: 'Kitty Party',
    slug: 'kitty-party',
    shortDescription:
      'Fun, themed kitty party planning with games, decor and catering for ladies\' groups across Haldwani and Kathgodam.',
    overview:
      '<p>Kitty parties have become a beloved social tradition among ladies\' groups across Haldwani, Kathgodam and Nainital, offering a wonderful opportunity for friends to unwind, connect and celebrate together. Sharma Event Management specialises in planning themed kitty parties that go far beyond a simple get-together, transforming an ordinary afternoon into a memorable, beautifully styled event complete with curated games, delicious catering and stunning decor.</p><p>Our kitty party planning services include theme-based decor and styling tailored to seasonal trends or member preferences, curated games and activities designed to keep every guest engaged and entertained, thoughtful menu planning ranging from high tea spreads to full multi-course lunches, professional photography to capture every fun moment, and complete return gift and prize sourcing. Whether hosted at home or at a banquet venue, our team manages every detail so the host can relax and enjoy the party alongside her guests rather than spending the day managing logistics.</p><p>We work with groups of every size, from intimate gatherings of ten close friends to larger community kitty groups of fifty or more members, and we tailor our themes to match the occasion, whether it is a festive Diwali or Holi kitty, a Bollywood retro theme, or an elegant pastel garden party. Our goal is always the same: to help you host a kitty party that your group will be talking about until the next one.</p>',
    banner: {
      url: IMAGES.kitty.hero,
      alt: 'Kitty party themed decoration and table setting',
    },
    includedServices: [
      'Theme-Based Decor & Styling',
      'Games & Activity Curation',
      'Catering & Menu Planning',
      'Photography & Memory Capture',
      'Venue Selection (Home or Banquet)',
      'Prize & Return Gift Sourcing',
      'Music & Entertainment Setup',
      'Full On-Day Hosting Support',
    ],
    gallery: [
      { url: IMAGES.kitty.table, alt: 'Themed party table decoration' },
      { url: IMAGES.kitty.gathering, alt: 'Ladies party lunch gathering' },
      { url: IMAGES.kitty.lunch, alt: 'Party lights and decor' },
      { url: IMAGES.kitty.decor, alt: 'Festive party gathering' },
      { url: IMAGES.kitty.festive, alt: 'Colorful party decor balloons' },
    ],
    faqs: [
      {
        question: 'What is the average cost of a kitty party?',
        answer:
          'Our kitty party packages start from ₹15,000 for smaller gatherings and scale up based on guest count, theme complexity and venue.',
      },
      {
        question: 'Can you design a kitty party around a specific theme?',
        answer:
          'Yes, we specialise in fully themed kitty parties, from festive celebrations to Bollywood retro and elegant pastel garden themes.',
      },
      {
        question: 'Do you organize games and activities for kitty parties?',
        answer:
          'Absolutely, our team curates engaging games and activities suited to your group\'s preferences and age range, along with prizes and return gifts.',
      },
      {
        question: 'Can a kitty party be hosted at home?',
        answer:
          'Yes, we plan kitty parties both at home and at banquet or resort venues, adapting decor and catering to suit the chosen location.',
      },
      {
        question: 'How many guests can you accommodate for a kitty party?',
        answer:
          'We plan kitty parties for groups of all sizes, from intimate gatherings of ten friends to larger community groups of fifty or more members.',
      },
    ],
    packages: [
      {
        name: 'Simple',
        price: '₹15,000 onwards',
        description: 'Ideal for intimate kitty gatherings up to 15 guests.',
        features: ['Basic themed decor', 'High tea catering', 'One curated game activity'],
        isPopular: false,
      },
      {
        name: 'Themed',
        price: '₹30,000 onwards',
        description: 'Our most popular package for fully themed kitty parties up to 30 guests.',
        features: ['Complete themed decor & styling', 'Multi-course catering', 'Multiple games & activities', 'Photography coverage'],
        isPopular: true,
      },
      {
        name: 'Grand',
        price: '₹50,000 onwards',
        description: 'A premium package for larger kitty groups of 50+ guests at a banquet or resort venue.',
        features: [
          'Premium decor installations',
          'Elaborate multi-cuisine catering',
          'Live entertainment or music',
          'Professional photography & prize curation',
        ],
        isPopular: false,
      },
    ],
    icon: 'FaUsers',
    order: 4,
    isPublished: true,
    seo: {
      metaTitle: 'Kitty Party Planner in Haldwani & Kathgodam | Sharma Event Management',
      metaDescription:
        'Themed kitty party planning in Haldwani, Kathgodam and Nainital with decor, games, catering and photography by Sharma Event Management.',
      keywords: ['kitty party planner Haldwani', 'kitty party organizer Kathgodam', 'themed kitty party Uttarakhand'],
      ogTitle: 'Kitty Party Planning | Sharma Event Management',
      ogDescription: 'Fun, beautifully styled kitty parties across Haldwani, Kathgodam and Nainital.',
      ogImage: IMAGES.kitty.hero,
    },
    relatedServices: [],
  },
  {
    title: 'Mata Ka Jagrata',
    slug: 'mata-ka-jagrata',
    shortDescription:
      'Respectful, beautifully organized Mata Ka Jagrata planning with bhajan mandali coordination across Haldwani and Kumaon.',
    overview:
      '<p>Mata Ka Jagrata is a deeply meaningful spiritual tradition, and Sharma Event Management approaches every such celebration with the reverence and attention to detail it deserves. Our Jagrata planning services are designed to handle every logistical aspect of the night-long event, allowing host families across Haldwani, Kathgodam, Nainital and Rudrapur to focus fully on devotion and hospitality rather than coordination.</p><p>Our services include booking and coordinating experienced local bhajan mandalis suited to your family\'s musical and devotional preferences, elegant deity decor and stage setup featuring floral and fabric installations, reliable sound and lighting arrangements for a night-long programme, seating and tent management for guests of all ages, and full prasad and catering coordination timed appropriately throughout the evening. We also arrange power backup solutions to ensure an uninterrupted sound and lighting experience regardless of weather conditions.</p><p>We understand the cultural and emotional significance a Jagrata holds for the families who organise them, whether to mark Navratri, fulfil a manat, bless a new home, or continue a cherished family tradition. Our on-ground coordinators manage every transition throughout the night, from the arrival of the bhajan mandali to the final aarti at dawn, ensuring the sacred atmosphere is preserved while every guest is comfortably cared for. From intimate home gatherings to large community celebrations with hundreds of attendees, we bring the same dedication and respect to every Jagrata we help organise.</p>',
    banner: {
      url: IMAGES.jagrata.hero,
      alt: 'Traditional deity decoration with flowers and diyas',
    },
    includedServices: [
      'Bhajan Mandali Booking & Coordination',
      'Deity Decor & Stage Setup',
      'Sound & Lighting Arrangement',
      'Seating & Tent Management',
      'Prasad & Catering Coordination',
      'Guest Hospitality Management',
      'Power Backup Arrangement',
      'Complete Night-Long Event Coordination',
    ],
    gallery: IMAGES.posters.map((url, i) => ({
      url,
      alt: `Mata Ka Jagrata poster ${i + 1}`,
    })),
    faqs: [
      {
        question: 'How far in advance should I book a bhajan mandali?',
        answer:
          'We recommend booking at least 3-4 weeks in advance, and even earlier during the Navratri season when popular mandalis are in high demand.',
      },
      {
        question: 'What is the typical duration of a Mata Ka Jagrata event?',
        answer:
          'A Jagrata typically runs through the night, beginning in the evening and concluding with the aarti at dawn, though duration can be adjusted based on your preference.',
      },
      {
        question: 'Can a Jagrata be organized at home as well as in a banquet hall?',
        answer:
          'Yes, we organize Jagratas at home, in community halls, temple courtyards, or banquet venues, adapting decor, seating and sound arrangements accordingly.',
      },
      {
        question: 'What is included in prasad and catering arrangements?',
        answer:
          'We coordinate prasad distribution as well as full meal or refreshment service for guests, phased appropriately throughout the night to ensure freshness and smooth service.',
      },
      {
        question: 'How much does it cost to organize a Mata Ka Jagrata?',
        answer:
          'Our packages start from ₹35,000 for home-based gatherings and scale up based on guest count, mandali selection and decor requirements.',
      },
    ],
    packages: [
      {
        name: 'Traditional',
        price: '₹35,000 onwards',
        description: 'Ideal for intimate home-based Jagratas up to 50 guests.',
        features: ['Local bhajan mandali booking', 'Basic deity decor', 'Standard sound system', 'Prasad coordination'],
        isPopular: false,
      },
      {
        name: 'Premium',
        price: '₹65,000 onwards',
        description: 'Our most popular package for community Jagratas up to 150 guests.',
        features: [
          'Premium bhajan mandali of choice',
          'Elaborate deity decor & stage setup',
          'Professional sound & lighting',
          'Full catering & prasad service',
          'Tent & seating arrangement',
        ],
        isPopular: true,
      },
      {
        name: 'Grand',
        price: '₹1,00,000 onwards',
        description: 'A comprehensive package for large-scale community Jagratas with 200+ guests.',
        features: [
          'Renowned bhajan mandali booking',
          'Grand deity decor installation',
          'Premium sound, lighting & power backup',
          'Multi-course catering service',
          'Complete on-ground coordination team',
        ],
        isPopular: false,
      },
    ],
    icon: 'FaOm',
    order: 5,
    isPublished: true,
    seo: {
      metaTitle: 'Mata Ka Jagrata Organizer in Haldwani | Sharma Event Management',
      metaDescription:
        'Respectful Mata Ka Jagrata planning in Haldwani, Kathgodam and Nainital with bhajan mandali booking, decor and catering by Sharma Event Management.',
      keywords: ['Mata Ka Jagrata organizer Haldwani', 'Jagrata planner Kathgodam', 'bhajan mandali booking Uttarakhand'],
      ogTitle: 'Mata Ka Jagrata Planning | Sharma Event Management',
      ogDescription: 'Beautifully organized, spiritually respectful Jagrata celebrations across Haldwani and Kumaon.',
      ogImage: IMAGES.jagrata.hero,
    },
    relatedServices: [],
  },
];

export const staticServices: Service[] = baseServices.map((s, i) => ({
  ...s,
  _id: `svc-${i + 1}`,
  createdAt: now,
  updatedAt: now,
  relatedServices: [],
}));

// Hydrate related services (2 others each)
for (const service of staticServices) {
  service.relatedServices = staticServices.filter((s) => s._id !== service._id).slice(0, 2);
}
