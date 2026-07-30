import {
  staticBlogs,
  staticGallery,
  staticServices,
  staticSettings,
  staticTestimonials,
  whatsappNumber,
} from '@/data';
import type {
  ApiResponse,
  Blog,
  BlogSidebarData,
  ContactFormData,
  GalleryItem,
  PaginatedResponse,
  Service,
  Settings,
  Testimonial,
} from '@/types';

function ok<T>(data: T, message?: string): ApiResponse<T> {
  return { success: true, data, message };
}

function paginate<T>(items: T[], page = 1, limit = 12): PaginatedResponse<T> {
  const start = (page - 1) * limit;
  const slice = items.slice(start, start + limit);
  const total = items.length;
  return {
    success: true,
    data: slice,
    count: slice.length,
    total,
    page,
    pages: Math.max(1, Math.ceil(total / limit)),
    hasMore: start + slice.length < total,
  };
}

export interface ServiceQuery {
  published?: 'all';
}

export const servicesApi = {
  getAll: async (_params?: ServiceQuery): Promise<ApiResponse<Service[]>> =>
    ok(staticServices.filter((s) => s.isPublished).sort((a, b) => a.order - b.order)),

  getBySlug: async (slug: string): Promise<ApiResponse<Service>> => {
    const service = staticServices.find((s) => s.slug === slug || s._id === slug);
    if (!service) throw new Error('Service not found');
    return ok(service);
  },
};

export interface BlogQuery {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  featured?: boolean;
  search?: string;
  published?: 'all';
}

export const blogsApi = {
  getAll: async (params?: BlogQuery): Promise<PaginatedResponse<Blog>> => {
    let items = staticBlogs.filter((b) => b.isPublished);
    if (params?.category) items = items.filter((b) => b.category === params.category);
    if (params?.tag) items = items.filter((b) => b.tags.includes(String(params.tag)));
    if (params?.featured) items = items.filter((b) => b.isFeatured);
    if (params?.search) {
      const q = String(params.search).toLowerCase();
      items = items.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.excerpt.toLowerCase().includes(q) ||
          b.content.toLowerCase().includes(q)
      );
    }
    items = [...items].sort((a, b) => {
      const da = a.publishedAt || a.createdAt;
      const db = b.publishedAt || b.createdAt;
      return db.localeCompare(da);
    });
    const result = paginate(items, params?.page || 1, params?.limit || 9);
    result.data = result.data.map(({ content: _c, ...rest }) => ({ ...rest, content: '' }));
    return result;
  },

  getBySlug: async (slug: string): Promise<ApiResponse<Blog>> => {
    const blog = staticBlogs.find((b) => b.slug === slug || b._id === slug);
    if (!blog) throw new Error('Blog not found');
    return ok({ ...blog, views: blog.views + 1 });
  },

  getSidebar: async (): Promise<ApiResponse<BlogSidebarData>> => {
    const published = staticBlogs.filter((b) => b.isPublished);
    const latest = [...published]
      .sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)))
      .slice(0, 5)
      .map(({ _id, title, slug, featuredImage, publishedAt, readingTime }) => ({
        _id,
        title,
        slug,
        featuredImage,
        publishedAt,
        readingTime,
      }));
    const popular = [...published]
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
      .map(({ _id, title, slug, featuredImage, views, readingTime }) => ({
        _id,
        title,
        slug,
        featuredImage,
        views,
        readingTime,
      }));

    const categoryMap = new Map<string, number>();
    const tagMap = new Map<string, number>();
    for (const post of published) {
      categoryMap.set(post.category, (categoryMap.get(post.category) || 0) + 1);
      for (const tag of post.tags) tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    }

    return ok({
      latest,
      popular,
      categories: [...categoryMap.entries()]
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      tags: [...tagMap.entries()]
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20),
    });
  },
};

export interface GalleryQuery {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
}

export const galleryApi = {
  getAll: async (params?: GalleryQuery): Promise<PaginatedResponse<GalleryItem>> => {
    let items = [...staticGallery];
    if (params?.category && params.category !== 'all' && params.category !== 'All') {
      items = items.filter((g) => g.category === params.category);
    }
    if (params?.featured) items = items.filter((g) => g.isFeatured);
    items.sort((a, b) => a.order - b.order || b.createdAt.localeCompare(a.createdAt));
    return paginate(items, params?.page || 1, params?.limit || 12);
  },
};

export const contactsApi = {
  submit: async (payload: ContactFormData): Promise<ApiResponse<{ id: string }>> => {
    const lines = [
      `Hello Sharma Event Management,`,
      ``,
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      `Phone: ${payload.phone}`,
      `Subject: ${payload.subject}`,
      payload.eventDate ? `Event date: ${payload.eventDate}` : null,
      ``,
      payload.message,
    ]
      .filter(Boolean)
      .join('\n');

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    return ok({ id: 'whatsapp' }, 'Opening WhatsApp…');
  },
};

export const settingsApi = {
  getPublic: async (): Promise<ApiResponse<Settings>> => ok(staticSettings),
  getPrivacy: async (): Promise<ApiResponse<{ content: string; companyName: string }>> =>
    ok({ content: staticSettings.privacyPolicy, companyName: staticSettings.companyName }),
  getTerms: async (): Promise<ApiResponse<{ content: string; companyName: string }>> =>
    ok({ content: staticSettings.termsConditions, companyName: staticSettings.companyName }),
};

export const testimonialsApi = {
  getAll: async (_params?: { published?: 'all' }): Promise<ApiResponse<Testimonial[]>> =>
    ok(staticTestimonials.filter((t) => t.isPublished).sort((a, b) => a.order - b.order)),
};

export const newsletterApi = {
  subscribe: async (_email: string): Promise<ApiResponse<null>> =>
    ok(null, 'Thanks! We will be in touch soon.'),
};
