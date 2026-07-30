import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { FiSearch, FiX, FiArrowRight, FiClock, FiEye } from 'react-icons/fi';

import { blogsApi } from '@/api';
import type { Blog, BlogSidebarData } from '@/types';
import { SEO } from '@/components/seo/SEO';
import { JsonLd, breadcrumbSchema } from '@/components/seo/JsonLd';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { SkeletonCard, SkeletonText, Skeleton } from '@/components/ui/Skeleton';
import { NewsletterForm } from '@/components/common/NewsletterForm';
import { Pagination } from '@/components/common/Pagination';
import { RevealGroup } from '@/components/common/Reveal';
import { fadeUp } from '@/animations/variants';
import { useDebounce } from '@/hooks/useDebounce';
import { SITE } from '@/constants';
import { IMAGES } from '@/constants/images';
import { cn } from '@/utils/cn';

export default function Blog() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [tag, setTag] = useState<string | undefined>(undefined);
  const debouncedSearch = useDebounce(search, 450);

  const [sidebar, setSidebar] = useState<BlogSidebarData | null>(null);

  useEffect(() => {
    blogsApi
      .getSidebar()
      .then((res) => setSidebar(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, tag]);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    blogsApi
      .getAll({ page, limit: 9, search: debouncedSearch || undefined, category, tag })
      .then((res) => {
        if (!mounted) return;
        setBlogs(res.data);
        setPages(res.pages);
        setTotal(res.total);
      })
      .catch(() => {
        if (!mounted) return;
        setBlogs([]);
        setPages(1);
        setTotal(0);
      })
      .finally(() => mounted && setIsLoading(false));
    return () => {
      mounted = false;
    };
  }, [page, debouncedSearch, category, tag]);

  const hasActiveFilters = !!(search || category || tag);

  const clearFilters = () => {
    setSearch('');
    setCategory(undefined);
    setTag(undefined);
  };

  return (
    <>
      <SEO
        title="Blog"
        description={`Planning tips, trends and behind-the-scenes stories from ${SITE.fullName} — your guide to unforgettable events in Uttarakhand.`}
        url="/blog"
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog' },
        ])}
      />

      {/* ---------------- HERO ---------------- */}
      <section className="relative flex h-[50svh] min-h-[380px] w-full items-end overflow-hidden bg-[var(--color-ink)]">
        <OptimizedImage
          src={IMAGES.pages.blogHero}
          alt="The Journal"
          loading="eager"
          wrapperClassName="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)] via-[var(--color-ink)]/70 to-black/75" />
        <div className="container-custom relative z-10 pb-14 pt-32">
          <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Blog' }]} className="mb-6" />
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl font-display text-5xl leading-[1.05] text-[var(--color-cream)] sm:text-6xl lg:text-7xl"
          >
            The Journal
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="mt-5 max-w-xl text-[var(--color-muted)]"
          >
            Planning tips, inspiration and stories from behind the scenes of the events we craft.
          </motion.p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-custom grid grid-cols-1 gap-14 lg:grid-cols-[1fr_340px]">
          {/* ---------------- MAIN ---------------- */}
          <div>
            <div className="relative mb-8">
              <FiSearch className="pointer-events-none absolute left-0.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles..."
                className="pl-6"
              />
            </div>

            {hasActiveFilters && (
              <div className="mb-8 flex flex-wrap items-center gap-3">
                {search && <Badge variant="outline">Search: {search}</Badge>}
                {category && (
                  <Badge variant="outline" className="cursor-pointer" >
                    <span onClick={() => setCategory(undefined)} className="flex items-center gap-1.5">
                      {category} <FiX size={11} />
                    </span>
                  </Badge>
                )}
                {tag && (
                  <Badge variant="outline" className="cursor-pointer">
                    <span onClick={() => setTag(undefined)} className="flex items-center gap-1.5">
                      #{tag} <FiX size={11} />
                    </span>
                  </Badge>
                )}
                <button
                  onClick={clearFilters}
                  className="text-xs uppercase tracking-widest text-[var(--color-gold)] hover:underline"
                >
                  Clear all
                </button>
              </div>
            )}

            <p className="mb-8 text-sm text-[var(--color-muted)]">
              {isLoading ? 'Searching…' : `${total} article${total === 1 ? '' : 's'} found`}
            </p>

            {isLoading ? (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : blogs.length === 0 ? (
              <div className="border border-[var(--color-line)] py-20 text-center">
                <p className="text-[var(--color-muted)]">
                  No articles matched your search. Try a different keyword or clear your filters.
                </p>
              </div>
            ) : (
              <RevealGroup className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2" stagger={0.08}>
                {blogs.map((blog) => (
                  <motion.div key={blog._id} variants={fadeUp}>
                    <Link to={`/blog/${blog.slug}`} className="group block">
                      <div className="aspect-[4/3] w-full overflow-hidden">
                        <OptimizedImage
                          src={blog.featuredImage.url}
                          alt={blog.featuredImage.alt || blog.title}
                          wrapperClassName="h-full w-full"
                          className="transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="mt-5 flex items-center gap-3 text-xs uppercase tracking-widest text-[var(--color-muted)]">
                        <span className="text-[var(--color-gold)]">{blog.category}</span>
                        <span>&middot;</span>
                        <span className="flex items-center gap-1">
                          <FiClock size={11} /> {blog.readingTime} min read
                        </span>
                      </div>
                      <h3 className="mt-3 font-display text-2xl leading-tight text-[var(--color-cream)] transition-colors duration-300 group-hover:text-[var(--color-gold)]">
                        {blog.title}
                      </h3>
                      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[var(--color-muted)]">
                        {blog.excerpt}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--color-cream)]">
                        Read Article
                        <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5" />
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </RevealGroup>
            )}

            <Pagination page={page} pages={pages} onChange={setPage} />
          </div>

          {/* ---------------- SIDEBAR ---------------- */}
          <aside className="space-y-12">
            {!sidebar ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-1/2" />
                <SkeletonText lines={4} />
              </div>
            ) : (
              <>
                {sidebar.latest.length > 0 && (
                  <div>
                    <h4 className="eyebrow mb-6">Latest Posts</h4>
                    <div className="space-y-5">
                      {sidebar.latest.map((post) => (
                        <Link
                          key={post._id}
                          to={`/blog/${post.slug}`}
                          className="group flex items-center gap-4"
                        >
                          <div className="h-16 w-16 shrink-0 overflow-hidden">
                            <OptimizedImage
                              src={post.featuredImage.url}
                              alt={post.featuredImage.alt || post.title}
                              wrapperClassName="h-full w-full"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="line-clamp-2 text-sm text-[var(--color-cream)] transition-colors duration-300 group-hover:text-[var(--color-gold)]">
                              {post.title}
                            </p>
                            {post.publishedAt && (
                              <p className="mt-1 text-xs text-[var(--color-muted)]">
                                {format(new Date(post.publishedAt), 'MMM d, yyyy')}
                              </p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {sidebar.popular.length > 0 && (
                  <div>
                    <h4 className="eyebrow mb-6">Popular Posts</h4>
                    <div className="space-y-5">
                      {sidebar.popular.map((post) => (
                        <Link
                          key={post._id}
                          to={`/blog/${post.slug}`}
                          className="group flex items-center gap-4"
                        >
                          <div className="h-16 w-16 shrink-0 overflow-hidden">
                            <OptimizedImage
                              src={post.featuredImage.url}
                              alt={post.featuredImage.alt || post.title}
                              wrapperClassName="h-full w-full"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="line-clamp-2 text-sm text-[var(--color-cream)] transition-colors duration-300 group-hover:text-[var(--color-gold)]">
                              {post.title}
                            </p>
                            <p className="mt-1 flex items-center gap-1 text-xs text-[var(--color-muted)]">
                              <FiEye size={11} /> {post.views} views
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {sidebar.categories.length > 0 && (
                  <div>
                    <h4 className="eyebrow mb-6">Categories</h4>
                    <ul className="space-y-2.5">
                      {sidebar.categories.map((cat) => (
                        <li key={cat.name}>
                          <button
                            onClick={() => setCategory(category === cat.name ? undefined : cat.name)}
                            className={cn(
                              'flex w-full items-center justify-between border-b border-[var(--color-line)] py-2.5 text-sm transition-colors duration-300',
                              category === cat.name
                                ? 'text-[var(--color-gold)]'
                                : 'text-[var(--color-muted)] hover:text-[var(--color-cream)]'
                            )}
                          >
                            <span>{cat.name}</span>
                            <span>{cat.count}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {sidebar.tags.length > 0 && (
                  <div>
                    <h4 className="eyebrow mb-6">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {sidebar.tags.map((t) => (
                        <button
                          key={t.name}
                          onClick={() => setTag(tag === t.name ? undefined : t.name)}
                          className={cn(
                            'border px-3 py-1.5 text-xs uppercase tracking-wide transition-colors duration-300',
                            tag === t.name
                              ? 'border-[var(--color-gold)] bg-[var(--color-gold)] text-[var(--color-ink)]'
                              : 'border-[var(--color-line)] text-[var(--color-muted)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]'
                          )}
                        >
                          #{t.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="border border-[var(--color-line)] bg-[var(--color-charcoal)] p-7">
              <h4 className="font-display text-xl text-[var(--color-cream)]">Stay Inspired</h4>
              <p className="mt-2.5 text-sm leading-relaxed text-[var(--color-muted)]">
                Get planning tips and seasonal offers delivered to your inbox.
              </p>
              <NewsletterForm className="mt-6" />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
