import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import {
  FiArrowRight,
  FiClock,
  FiEye,
  FiCalendar,
  FiLink,
  FiList,
} from 'react-icons/fi';
import { FaFacebookF, FaWhatsapp, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';

import { blogsApi } from '@/api';
import type { Blog } from '@/types';
import { SEO } from '@/components/seo/SEO';
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema as buildFaqSchema } from '@/components/seo/JsonLd';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/Button';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { Skeleton, SkeletonText } from '@/components/ui/Skeleton';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FAQAccordion } from '@/components/common/FAQAccordion';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { Reveal, RevealGroup } from '@/components/common/Reveal';
import { fadeUp } from '@/animations/variants';
import { getLenis } from '@/hooks/useLenis';
import { slugify } from '@/utils/text';
import { SITE } from '@/constants';
import { cn } from '@/utils/cn';

interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

function isPopulatedBlog(item: Blog | string): item is Blog {
  return typeof item !== 'string';
}

function processContent(content: string): { html: string; toc: TocItem[] } {
  if (typeof window === 'undefined' || !content) return { html: content, toc: [] };

  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  const headings = Array.from(doc.querySelectorAll('h2, h3'));
  const usedIds = new Set<string>();
  const toc: TocItem[] = [];

  headings.forEach((heading) => {
    const text = heading.textContent?.trim();
    if (!text) return;
    const base = slugify(text) || 'section';
    let id = base;
    let counter = 1;
    while (usedIds.has(id)) {
      id = `${base}-${counter++}`;
    }
    usedIds.add(id);
    heading.id = id;
    toc.push({ id, text, level: heading.tagName === 'H2' ? 2 : 3 });
  });

  return { html: doc.body.innerHTML, toc };
}

