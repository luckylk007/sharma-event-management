import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import {
  FiSave,
  FiEye,
  FiArrowLeft,
  FiPlus,
  FiTrash2,
  FiBold,
  FiItalic,
  FiLink,
  FiList,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { blogsApi } from '@/api';
import type { Blog } from '@/types';
import { PageHeader } from '@/components/admin/PageHeader';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { slugify } from '@/utils/slugify';

const blogSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  slug: z.string().min(3, 'Slug is required'),
  excerpt: z.string().min(10, 'Excerpt is required (min 10 characters)'),
  content: z.string().min(20, 'Content is required (min 20 characters)'),
  featuredImageUrl: z.string().min(1, 'Featured image is required'),
  featuredImageAlt: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  tags: z.string().optional(),
  authorName: z.string().min(1, 'Author name is required'),
  authorBio: z.string().optional(),
  isPublished: z.boolean(),
  isFeatured: z.boolean(),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
});

type BlogFormValues = z.infer<typeof blogSchema>;

const CATEGORY_OPTIONS = [
  { label: 'Wedding Planning', value: 'Wedding Planning' },
  { label: 'Corporate Events', value: 'Corporate Events' },
  { label: 'Birthday Parties', value: 'Birthday Parties' },
  { label: 'Event Tips', value: 'Event Tips' },
  { label: 'Trends', value: 'Trends' },
  { label: 'Venues', value: 'Venues' },
  { label: 'General', value: 'General' },
];

const defaultValues: BlogFormValues = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  featuredImageUrl: '',
  featuredImageAlt: '',
  category: '',
  tags: '',
  authorName: 'Sharma Events Team',
  authorBio: '',
  isPublished: false,
  isFeatured: false,
  faqs: [],
  metaTitle: '',
  metaDescription: '',
  keywords: '',
  ogTitle: '',
  ogDescription: '',
  ogImage: '',
};

