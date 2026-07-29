import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiExternalLink } from 'react-icons/fi';
import { servicesApi } from '@/api';
import type { Service } from '@/types';
import { PageHeader } from '@/components/admin/PageHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadServices = useCallback(() => {
    setIsLoading(true);
    servicesApi
      .getAll({ published: 'all' })
      .then((res) => setServices(res.data))
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : 'Failed to load services');
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete service "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await servicesApi.remove(id);
      toast.success('Service deleted');
      loadServices();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete service');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Services"
        description={`Manage the services you offer${services.length ? ` — ${services.length} total` : ''}.`}
        actions={
          <Link to="/admin/services/new">
            <Button icon={<FiPlus />} iconPosition="left">
              New Service
            </Button>
          </Link>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="border border-[var(--color-line)] bg-[var(--color-charcoal)] p-16 text-center text-[var(--color-muted)]">
          No services yet. Create your first one.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div key={service._id} className="border border-[var(--color-line)] bg-[var(--color-charcoal)]">
              <OptimizedImage
                src={service.banner?.url}
                alt={service.banner?.alt || service.title}
                wrapperClassName="aspect-video"
              />
              <div className="p-5">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h3 className="font-display text-lg text-[var(--color-cream)]">{service.title}</h3>
                  <Badge variant={service.isPublished ? 'success' : 'muted'}>
                    {service.isPublished ? 'Live' : 'Draft'}
                  </Badge>
                </div>
                <p className="line-clamp-2 text-sm text-[var(--color-muted)]">{service.shortDescription}</p>
                <div className="mt-4 flex items-center justify-between border-t border-[var(--color-line)] pt-4">
                  <span className="text-xs uppercase tracking-widest text-[var(--color-muted)]">
                    Order: {service.order}
                  </span>
                  <div className="flex items-center gap-3">
                    {service.isPublished && (
                      <a
                        href={`/services/${service.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Preview service"
                        className="text-[var(--color-muted)] transition-colors hover:text-[var(--color-gold)]"
                      >
                        <FiExternalLink size={16} />
                      </a>
                    )}
                    <Link
                      to={`/admin/services/${service._id}/edit`}
                      aria-label="Edit service"
                      className="text-[var(--color-muted)] transition-colors hover:text-[var(--color-gold)]"
                    >
                      <FiEdit2 size={16} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(service._id, service.title)}
                      disabled={deletingId === service._id}
                      aria-label="Delete service"
                      className="text-[var(--color-muted)] transition-colors hover:text-red-400 disabled:opacity-50"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