export default function BlogDetail() {
  const { slug = '' } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setNotFound(false);
    setBlog(null);
    window.scrollTo(0, 0);

    blogsApi
      .getBySlug(slug)
      .then((res) => mounted && setBlog(res.data))
      .catch(() => mounted && setNotFound(true))
      .finally(() => mounted && setIsLoading(false));

    return () => {
      mounted = false;
    };
  }, [slug]);

  const { html, toc } = useMemo(() => processContent(blog?.content || ''), [blog?.content]);

  if (isLoading) {
    return (
      <div className="container-custom py-32">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="mt-6 h-[45vh] w-full" />
        <div className="mt-10 max-w-2xl">
          <SkeletonText lines={6} />
        </div>
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <p className="eyebrow mb-4">Error 404</p>
        <h1 className="font-display text-5xl text-[var(--color-cream)] sm:text-6xl">
          Article Not Found
        </h1>
        <p className="mt-5 max-w-md text-[var(--color-muted)]">
          This article may have been moved, unpublished, or never existed.
        </p>
        <Link to="/blog" className="mt-8">
          <Button icon={<FiArrowRight />}>Browse All Articles</Button>
        </Link>
      </section>
    );
  }

  const publishedDate = blog.publishedAt || blog.createdAt;
  const canonicalUrl = `/blog/${blog.slug}`;
  const fullUrl = `${SITE.url}${canonicalUrl}`;
  const relatedPosts = (blog.relatedPosts || []).filter(isPopulatedBlog);

  const handleTocClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(el, { offset: -96 });
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const shareLinks = [
    {
      label: 'Facebook',
      Icon: FaFacebookF,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
    },
    {
      label: 'X (Twitter)',
      Icon: FaXTwitter,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(blog.title)}`,
    },
    {
      label: 'WhatsApp',
      Icon: FaWhatsapp,
      href: `https://wa.me/?text=${encodeURIComponent(`${blog.title} — ${fullUrl}`)}`,
    },
    {
      label: 'LinkedIn',
      Icon: FaLinkedinIn,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`,
    },
  ];

  const copyLink = () => {
    navigator.clipboard
      .writeText(fullUrl)
      .then(() => toast.success('Link copied to clipboard', { className: 'toast-premium' }))
      .catch(() => toast.error('Could not copy link', { className: 'toast-premium' }));
  };

  return (
    <>
      <SEO
        title={blog.seo?.metaTitle || blog.title}
        description={blog.seo?.metaDescription || blog.excerpt}
        keywords={blog.seo?.keywords}
        image={blog.seo?.ogImage || blog.featuredImage.url}
        url={canonicalUrl}
        type="article"
        publishedTime={publishedDate}
        modifiedTime={blog.updatedAt}
      />
      <JsonLd
        data={[
          articleSchema({
            title: blog.title,
            description: blog.excerpt,
            image: blog.featuredImage.url,
            datePublished: publishedDate,
            dateModified: blog.updatedAt,
            authorName: blog.author.name,
            url: fullUrl,
          }),
          breadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Blog', url: '/blog' },
            { name: blog.title, url: canonicalUrl },
          ]),
          ...(blog.faqs.length ? [buildFaqSchema(blog.faqs)] : []),
        ]}
      />

      {/* ---------------- HERO ---------------- */}
      <section className="relative flex h-[60svh] min-h-[440px] w-full items-end overflow-hidden bg-[var(--color-ink)]">
        <OptimizedImage
          src={blog.featuredImage.url}
          alt={blog.featuredImage.alt || blog.title}
          loading="eager"
          wrapperClassName="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)] via-[var(--color-ink)]/70 to-black/75" />
        <div className="container-custom relative z-10 max-w-4xl pb-16 pt-32">
          <Breadcrumb
            items={[{ label: 'Home', to: '/' }, { label: 'Blog', to: '/blog' }, { label: blog.title }]}
            className="mb-6"
          />
          <p className="eyebrow mb-4">{blog.category}</p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl leading-[1.1] text-[var(--color-cream)] sm:text-5xl lg:text-6xl"
          >
            {blog.title}
          </motion.h1>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[var(--color-muted)]">
            <span className="flex items-center gap-2">
              <FiCalendar size={14} className="text-[var(--color-gold)]" />
              {format(new Date(publishedDate), 'MMMM d, yyyy')}
            </span>
            <span className="flex items-center gap-2">
              <FiClock size={14} className="text-[var(--color-gold)]" />
              {blog.readingTime} min read
            </span>
            <span className="flex items-center gap-2">
              <FiEye size={14} className="text-[var(--color-gold)]" />
              {blog.views} views
            </span>
            <span>By {blog.author.name}</span>
          </div>
        </div>
      </section>

      {/* ---------------- CONTENT ---------------- */}
      <section className="py-20 sm:py-28">
        <div className="container-custom grid grid-cols-1 gap-14 lg:grid-cols-[1fr_280px]">
          <article>
            <div className="prose-luxury" dangerouslySetInnerHTML={{ __html: html }} />

            {/* Share */}
            <div className="mt-14 flex flex-wrap items-center gap-4 border-y border-[var(--color-line)] py-7">
              <span className="text-xs uppercase tracking-widest text-[var(--color-muted)]">
                Share This Article
              </span>
              <div className="flex items-center gap-3">
                {shareLinks.map(({ label, Icon, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Share on ${label}`}
                    className="flex h-10 w-10 items-center justify-center border border-[var(--color-line)] text-[var(--color-muted)] transition-colors duration-300 hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
                  >
                    <Icon size={15} />
                  </a>
                ))}
                <button
                  onClick={copyLink}
                  aria-label="Copy link"
                  className="flex h-10 w-10 items-center justify-center border border-[var(--color-line)] text-[var(--color-muted)] transition-colors duration-300 hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
                >
                  <FiLink size={15} />
                </button>
              </div>
            </div>

            {/* Author box */}
            <Reveal className="mt-10 flex flex-col items-start gap-6 border border-[var(--color-line)] bg-[var(--color-charcoal)] p-8 sm:flex-row sm:items-center">
              {blog.author.avatar ? (
                <OptimizedImage
                  src={blog.author.avatar}
                  alt={blog.author.name}
                  wrapperClassName="h-20 w-20 shrink-0 rounded-full"
                  className="rounded-full"
                />
              ) : (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[var(--color-graphite)] font-display text-3xl text-[var(--color-gold)]">
                  {blog.author.name.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-xs uppercase tracking-widest text-[var(--color-gold)]">
                  Written By
                </p>
                <h4 className="mt-1 font-display text-2xl text-[var(--color-cream)]">
                  {blog.author.name}
                </h4>
                {blog.author.bio && (
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                    {blog.author.bio}
                  </p>
                )}
              </div>
            </Reveal>

            {/* FAQs */}
            {blog.faqs.length > 0 && (
              <div className="mt-16">
                <h3 className="font-display text-3xl text-[var(--color-cream)]">
                  Frequently Asked Questions
                </h3>
                <div className="mt-8">
                  <FAQAccordion faqs={blog.faqs} />
                </div>
              </div>
            )}

            {/* CTA */}
            <Reveal className="mt-16 border border-[var(--color-gold)]/40 bg-[var(--color-charcoal)] p-10 text-center sm:p-14">
              <h3 className="font-display text-3xl text-[var(--color-cream)] sm:text-4xl">
                Planning an Event of Your Own?
              </h3>
              <p className="mx-auto mt-4 max-w-md text-[var(--color-muted)]">
                Let our team help you turn your vision into a beautifully executed celebration.
              </p>
              <div className="mt-8 flex justify-center">
                <MagneticButton>
                  <Link to="/contact">
                    <Button size="lg" icon={<FiArrowRight />}>
                      Get in Touch
                    </Button>
                  </Link>
                </MagneticButton>
              </div>
            </Reveal>
          </article>

          {/* ---------------- TOC SIDEBAR ---------------- */}
          {toc.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-28 border border-[var(--color-line)] bg-[var(--color-charcoal)] p-6">
                <p className="mb-5 flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--color-gold)]">
                  <FiList size={13} /> On This Page
                </p>
                <nav className="space-y-1">
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={handleTocClick(item.id)}
                      className={cn(
                        'block border-l py-1.5 text-sm leading-snug text-[var(--color-muted)] transition-colors duration-300 hover:text-[var(--color-gold)]',
                        item.level === 2 ? 'border-[var(--color-line)] pl-4' : 'border-transparent pl-8 text-[0.8rem]'
                      )}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}
        </div>
      </section>

      {/* ---------------- RELATED POSTS ---------------- */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-[var(--color-line)] bg-[var(--color-charcoal)] py-24 sm:py-28">
          <div className="container-custom">
            <SectionHeading eyebrow="Keep Reading" title="Related Articles" />
            <RevealGroup
              className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
              stagger={0.1}
            >
              {relatedPosts.map((post) => (
                <motion.div key={post._id} variants={fadeUp}>
                  <Link to={`/blog/${post.slug}`} className="group block">
                    <div className="aspect-[4/3] w-full overflow-hidden">
                      <OptimizedImage
                        src={post.featuredImage.url}
                        alt={post.featuredImage.alt || post.title}
                        wrapperClassName="h-full w-full"
                        className="transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <p className="mt-5 text-xs uppercase tracking-widest text-[var(--color-gold)]">
                      {post.category}
                    </p>
                    <h3 className="mt-2 font-display text-xl text-[var(--color-cream)] transition-colors duration-300 group-hover:text-[var(--color-gold)]">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-2 line-clamp-2 text-sm text-[var(--color-muted)]">
                        {post.excerpt}
                      </p>
                    )}
                  </Link>
                </motion.div>
              ))}
            </RevealGroup>
          </div>
        </section>
      )}
    </>
  );
}
