import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiFileText,
  FiCheckCircle,
  FiBriefcase,
  FiImage,
  FiMail,
  FiInbox,
  FiStar,
  FiUsers,
  FiArrowRight,
  FiEye,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { dashboardApi } from '@/api';
import type { DashboardStats } from '@/types';
import { PageHeader } from '@/components/admin/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Skeleton, SkeletonText } from '@/components/ui/Skeleton';

const CARD_CONFIG: {
  key: keyof DashboardStats['cards'];
  label: string;
  icon: typeof FiFileText;
}[] = [
  { key: 'blogs', label: 'Total Blogs', icon: FiFileText },
  { key: 'publishedBlogs', label: 'Published Blogs', icon: FiCheckCircle },
  { key: 'services', label: 'Services', icon: FiBriefcase },
  { key: 'gallery', label: 'Gallery Items', icon: FiImage },
  { key: 'contacts', label: 'Total Enquiries', icon: FiMail },
  { key: 'newContacts', label: 'New Enquiries', icon: FiInbox },
  { key: 'testimonials', label: 'Testimonials', icon: FiStar },
  { key: 'subscribers', label: 'Subscribers', icon: FiUsers },
];

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    dashboardApi
      .getStats()
      .then((res) => {
        if (mounted) setStats(res.data);
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : 'Failed to load dashboard stats');
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <PageHeader title="Dashboard" description="An overview of your website's content and activity." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CARD_CONFIG.map(({ key, label, icon: Icon }) => (
          <div
            key={key}
            className="border border-[var(--color-line)] bg-[var(--color-charcoal)] p-6 transition-colors hover:border-[var(--color-gold)]/40"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center border border-[var(--color-line)] text-[var(--color-gold)]">
                <Icon size={18} />
              </span>
              {isLoading && <Skeleton className="h-6 w-10" />}
            </div>
            {!isLoading && (
              <p className="mt-5 font-display text-3xl text-[var(--color-cream)]">
                {stats?.cards[key] ?? 0}
              </p>
            )}
            <p className="mt-1 text-xs uppercase tracking-widest text-[var(--color-muted)]">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="border border-[var(--color-line)] bg-[var(--color-charcoal)] p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-xl text-[var(--color-cream)]">Recent Enquiries</h2>
            <Link
              to="/admin/contacts"
              className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-[var(--color-gold)] hover:underline"
            >
              View all <FiArrowRight size={12} />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonText key={i} lines={2} />
              ))}
            </div>
          ) : !stats?.recentContacts.length ? (
            <p className="text-sm text-[var(--color-muted)]">No enquiries yet.</p>
          ) : (
            <ul className="divide-y divide-[var(--color-line)]">
              {stats.recentContacts.map((contact) => (
                <li key={contact._id} className="flex items-start justify-between gap-4 py-4 first:pt-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-[var(--color-cream)]">{contact.name}</p>
                    <p className="mt-1 truncate text-xs text-[var(--color-muted)]">{contact.subject}</p>
                    <p className="mt-1 text-[0.7rem] uppercase tracking-widest text-[var(--color-muted)]/70">
                      {format(new Date(contact.createdAt), 'dd MMM yyyy, hh:mm a')}
                    </p>
                  </div>
                  <Badge
                    variant={
                      contact.status === 'new'
                        ? 'gold'
                        : contact.status === 'replied'
                          ? 'success'
                          : contact.status === 'archived'
                            ? 'muted'
                            : 'outline'
                    }
                  >
                    {contact.status}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border border-[var(--color-line)] bg-[var(--color-charcoal)] p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-xl text-[var(--color-cream)]">Recent Blogs</h2>
            <Link
              to="/admin/blogs"
              className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-[var(--color-gold)] hover:underline"
            >
              View all <FiArrowRight size={12} />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonText key={i} lines={2} />
              ))}
            </div>
          ) : !stats?.recentBlogs.length ? (
            <p className="text-sm text-[var(--color-muted)]">No blogs yet.</p>
          ) : (
            <ul className="divide-y divide-[var(--color-line)]">
              {stats.recentBlogs.map((blog) => (
                <li key={blog._id} className="flex items-start justify-between gap-4 py-4 first:pt-0">
                  <div className="min-w-0">
                    <Link
                      to={`/admin/blogs/${blog._id}/edit`}
                      className="block truncate text-sm text-[var(--color-cream)] hover:text-[var(--color-gold)]"
                    >
                      {blog.title}
                    </Link>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
                      <FiEye size={12} /> {blog.views} views ·{' '}
                      {format(new Date(blog.updatedAt), 'dd MMM yyyy')}
                    </p>
                  </div>
                  <Badge variant={blog.isPublished ? 'success' : 'muted'}>
                    {blog.isPublished ? 'Published' : 'Draft'}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
