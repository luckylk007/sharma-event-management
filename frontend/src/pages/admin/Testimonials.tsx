import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiStar } from 'react-icons/fi';
import { testimonialsApi } from '@/api';
import type { Testimonial } from '@/types';
import { PageHeader } from '@/components/admin/PageHeader';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/utils/cn';

interface FormState {
  id?: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  eventType: string;
  avatarUrl: string;
  isPublished: boolean;
  order: number;
}

const EMPTY_FORM: FormState = {
  name: '',
  role: '',
  content: '',
  rating: 5,
  eventType: '',
  avatarUrl: '',
  isPublished: true,
  order: 0,
};

const RATING_OPTIONS = [1, 2, 3, 4, 5].map((n) => ({ label: `${n} Star${n > 1 ? 's' : ''}`, value: String(n) }));

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadTestimonials = useCallback(() => {
    setIsLoading(true);
    testimonialsApi
      .getAll({ published: 'all' })
      .then((res) => setTestimonials(res.data))
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : 'Failed to load testimonials');
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    loadTestimonials();
  }, [loadTestimonials]);

  const openCreate = () => setForm({ ...EMPTY_FORM });

  const openEdit = (testimonial: Testimonial) =>
    setForm({
      id: testimonial._id,
      name: testimonial.name,
      role: testimonial.role,
      content: testimonial.content,
      rating: testimonial.rating,
      eventType: testimonial.eventType,
      avatarUrl: testimonial.avatar?.url || '',
      isPublished: testimonial.isPublished,
      order: testimonial.order,
    });

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete testimonial from "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await testimonialsApi.remove(id);
      toast.success('Testimonial deleted');
      loadTestimonials();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete testimonial');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSave = async () => {
    if (!form) return;
    if (!form.name.trim() || !form.role.trim() || !form.content.trim() || !form.eventType.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    setIsSaving(true);
    try {
      const payload: Partial<Testimonial> = {
        name: form.name,
        role: form.role,
        content: form.content,
        rating: form.rating,
        eventType: form.eventType,
        isPublished: form.isPublished,
        order: form.order,
        avatar: form.avatarUrl ? { url: form.avatarUrl, alt: form.name } : undefined,
      };
      if (form.id) {
        await testimonialsApi.update(form.id, payload);
        toast.success('Testimonial updated');
      } else {
        await testimonialsApi.create(payload);
        toast.success('Testimonial created');
      }
      setForm(null);
      loadTestimonials();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save testimonial');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Testimonials"
        description={`Manage customer testimonials${testimonials.length ? ` — ${testimonials.length} total` : ''}.`}
        actions={
          <Button icon={<FiPlus />} iconPosition="left" onClick={openCreate}>
            New Testimonial
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-52 w-full" />
          ))}
        </div>
      ) : testimonials.length === 0 ? (
        <div className="border border-[var(--color-line)] bg-[var(--color-charcoal)] p-16 text-center text-[var(--color-muted)]">
          No testimonials yet. Add your first one.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial._id} className="flex flex-col border border-[var(--color-line)] bg-[var(--color-charcoal)] p-6">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 shrink-0 overflow-hidden border border-[var(--color-line)] bg-[var(--color-graphite)]">
                    {testimonial.avatar?.url ? (
                      <img src={testimonial.avatar.url} alt={testimonial.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-[var(--color-muted)]">
                        {testimonial.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-[var(--color-cream)]">{testimonial.name}</p>
                    <p className="text-xs text-[var(--color-muted)]">{testimonial.role}</p>
                  </div>
                </div>
                <Badge variant={testimonial.isPublished ? 'success' : 'muted'}>
                  {testimonial.isPublished ? 'Live' : 'Hidden'}
                </Badge>
              </div>
              <div className="mb-3 flex items-center gap-1 text-[var(--color-gold)]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FiStar key={i} size={13} className={cn(i < testimonial.rating && 'fill-[var(--color-gold)]')} />
                ))}
              </div>
              <p className="flex-1 line-clamp-4 text-sm leading-relaxed text-[var(--color-muted)]">
                "{testimonial.content}"
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-[var(--color-line)] pt-4">
                <Badge variant="outline">{testimonial.eventType}</Badge>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => openEdit(testimonial)}
                    aria-label="Edit testimonial"
                    className="text-[var(--color-muted)] transition-colors hover:text-[var(--color-gold)]"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(testimonial._id, testimonial.name)}
                    disabled={deletingId === testimonial._id}
                    aria-label="Delete testimonial"
                    className="text-[var(--color-muted)] transition-colors hover:text-red-400 disabled:opacity-50"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={!!form} onClose={() => setForm(null)} title={form?.id ? 'Edit Testimonial' : 'New Testimonial'} size="lg">
        {form && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
                label="Role / Title"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="e.g. Bride, Groom's Father"
              />
            </div>
            <Textarea
              label="Testimonial Content"
              rows={4}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Event Type"
                value={form.eventType}
                onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                placeholder="e.g. Wedding"
              />
              <Select
                label="Rating"
                value={String(form.rating)}
                onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                options={RATING_OPTIONS}
              />
            </div>
            <ImageUploadField
              label="Avatar URL"
              value={form.avatarUrl}
              onChange={(url) => setForm({ ...form, avatarUrl: url })}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Display Order"
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              />
              <label className="flex items-center gap-3 self-end pb-3 text-sm text-[var(--color-cream)]">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                  className="h-4 w-4 accent-[var(--color-gold)]"
                />
                Published
              </label>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setForm(null)}>
                Cancel
              </Button>
              <Button onClick={handleSave} isLoading={isSaving}>
                Save Testimonial
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
