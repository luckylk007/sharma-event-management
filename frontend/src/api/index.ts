import { apiClient } from './client';
import type {
  ApiResponse,
  AuthResponse,
  Blog,
  BlogSidebarData,
  Contact,
  ContactFormData,
  DashboardStats,
  GalleryItem,
  LoginCredentials,
  PaginatedResponse,
  Service,
  Settings,
  Testimonial,
  UploadResult,
  User,
} from '@/types';

// ---------- Auth ----------

export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiClient.post<AuthResponse>('/auth/login', credentials).then((r) => r.data),

  logout: () => apiClient.post<ApiResponse<null>>('/auth/logout').then((r) => r.data),

  getMe: () => apiClient.get<ApiResponse<User>>('/auth/me').then((r) => r.data),

  updatePassword: (currentPassword: string, newPassword: string) =>
    apiClient
      .put<AuthResponse>('/auth/password', { currentPassword, newPassword })
      .then((r) => r.data),
};

// ---------- Services ----------

export interface ServiceQuery {
  published?: 'all';
}

export const servicesApi = {
  getAll: (params?: ServiceQuery) =>
    apiClient.get<ApiResponse<Service[]>>('/services', { params }).then((r) => r.data),

  getBySlug: (slug: string) =>
    apiClient.get<ApiResponse<Service>>(`/services/${slug}`).then((r) => r.data),

  create: (payload: Partial<Service>) =>
    apiClient.post<ApiResponse<Service>>('/services', payload).then((r) => r.data),

  update: (id: string, payload: Partial<Service>) =>
    apiClient.put<ApiResponse<Service>>(`/services/${id}`, payload).then((r) => r.data),

  remove: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/services/${id}`).then((r) => r.data),
};

// ---------- Blogs ----------

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
  getAll: (params?: BlogQuery) =>
    apiClient.get<PaginatedResponse<Blog>>('/blogs', { params }).then((r) => r.data),

  getBySlug: (slug: string) =>
    apiClient.get<ApiResponse<Blog>>(`/blogs/${slug}`).then((r) => r.data),

  getSidebar: () =>
    apiClient.get<ApiResponse<BlogSidebarData>>('/blogs/sidebar/data').then((r) => r.data),

  create: (payload: Partial<Blog>) =>
    apiClient.post<ApiResponse<Blog>>('/blogs', payload).then((r) => r.data),

  update: (id: string, payload: Partial<Blog>) =>
    apiClient.put<ApiResponse<Blog>>(`/blogs/${id}`, payload).then((r) => r.data),

  remove: (id: string) => apiClient.delete<ApiResponse<null>>(`/blogs/${id}`).then((r) => r.data),
};

// ---------- Gallery ----------

export interface GalleryQuery {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
}

export const galleryApi = {
  getAll: (params?: GalleryQuery) =>
    apiClient.get<PaginatedResponse<GalleryItem>>('/gallery', { params }).then((r) => r.data),

  create: (payload: Partial<GalleryItem>) =>
    apiClient.post<ApiResponse<GalleryItem>>('/gallery', payload).then((r) => r.data),

  uploadImages: (formData: FormData) =>
    apiClient
      .post<ApiResponse<GalleryItem[]>>('/gallery/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),

  update: (id: string, payload: Partial<GalleryItem>) =>
    apiClient.put<ApiResponse<GalleryItem>>(`/gallery/${id}`, payload).then((r) => r.data),

  remove: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/gallery/${id}`).then((r) => r.data),
};

// ---------- Contacts ----------

export interface ContactQuery {
  page?: number;
  limit?: number;
  status?: string;
}

export const contactsApi = {
  submit: (payload: ContactFormData) =>
    apiClient.post<ApiResponse<{ id: string }>>('/contacts', payload).then((r) => r.data),

  getAll: (params?: ContactQuery) =>
    apiClient.get<PaginatedResponse<Contact>>('/contacts', { params }).then((r) => r.data),

  updateStatus: (id: string, status: Contact['status']) =>
    apiClient.put<ApiResponse<Contact>>(`/contacts/${id}`, { status }).then((r) => r.data),

  remove: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/contacts/${id}`).then((r) => r.data),

  exportCsv: () =>
    apiClient.get<string>('/contacts/export', { responseType: 'blob' as const }).then((r) => r.data),
};

// ---------- Settings ----------

export const settingsApi = {
  getPublic: () => apiClient.get<ApiResponse<Settings>>('/settings/public').then((r) => r.data),

  getAdmin: () => apiClient.get<ApiResponse<Settings>>('/settings').then((r) => r.data),

  update: (payload: Partial<Settings>) =>
    apiClient.put<ApiResponse<Settings>>('/settings', payload).then((r) => r.data),

  getPrivacy: () =>
    apiClient
      .get<ApiResponse<{ content: string; companyName: string }>>('/settings/privacy')
      .then((r) => r.data),

  getTerms: () =>
    apiClient
      .get<ApiResponse<{ content: string; companyName: string }>>('/settings/terms')
      .then((r) => r.data),
};

// ---------- Testimonials ----------

export const testimonialsApi = {
  getAll: (params?: { published?: 'all' }) =>
    apiClient.get<ApiResponse<Testimonial[]>>('/testimonials', { params }).then((r) => r.data),

  create: (payload: Partial<Testimonial>) =>
    apiClient.post<ApiResponse<Testimonial>>('/testimonials', payload).then((r) => r.data),

  update: (id: string, payload: Partial<Testimonial>) =>
    apiClient.put<ApiResponse<Testimonial>>(`/testimonials/${id}`, payload).then((r) => r.data),

  remove: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/testimonials/${id}`).then((r) => r.data),
};

// ---------- Newsletter ----------

export const newsletterApi = {
  subscribe: (email: string) =>
    apiClient.post<ApiResponse<null>>('/newsletter', { email }).then((r) => r.data),
};

// ---------- Dashboard ----------

export const dashboardApi = {
  getStats: () => apiClient.get<ApiResponse<DashboardStats>>('/stats').then((r) => r.data),
};

// ---------- Upload ----------

export const uploadApi = {
  uploadImage: (file: File, alt?: string) => {
    const formData = new FormData();
    formData.append('image', file);
    if (alt) formData.append('alt', alt);
    return apiClient
      .post<ApiResponse<UploadResult>>('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },
};
