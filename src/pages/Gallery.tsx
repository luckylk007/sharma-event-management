import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';

import { galleryApi } from '@/api';
import { staticGallery } from '@/data';
import type { GalleryCategory, GalleryItem } from '@/types';
import { SEO } from '@/components/seo/SEO';
import { JsonLd, breadcrumbSchema } from '@/components/seo/JsonLd';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { Skeleton } from '@/components/ui/Skeleton';
import { Spinner } from '@/components/ui/Spinner';
import { Lightbox } from '@/components/common/Lightbox';
import { GALLERY_CATEGORIES, SITE } from '@/constants';
import { IMAGES } from '@/constants/images';
import { cn } from '@/utils/cn';

type CategoryFilter = GalleryCategory | 'All';

const PAGE_SIZE = 12;
const ASPECT_CYCLE = ['4/5', '1/1', '4/3', '3/4', '1/1', '4/5'];

function firstPage(category: CategoryFilter): GalleryItem[] {
  const filtered =
    category === 'All' ? staticGallery : staticGallery.filter((g) => g.category === category);
  return [...filtered]
    .sort((a, b) => a.order - b.order || b.createdAt.localeCompare(a.createdAt))
    .slice(0, PAGE_SIZE);
}

export default function Gallery() {
  const [category, setCategory] = useState<CategoryFilter>('All');
  const [items, setItems] = useState<GalleryItem[]>(() => firstPage('All'));
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(() => staticGallery.length > PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const requestIdRef = useRef(0);

  // Reset + fetch first page whenever category changes (skip first paint — already hydrated)
  useEffect(() => {
    const requestId = ++requestIdRef.current;
    const initial = firstPage(category);
    setItems(initial);
    setPage(1);
    setHasMore(
      (category === 'All'
        ? staticGallery.length
        : staticGallery.filter((g) => g.category === category).length) > PAGE_SIZE
    );
    setIsLoading(false);

    galleryApi
      .getAll({ page: 1, limit: PAGE_SIZE, category: category === 'All' ? undefined : category })
      .then((res) => {
        if (requestIdRef.current !== requestId) return;
        setItems(res.data);
        setHasMore(!!res.hasMore);
      })
      .catch(() => {
        // Keep sync-hydrated items if the accessor fails
        if (requestIdRef.current !== requestId) return;
      });
  }, [category]);

  const loadMore = useCallback(() => {
    if (isLoading || isLoadingMore || !hasMore) return;
    const requestId = requestIdRef.current;
    const nextPage = page + 1;
    setIsLoadingMore(true);

    galleryApi
      .getAll({
        page: nextPage,
        limit: PAGE_SIZE,
        category: category === 'All' ? undefined : category,
      })
      .then((res) => {
        if (requestIdRef.current !== requestId) return;
        setItems((prev) => [...prev, ...res.data]);
        setPage(nextPage);
        setHasMore(!!res.hasMore);
      })
      .catch(() => {
        if (requestIdRef.current !== requestId) return;
        setHasMore(false);
      })
      .finally(() => setIsLoadingMore(false));
  }, [category, hasMore, isLoading, isLoadingMore, page]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: '400px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  const lightboxImages = useMemo(
    () =>
      items.map((item) => ({
        url: item.image.url,
        alt: item.image.alt || item.title,
        caption: `${item.title} — ${item.category}`,
      })),
    [items]
  );

  return (
    <>
      <SEO
        title="Gallery"
        description={`Browse our portfolio of weddings, corporate events, birthdays, kitty parties and Mata Ka Jagrata celebrations by ${SITE.fullName}.`}
        url="/gallery"
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Gallery', url: '/gallery' },
        ])}
      />

      {/* ---------------- HERO ---------------- */}
      <section className="relative flex h-[50svh] min-h-[380px] w-full items-end overflow-hidden bg-[var(--color-ink)]">
        <OptimizedImage
          src={IMAGES.pages.galleryHero}
          alt="Gallery"
          loading="eager"
          wrapperClassName="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)] via-[var(--color-ink)]/70 to-black/75" />
        <div className="container-custom relative z-10 pb-14 pt-32">
          <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Gallery' }]} className="mb-6" />
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl font-display text-5xl leading-[1.05] text-[var(--color-cream)] sm:text-6xl lg:text-7xl"
          >
            Moments We've Brought to Life
          </motion.h1>
        </div>
      </section>

      {/* ---------------- FILTERS ---------------- */}
      <section className="sticky top-0 z-30 border-b border-[var(--color-line)] bg-[var(--color-ink)]/90 py-6 backdrop-blur-md">
        <div className="container-custom flex flex-wrap items-center justify-center gap-3">
          {GALLERY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={cn(
                'border px-5 py-2.5 text-xs uppercase tracking-widest transition-all duration-300 sm:text-sm',
                category === cat
                  ? 'border-[var(--color-gold)] bg-[var(--color-gold)] text-[var(--color-ink)]'
                  : 'border-[var(--color-line)] text-[var(--color-muted)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ---------------- MASONRY GRID ---------------- */}
      <section className="py-16 sm:py-20">
        <div className="container-custom">
          {isLoading ? (
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="mb-4 w-full break-inside-avoid"
                  style={{ aspectRatio: ASPECT_CYCLE[i % ASPECT_CYCLE.length] }}
                />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="py-24 text-center text-[var(--color-muted)]">
              No photos found in this category yet — check back soon.
            </p>
          ) : (
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
              {items.map((item, idx) => {
                const aspect =
                  item.image.width && item.image.height
                    ? `${item.image.width} / ${item.image.height}`
                    : ASPECT_CYCLE[idx % ASPECT_CYCLE.length];
                return (
                  <motion.button
                    key={item._id}
                    type="button"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: Math.min(idx * 0.03, 0.3) }}
                    onClick={() => setLightboxIndex(idx)}
                    className="group relative mb-4 block w-full overflow-hidden break-inside-avoid"
                  >
                    <OptimizedImage
                      src={item.image.url}
                      alt={item.image.alt || item.title}
                      aspectRatio={aspect}
                      wrapperClassName="w-full"
                      className="transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/75 via-black/0 to-black/0 p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <p className="text-sm text-[var(--color-cream)]">{item.title}</p>
                      <p className="text-xs uppercase tracking-widest text-[var(--color-gold)]">
                        {item.category}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}

          <div ref={sentinelRef} className="mt-4 flex h-16 items-center justify-center">
            {isLoadingMore && <Spinner />}
            {!hasMore && items.length > 0 && (
              <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">
                You've reached the end
              </p>
            )}
          </div>
        </div>
      </section>

      <Lightbox
        images={lightboxImages}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </>
  );
}
