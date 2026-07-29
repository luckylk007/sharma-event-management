import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { PublicLayout } from '@/layouts/PublicLayout';
import { AdminLayout } from '@/layouts/AdminLayout';

const Home = lazy(() => import('@/pages/Home'));
const About = lazy(() => import('@/pages/About'));
const Services = lazy(() => import('@/pages/Services'));
const ServiceDetail = lazy(() => import('@/pages/ServiceDetail'));
const Gallery = lazy(() => import('@/pages/Gallery'));
const Blog = lazy(() => import('@/pages/Blog'));
const BlogDetail = lazy(() => import('@/pages/BlogDetail'));
const Contact = lazy(() => import('@/pages/Contact'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const Terms = lazy(() => import('@/pages/Terms'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const AdminLogin = lazy(() => import('@/pages/admin/Login'));
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const AdminBlogs = lazy(() => import('@/pages/admin/Blogs'));
const AdminBlogForm = lazy(() => import('@/pages/admin/BlogForm'));
const AdminServices = lazy(() => import('@/pages/admin/Services'));
const AdminServiceForm = lazy(() => import('@/pages/admin/ServiceForm'));
const AdminGallery = lazy(() => import('@/pages/admin/Gallery'));
const AdminContacts = lazy(() => import('@/pages/admin/Contacts'));
const AdminSettings = lazy(() => import('@/pages/admin/Settings'));
const AdminTestimonials = lazy(() => import('@/pages/admin/Testimonials'));

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <AuthProvider>
          <SettingsProvider>
            <BrowserRouter>
              <Suspense fallback={<LoadingScreen />}>
                <Routes>
                  <Route element={<PublicLayout />}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="services" element={<Services />} />
                    <Route path="services/:slug" element={<ServiceDetail />} />
                    <Route path="gallery" element={<Gallery />} />
                    <Route path="blog" element={<Blog />} />
                    <Route path="blog/:slug" element={<BlogDetail />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="privacy-policy" element={<Privacy />} />
                    <Route path="terms-conditions" element={<Terms />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>

                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="blogs" element={<AdminBlogs />} />
                    <Route path="blogs/new" element={<AdminBlogForm />} />
                    <Route path="blogs/:id/edit" element={<AdminBlogForm />} />
                    <Route path="services" element={<AdminServices />} />
                    <Route path="services/new" element={<AdminServiceForm />} />
                    <Route path="services/:id/edit" element={<AdminServiceForm />} />
                    <Route path="gallery" element={<AdminGallery />} />
                    <Route path="contacts" element={<AdminContacts />} />
                    <Route path="settings" element={<AdminSettings />} />
                    <Route path="testimonials" element={<AdminTestimonials />} />
                  </Route>
                </Routes>
              </Suspense>
            </BrowserRouter>

            <Toaster
              position="top-right"
              toastOptions={{
                className: 'toast-premium',
                duration: 4000,
              }}
            />
          </SettingsProvider>
        </AuthProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
