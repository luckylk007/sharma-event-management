import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { FiSave, FiArrowLeft, FiPlus, FiTrash2, FiStar } from 'react-icons/fi';
import { servicesApi } from '@/api';
import type { Service } from '@/types';
import { PageHeader } from '@/components/admin/PageHeader';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/utils/cn';
import { slugify } from '@/utils/slugify';

const serviceSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  slug: z.string().min(3, 'Slug is required'),
  shortDescription: z.string().min(10, 'Short description is required'),
  overview: z.string().min(20, 'Overview is required'),
  bannerUrl: z.string().min(1, 'Banner image is required'),
  bannerAlt: z.string().optional(),
  icon: z.string().min(1, 'Icon is required'),
  order: z.number(),
  isPublished: z.boolean(),
  includedServices: z.array(z.object({ value: z.string() })),
  gallery: z.array(z.object({ url: z.string(), alt: z.string() })),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })),
  packages: z.array(
    z.object({
      name: z.string(),
      price: z.string(),
      description: z.string(),
      features: z.string(),
      isPopular: z.boolean(),
    })
  ),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

const defaultValues: ServiceFormValues = {
  title: '',
  slug: '',
  shortDescription: '',
  overview: '',
  bannerUrl: '',
  bannerAlt: '',
  icon: 'FaRing',
  order: 0,
  isPublished: true,
  includedServices: [],
  gallery: [],
  faqs: [],
  packages: [],
  metaTitle: '',
  metaDescription: '',
  keywords: '',
  ogTitle: '',
  ogDescription: '',
  ogImage: '',
};

