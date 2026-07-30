// ---------- Shared ----------

export interface SEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Media {
  url: string;
  publicId?: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

// ---------- Service ----------

export interface ServicePackage {
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export interface Service {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  overview: string;
  banner: Media;
  includedServices: string[];
  gallery: Media[];
  faqs: FAQ[];
  packages: ServicePackage[];
  icon: string;
  order: number;
  isPublished: boolean;
  seo: SEO;
  relatedServices: Service[] | string[];
  createdAt: string;
  updatedAt: string;
}

// ---------- Blog ----------

export interface BlogAuthor {
  name: string;
  avatar?: string;
  bio?: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: Media;
  category: string;
  tags: string[];
  author: BlogAuthor;
  readingTime: number;
  views: number;
  isFeatured: boolean;
  isPublished: boolean;
  publishedAt?: string;
  faqs: FAQ[];
  seo: SEO;
  relatedPosts: Blog[] | string[];
  createdAt: string;
  updatedAt: string;
}

export interface BlogSidebarData {
  latest: Pick<Blog, '_id' | 'title' | 'slug' | 'featuredImage' | 'publishedAt' | 'readingTime'>[];
  popular: Pick<Blog, '_id' | 'title' | 'slug' | 'featuredImage' | 'views' | 'readingTime'>[];
  categories: { name: string; count: number }[];
  tags: { name: string; count: number }[];
}

// ---------- Gallery ----------

export type GalleryCategory = 'Wedding' | 'Corporate' | 'Birthday' | 'Kitty Party' | 'Mata Ka Jagrata';

export interface GalleryItem {
  _id: string;
  image: Media;
  category: GalleryCategory;
  title: string;
  isFeatured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// ---------- Contact ----------

export type ContactStatus = 'new' | 'read' | 'replied' | 'archived';

export interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  service?: string;
  eventDate?: string;
  status: ContactStatus;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  service?: string;
  eventDate?: string;
}

// ---------- Testimonial ----------

export interface Testimonial {
  _id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar?: Media;
  eventType: string;
  isPublished: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// ---------- Settings ----------

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  social?: {
    linkedin?: string;
    instagram?: string;
  };
}

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

export interface ValueItem {
  title: string;
  description: string;
  icon: string;
}

export interface StatItem {
  label: string;
  value: number;
  suffix: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

export interface SmtpSettings {
  host: string;
  port: number;
  user: string;
  pass?: string;
  from: string;
}

export interface Settings {
  _id: string;
  companyName: string;
  tagline: string;
  logo: string;
  logoDark: string;
  favicon: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  businessHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  socialLinks: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
    linkedin?: string;
  };
  mapEmbedUrl: string;
  googleAnalyticsId?: string;
  googleSearchConsoleId?: string;
  smtp?: SmtpSettings;
  seoDefaults: SEO;
  about: {
    story: string;
    mission: string;
    vision: string;
    timeline: TimelineItem[];
    values: ValueItem[];
    team: TeamMember[];
    whyChooseUs: string[];
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    heroImage: string;
    heroCta: string;
    stats: StatItem[];
    process: ProcessStep[];
    faqs: FAQ[];
  };
  privacyPolicy: string;
  termsConditions: string;
  newsletterEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

// ---------- User / Auth ----------

export type UserRole = 'admin' | 'editor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

// ---------- Dashboard ----------

export interface DashboardStats {
  cards: {
    blogs: number;
    publishedBlogs: number;
    services: number;
    gallery: number;
    contacts: number;
    newContacts: number;
    testimonials: number;
    subscribers: number;
  };
  recentContacts: Contact[];
  recentBlogs: Pick<Blog, '_id' | 'title' | 'slug' | 'isPublished' | 'updatedAt' | 'views'>[];
}

// ---------- API envelopes ----------

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  count?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  hasMore?: boolean;
  data: T[];
}

export interface UploadResult {
  url: string;
  publicId: string;
  alt: string;
  width?: number;
  height?: number;
}