export default function BlogForm() {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isPreview, setIsPreview] = useState(false);
  const [slugTouched, setSlugTouched] = useState(isEditMode);
  const contentRef = useRef<HTMLTextAreaElement | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'faqs' });

  const titleValue = watch('title');
  const contentValue = watch('content');

  useEffect(() => {
    if (!slugTouched) {
      setValue('slug', slugify(titleValue || ''));
    }
  }, [titleValue, slugTouched, setValue]);

  useEffect(() => {
    if (!isEditMode) return;
    blogsApi
      .getBySlug(id!)
      .then((res) => {
        const blog = res.data;
        reset({
          title: blog.title,
          slug: blog.slug,
          excerpt: blog.excerpt,
          content: blog.content,
          featuredImageUrl: blog.featuredImage?.url || '',
          featuredImageAlt: blog.featuredImage?.alt || '',
          category: blog.category,
          tags: blog.tags?.join(', ') || '',
          authorName: blog.author?.name || '',
          authorBio: blog.author?.bio || '',
          isPublished: blog.isPublished,
          isFeatured: blog.isFeatured,
          faqs: blog.faqs || [],
          metaTitle: blog.seo?.metaTitle || '',
          metaDescription: blog.seo?.metaDescription || '',
          keywords: blog.seo?.keywords?.join(', ') || '',
          ogTitle: blog.seo?.ogTitle || '',
          ogDescription: blog.seo?.ogDescription || '',
          ogImage: blog.seo?.ogImage || '',
        });
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : 'Failed to load blog');
      })
      .finally(() => setIsLoading(false));
  }, [id, isEditMode, reset]);

  const insertTag = (before: string, after = '') => {
    const textarea = contentRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    const selected = value.slice(start, end);
    const newValue = `${value.slice(0, start)}${before}${selected}${after}${value.slice(end)}`;
    setValue('content', newValue, { shouldDirty: true });
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd = start + before.length + selected.length;
    });
  };

  const buildPayload = (values: BlogFormValues, publish?: boolean): Partial<Blog> => ({
    title: values.title,
    slug: values.slug,
    excerpt: values.excerpt,
    content: values.content,
    featuredImage: {
      url: values.featuredImageUrl,
      alt: values.featuredImageAlt || values.title,
    },
    category: values.category,
    tags: values.tags
      ? values.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [],
    author: {
      name: values.authorName,
      bio: values.authorBio || undefined,
    },
    faqs: values.faqs.filter((f) => f.question.trim() && f.answer.trim()),
    isPublished: publish !== undefined ? publish : values.isPublished,
    isFeatured: values.isFeatured,
    seo: {
      metaTitle: values.metaTitle || values.title,
      metaDescription: values.metaDescription || values.excerpt,
      keywords: values.keywords
        ? values.keywords.split(',').map((k) => k.trim()).filter(Boolean)
        : [],
      ogTitle: values.ogTitle || undefined,
      ogDescription: values.ogDescription || undefined,
      ogImage: values.ogImage || undefined,
    },
  });

  const submitForm = async (values: BlogFormValues, publish?: boolean) => {
    try {
      const payload = buildPayload(values, publish);
      if (isEditMode) {
        await blogsApi.update(id!, payload);
        toast.success('Blog updated');
      } else {
        await blogsApi.create(payload);
        toast.success('Blog created');
      }
      navigate('/admin/blogs');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save blog');
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
          to="/admin/blogs"
          className="flex h-9 w-9 items-center justify-center border border-[var(--color-line)] text-[var(--color-muted)] transition-colors hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
        >
          <FiArrowLeft size={16} />
        </Link>
        <PageHeader
          title={isEditMode ? 'Edit Blog' : 'New Blog'}
          actions={
            <>
              <Button
                type="button"
                variant="outline"
                icon={<FiEye />}
                iconPosition="left"
                onClick={() => setIsPreview((p) => !p)}
              >
                {isPreview ? 'Edit' : 'Preview'}
              </Button>
              <Button
                type="button"
                variant="outline"
                isLoading={isSubmitting}
                icon={<FiSave />}
                iconPosition="left"
                onClick={handleSubmit((values) => submitForm(values, false))}
              >
                Save Draft
              </Button>
              <Button
                type="button"
                isLoading={isSubmitting}
                icon={<FiSave />}
                iconPosition="left"
                onClick={handleSubmit((values) => submitForm(values, true))}
              >
                Publish
              </Button>
            </>
          }
        />
      </div>

      {isPreview ? (
        <div className="border border-[var(--color-line)] bg-[var(--color-charcoal)] p-8 sm:p-12">
          {watch('featuredImageUrl') && (
            <img
              src={watch('featuredImageUrl')}
              alt={watch('featuredImageAlt') || watch('title')}
              className="mb-8 h-72 w-full object-cover"
            />
          )}
          <p className="eyebrow">{watch('category') || 'Uncategorized'}</p>
          <h1 className="mt-3 font-display text-4xl text-[var(--color-cream)]">
            {watch('title') || 'Untitled Blog Post'}
          </h1>
          <p className="mt-4 text-[var(--color-muted)]">{watch('excerpt')}</p>
          <div className="hairline my-8" />
          <div
            className="prose prose-invert max-w-none leading-relaxed text-[var(--color-cream)]/90"
            dangerouslySetInnerHTML={{ __html: contentValue || '<p>No content yet.</p>' }}
          />
        </div>
      ) : (
        <form className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="space-y-6 border border-[var(--color-line)] bg-[var(--color-charcoal)] p-6 sm:p-8">
              <h2 className="font-display text-xl text-[var(--color-cream)]">Content</h2>
              <Input label="Title" {...register('title')} error={errors.title?.message} />
              <Input
                label="Slug"
                {...register('slug', {
                  onChange: () => setSlugTouched(true),
                })}
                error={errors.slug?.message}
                hint="Auto-generated from title. Edit to customize."
              />
              <Textarea label="Excerpt" rows={3} {...register('excerpt')} error={errors.excerpt?.message} />

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-xs uppercase tracking-widest text-[var(--color-muted)]">
                    Content (HTML)
                  </label>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => insertTag('<strong>', '</strong>')}
                      className="flex h-7 w-7 items-center justify-center border border-[var(--color-line)] text-[var(--color-muted)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
                      aria-label="Bold"
                    >
                      <FiBold size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTag('<em>', '</em>')}
                      className="flex h-7 w-7 items-center justify-center border border-[var(--color-line)] text-[var(--color-muted)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
                      aria-label="Italic"
                    >
                      <FiItalic size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTag('<h2>', '</h2>')}
                      className="flex h-7 items-center justify-center border border-[var(--color-line)] px-2 text-[0.65rem] text-[var(--color-muted)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
                      aria-label="Heading"
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTag('<ul>\n  <li>', '</li>\n</ul>')}
                      className="flex h-7 w-7 items-center justify-center border border-[var(--color-line)] text-[var(--color-muted)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
                      aria-label="List"
                    >
                      <FiList size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTag('<a href="">', '</a>')}
                      className="flex h-7 w-7 items-center justify-center border border-[var(--color-line)] text-[var(--color-muted)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
                      aria-label="Link"
                    >
                      <FiLink size={12} />
                    </button>
                  </div>
                </div>
                <Controller
                  control={control}
                  name="content"
                  render={({ field }) => (
                    <textarea
                      {...field}
                      ref={(el) => {
                        field.ref(el);
                        contentRef.current = el;
                      }}
                      rows={16}
                      className="w-full resize-y border border-[var(--color-line)] bg-transparent p-4 font-mono text-sm text-[var(--color-cream)] transition-colors duration-300 focus:border-[var(--color-gold)] focus:outline-none"
                      placeholder="<p>Write your blog content as HTML...</p>"
                    />
                  )}
                />
                {errors.content && <p className="mt-1.5 text-xs text-red-400">{errors.content.message}</p>}
              </div>
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
                  onClick={() => append({ question: '', answer: '' })}
                >
                  Add FAQ
                </Button>
              </div>
              {fields.length === 0 && (
                <p className="text-sm text-[var(--color-muted)]">No FAQs added yet.</p>
              )}
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-3 border border-[var(--color-line)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <Input
                      label={`Question ${index + 1}`}
                      {...register(`faqs.${index}.question` as const)}
                    />
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="mt-7 shrink-0 text-[var(--color-muted)] hover:text-red-400"
                      aria-label="Remove FAQ"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                  <Textarea
                    label="Answer"
                    rows={2}
                    {...register(`faqs.${index}.answer` as const)}
                  />
                </div>
              ))}
            </div>

            <div className="space-y-6 border border-[var(--color-line)] bg-[var(--color-charcoal)] p-6 sm:p-8">
              <h2 className="font-display text-xl text-[var(--color-cream)]">SEO</h2>
              <Input
                label="Meta Title"
                {...register('metaTitle')}
                hint="Defaults to the blog title if left blank."
              />
              <Textarea
                label="Meta Description"
                rows={2}
                {...register('metaDescription')}
                hint="Defaults to the excerpt if left blank."
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
              <h2 className="font-display text-xl text-[var(--color-cream)]">Publishing</h2>
              <label className="flex items-center gap-3 text-sm text-[var(--color-cream)]">
                <input type="checkbox" {...register('isPublished')} className="h-4 w-4 accent-[var(--color-gold)]" />
                Published
              </label>
              <label className="flex items-center gap-3 text-sm text-[var(--color-cream)]">
                <input type="checkbox" {...register('isFeatured')} className="h-4 w-4 accent-[var(--color-gold)]" />
                Featured
              </label>
            </div>

            <div className="space-y-6 border border-[var(--color-line)] bg-[var(--color-charcoal)] p-6 sm:p-8">
              <h2 className="font-display text-xl text-[var(--color-cream)]">Featured Image</h2>
              <ImageUploadField
                value={watch('featuredImageUrl')}
                onChange={(url) => setValue('featuredImageUrl', url)}
              />
              {errors.featuredImageUrl && (
                <p className="text-xs text-red-400">{errors.featuredImageUrl.message}</p>
              )}
              <Input label="Alt Text" {...register('featuredImageAlt')} />
            </div>

            <div className="space-y-6 border border-[var(--color-line)] bg-[var(--color-charcoal)] p-6 sm:p-8">
              <h2 className="font-display text-xl text-[var(--color-cream)]">Organization</h2>
              <Select
                label="Category"
                options={CATEGORY_OPTIONS}
                placeholder="Select a category"
                {...register('category')}
                error={errors.category?.message}
              />
              <Input label="Tags" {...register('tags')} hint="Comma-separated" />
            </div>

            <div className="space-y-6 border border-[var(--color-line)] bg-[var(--color-charcoal)] p-6 sm:p-8">
              <h2 className="font-display text-xl text-[var(--color-cream)]">Author</h2>
              <Input
                label="Author Name"
                {...register('authorName')}
                error={errors.authorName?.message}
              />
              <Textarea label="Author Bio" rows={3} {...register('authorBio')} />
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