export default function ServiceForm() {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [slugTouched, setSlugTouched] = useState(isEditMode);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues,
  });

  const includedServices = useFieldArray({ control, name: 'includedServices' });
  const gallery = useFieldArray({ control, name: 'gallery' });
  const faqs = useFieldArray({ control, name: 'faqs' });
  const packages = useFieldArray({ control, name: 'packages' });

  const titleValue = watch('title');

  useEffect(() => {
    if (!slugTouched) {
      setValue('slug', slugify(titleValue || ''));
    }
  }, [titleValue, slugTouched, setValue]);

  useEffect(() => {
    if (!isEditMode) return;
    servicesApi
      .getBySlug(id!)
      .then((res) => {
        const service = res.data;
        reset({
          title: service.title,
          slug: service.slug,
          shortDescription: service.shortDescription,
          overview: service.overview,
          bannerUrl: service.banner?.url || '',
          bannerAlt: service.banner?.alt || '',
          icon: service.icon || 'FaRing',
          order: service.order ?? 0,
          isPublished: service.isPublished,
          includedServices: (service.includedServices || []).map((value) => ({ value })),
          gallery: (service.gallery || []).map((g) => ({ url: g.url, alt: g.alt || '' })),
          faqs: service.faqs || [],
          packages: (service.packages || []).map((p) => ({
            name: p.name,
            price: p.price,
            description: p.description,
            features: (p.features || []).join(', '),
            isPopular: !!p.isPopular,
          })),
          metaTitle: service.seo?.metaTitle || '',
          metaDescription: service.seo?.metaDescription || '',
          keywords: service.seo?.keywords?.join(', ') || '',
          ogTitle: service.seo?.ogTitle || '',
          ogDescription: service.seo?.ogDescription || '',
          ogImage: service.seo?.ogImage || '',
        });
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : 'Failed to load service');
      })
      .finally(() => setIsLoading(false));
  }, [id, isEditMode, reset]);

  const onSubmit = async (values: ServiceFormValues) => {
    const payload: Partial<Service> = {
      title: values.title,
      slug: values.slug,
      shortDescription: values.shortDescription,
      overview: values.overview,
      banner: { url: values.bannerUrl, alt: values.bannerAlt || values.title },
      icon: values.icon,
      order: values.order,
      isPublished: values.isPublished,
      includedServices: values.includedServices.map((i) => i.value).filter(Boolean),
      gallery: values.gallery
        .filter((g) => g.url)
        .map((g) => ({ url: g.url, alt: g.alt || values.title })),
      faqs: values.faqs.filter((f) => f.question.trim() && f.answer.trim()),
      packages: values.packages
        .filter((p) => p.name.trim())
        .map((p) => ({
          name: p.name,
          price: p.price,
          description: p.description,
          features: p.features
            ? p.features.split(',').map((f) => f.trim()).filter(Boolean)
            : [],
          isPopular: p.isPopular,
        })),
      seo: {
        metaTitle: values.metaTitle || values.title,
        metaDescription: values.metaDescription || values.shortDescription,
        keywords: values.keywords
          ? values.keywords.split(',').map((k) => k.trim()).filter(Boolean)
          : [],
        ogTitle: values.ogTitle || undefined,
        ogDescription: values.ogDescription || undefined,
        ogImage: values.ogImage || undefined,
      },
    };

    try {
      if (isEditMode) {
        await servicesApi.update(id!, payload);
        toast.success('Service updated');
      } else {
        await servicesApi.create(payload);
        toast.success('Service created');
      }
      navigate('/admin/services');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save service');
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link
          to="/admin/services"
          className="flex h-9 w-9 items-center justify-center border border-[var(--color-line)] text-[var(--color-muted)] transition-colors hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
        >
          <FiArrowLeft size={16} />
        </Link>
        <PageHeader
          title={isEditMode ? 'Edit Service' : 'New Service'}
          actions={
            <Button
              type="button"
              isLoading={isSubmitting}
              icon={<FiSave />}
              iconPosition="left"
              onClick={handleSubmit(onSubmit)}
            >
              Save Service
            </Button>
          }
        />
      </div>

      <form className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="space-y-6 border border-[var(--color-line)] bg-[var(--color-charcoal)] p-6 sm:p-8">
            <h2 className="font-display text-xl text-[var(--color-cream)]">Overview</h2>
            <Input label="Title" {...register('title')} error={errors.title?.message} />
            <Input
              label="Slug"
              {...register('slug', { onChange: () => setSlugTouched(true) })}
              error={errors.slug?.message}
              hint="Auto-generated from title. Edit to customize."
            />
            <Textarea
              label="Short Description"
              rows={2}
              {...register('shortDescription')}
              error={errors.shortDescription?.message}
            />
            <Textarea
              label="Overview"
              rows={8}
              {...register('overview')}
              error={errors.overview?.message}
              hint="Supports HTML."
            />
          </div>

          <div className="space-y-6 border border-[var(--color-line)] bg-[var(--color-charcoal)] p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl text-[var(--color-cream)]">What's Included</h2>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                icon={<FiPlus />}
                iconPosition="left"
                onClick={() => includedServices.append({ value: '' })}
              >
                Add Item
              </Button>
            </div>
            {includedServices.fields.length === 0 && (
              <p className="text-sm text-[var(--color-muted)]">No included services listed yet.</p>
            )}
            {includedServices.fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-3">
                <div className="flex-1">
                  <Input {...register(`includedServices.${index}.value` as const)} />
                </div>
                <button
                  type="button"
                  onClick={() => includedServices.remove(index)}
                  className="shrink-0 text-[var(--color-muted)] hover:text-red-400"
                  aria-label="Remove item"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-6 border border-[var(--color-line)] bg-[var(--color-charcoal)] p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl text-[var(--color-cream)]">Gallery</h2>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                icon={<FiPlus />}
                iconPosition="left"
                onClick={() => gallery.append({ url: '', alt: '' })}
              >
                Add Image
              </Button>
            </div>
            {gallery.fields.length === 0 && (
              <p className="text-sm text-[var(--color-muted)]">No gallery images added yet.</p>
            )}
            {gallery.fields.map((field, index) => (
              <div key={field.id} className="space-y-3 border border-[var(--color-line)] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <ImageUploadField
                      label={`Image ${index + 1}`}
                      value={watch(`gallery.${index}.url`) || ''}
                      onChange={(url) => setValue(`gallery.${index}.url`, url)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => gallery.remove(index)}
                    className="mt-7 shrink-0 text-[var(--color-muted)] hover:text-red-400"
                    aria-label="Remove image"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
                <Input label="Alt text" {...register(`gallery.${index}.alt` as const)} />
              </div>
            ))}
          </div>

          <div className="space-y-6 border border-[var(--color-line)] bg-[var(--color-charcoal)] p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl text-[var(--color-cream)]">Packages</h2>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                icon={<FiPlus />}
                iconPosition="left"
                onClick={() =>
                  packages.append({ name: '', price: '', description: '', features: '', isPopular: false })
                }
              >
                Add Package
              </Button>
            </div>
            {packages.fields.length === 0 && (
              <p className="text-sm text-[var(--color-muted)]">No packages added yet.</p>
            )}
            {packages.fields.map((field, index) => (
              <div key={field.id} className="space-y-3 border border-[var(--color-line)] p-4">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs uppercase tracking-widest text-[var(--color-muted)]">
                    Package {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => packages.remove(index)}
                    className="shrink-0 text-[var(--color-muted)] hover:text-red-400"
                    aria-label="Remove package"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input label="Name" {...register(`packages.${index}.name` as const)} />
                  <Input label="Price" {...register(`packages.${index}.price` as const)} placeholder="₹50,000" />
                </div>
                <Textarea label="Description" rows={2} {...register(`packages.${index}.description` as const)} />
                <Input
                  label="Features"
                  {...register(`packages.${index}.features` as const)}
                  hint="Comma-separated"
                />
                <label className="flex items-center gap-3 text-sm text-[var(--color-cream)]">
                  <input
                    type="checkbox"
                    {...register(`packages.${index}.isPopular` as const)}
                    className="h-4 w-4 accent-[var(--color-gold)]"
                  />
                  <FiStar
                    size={14}
                    className={cn(watch(`packages.${index}.isPopular`) && 'fill-[var(--color-gold)] text-[var(--color-gold)]')}
                  />
                  Mark as most popular
                </label>
              </div>
            ))}
          </div>

          <div className="space-y-6 border border-[var(--color-line)] bg-[var(--color-charcoal)] p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl text-[var(--color-cream)]">FAQs</h2>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                icon={<FiPlus />}
                iconPosition="left"
                onClick={() => faqs.append({ question: '', answer: '' })}
              >
                Add FAQ
              </Button>
            </div>
            {faqs.fields.length === 0 && <p className="text-sm text-[var(--color-muted)]">No FAQs added yet.</p>}
            {faqs.fields.map((field, index) => (
              <div key={field.id} className="space-y-3 border border-[var(--color-line)] p-4">
                <div className="flex items-start justify-between gap-3">
                  <Input label={`Question ${index + 1}`} {...register(`faqs.${index}.question` as const)} />
                  <button
                    type="button"
                    onClick={() => faqs.remove(index)}
                    className="mt-7 shrink-0 text-[var(--color-muted)] hover:text-red-400"
                    aria-label="Remove FAQ"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
                <Textarea label="Answer" rows={2} {...register(`faqs.${index}.answer` as const)} />
              </div>
            ))}
          </div>

          <div className="space-y-6 border border-[var(--color-line)] bg-[var(--color-charcoal)] p-6 sm:p-8">
            <h2 className="font-display text-xl text-[var(--color-cream)]">SEO</h2>
            <Input label="Meta Title" {...register('metaTitle')} hint="Defaults to the title if left blank." />
            <Textarea
              label="Meta Description"
              rows={2}
              {...register('metaDescription')}
              hint="Defaults to the short description if left blank."
            />
            <Input label="Keywords" {...register('keywords')} hint="Comma-separated" />
            <Input label="OG Title" {...register('ogTitle')} />
            <Textarea label="OG Description" rows={2} {...register('ogDescription')} />
            <ImageUploadField
              label="OG Image URL"
              value={watch('ogImage') || ''}
              onChange={(url) => setValue('ogImage', url)}
            />
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-6 border border-[var(--color-line)] bg-[var(--color-charcoal)] p-6 sm:p-8">
            <h2 className="font-display text-xl text-[var(--color-cream)]">Settings</h2>
            <label className="flex items-center gap-3 text-sm text-[var(--color-cream)]">
              <input type="checkbox" {...register('isPublished')} className="h-4 w-4 accent-[var(--color-gold)]" />
              Published
            </label>
            <Input label="Display Order" type="number" {...register('order', { valueAsNumber: true })} />
            <Input
              label="Icon"
              {...register('icon')}
              error={errors.icon?.message}
              hint="react-icons/fa icon name, e.g. FaRing"
            />
          </div>

          <div className="space-y-6 border border-[var(--color-line)] bg-[var(--color-charcoal)] p-6 sm:p-8">
            <h2 className="font-display text-xl text-[var(--color-cream)]">Banner Image</h2>
            <ImageUploadField value={watch('bannerUrl')} onChange={(url) => setValue('bannerUrl', url)} />
            {errors.bannerUrl && <p className="text-xs text-red-400">{errors.bannerUrl.message}</p>}
            <Input label="Alt Text" {...register('bannerAlt')} />
          </div>
        </div>
      </form>
    </div>
  );
}
