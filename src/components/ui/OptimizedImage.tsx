import { useState } from 'react';
import type { ImgHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  wrapperClassName?: string;
  aspectRatio?: string;
}

export function OptimizedImage({
  src,
  alt,
  className,
  wrapperClassName,
  aspectRatio,
  loading = 'lazy',
  decoding = 'async',
  ...props
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <div
      className={cn('relative overflow-hidden bg-[var(--color-graphite)]', wrapperClassName)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {!loaded && !errored && <div className="skeleton-shimmer absolute inset-0" />}
      {!errored ? (
        <img
          src={src}
          alt={alt}
          loading={loading}
          decoding={decoding}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={cn(
            'h-full w-full object-cover transition-opacity duration-700',
            loaded ? 'opacity-100' : 'opacity-0',
            className
          )}
          {...props}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-widest text-[var(--color-muted)]">
          Image unavailable
        </div>
      )}
    </div>
  );
}
