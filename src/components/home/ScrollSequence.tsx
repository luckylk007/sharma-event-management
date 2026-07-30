import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';

/** Frame filenames in /images/sequence (ezgif-frame-005 … 118, skip 026). */
function buildFrameSrcs() {
  const srcs: string[] = [];
  for (let i = 5; i <= 118; i++) {
    if (i === 26) continue;
    srcs.push(`/images/sequence/ezgif-frame-${String(i).padStart(3, '0')}.jpg`);
  }
  return srcs;
}

const FRAME_SRCS = buildFrameSrcs();
const FRAME_COUNT = FRAME_SRCS.length;

const CAPTIONS = [
  {
    range: [0, 0.28] as const,
    eyebrow: 'Mata Ka Jagrata',
    title: 'A Night of Devotion',
    text: 'Sacred celebrations lit by diyas, bhajans and community prayer across Haldwani and Kumaon.',
  },
  {
    range: [0.28, 0.55] as const,
    eyebrow: 'Altar & Décor',
    title: 'Beautifully Prepared',
    text: 'Floral deity setups and traditional décor crafted with care for every family ritual.',
  },
  {
    range: [0.55, 0.78] as const,
    eyebrow: 'Light & Warmth',
    title: 'Diya-Lit Evenings',
    text: 'Warm brass lamps and soft glow that set a reverent mood through the night.',
  },
  {
    range: [0.78, 1] as const,
    eyebrow: 'Full Experience',
    title: 'From Setup to Aarti',
    text: 'Sound, seating, catering and on-ground coordination — so you stay present in prayer.',
  },
] as const;

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number
) {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  if (!iw || !ih || !width || !height) return;

  const scale = Math.max(width / iw, height / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = (width - dw) / 2;
  const dy = (height - dh) / 2;
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(img, dx, dy, dw, dh);
}

function captionIndexForProgress(v: number) {
  for (let i = 0; i < CAPTIONS.length; i++) {
    const [start, end] = CAPTIONS[i].range;
    if (v >= start && (v < end || i === CAPTIONS.length - 1)) return i;
  }
  return 0;
}

/** Sticky 100vh canvas sequence scrubbed by scroll. */
export function ScrollSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const frameIndexRef = useRef(0);
  const [ready, setReady] = useState(false);
  const [activeCaption, setActiveCaption] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const paint = (index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img?.complete) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawCover(ctx, img, canvas.width, canvas.height);
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    paint(frameIndexRef.current);
  };

  useEffect(() => {
    let cancelled = false;
    const images: (HTMLImageElement | null)[] = new Array(FRAME_COUNT).fill(null);

    FRAME_SRCS.forEach((src, i) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
      img.onload = () => {
        if (cancelled) return;
        images[i] = img;
        if (i === 0) {
          imagesRef.current = images;
          setReady(true);
        }
        if (i === frameIndexRef.current) {
          paint(i);
        }
      };
    });

    imagesRef.current = images;
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [ready]);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const max = FRAME_COUNT - 1;
    const index = Math.min(max, Math.max(0, Math.round(v * max)));
    if (index !== frameIndexRef.current) {
      frameIndexRef.current = index;
      paint(index);
    }
    setActiveCaption(captionIndexForProgress(v));
  });

  const caption = CAPTIONS[activeCaption];

  return (
    <section
      ref={containerRef}
      className="relative bg-[var(--color-ink)]"
      style={{ height: '400vh' }}
      aria-label="Scroll image sequence"
    >
      <div className="sticky top-0 h-[100vh] min-h-[560px] overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />

        {!ready && <div className="absolute inset-0 bg-[var(--color-graphite)]" />}

        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)] via-[var(--color-ink)]/50 to-black/45" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-ink)]/70 via-transparent to-transparent" />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 pb-16 pt-32 sm:pb-20">
          <div className="container-custom max-w-2xl">
            <motion.div
              key={caption.title}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="eyebrow mb-4">{caption.eyebrow}</p>
              <h2 className="font-display text-4xl leading-[1.1] text-[var(--color-cream)] sm:text-5xl lg:text-6xl">
                {caption.title}
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">
                {caption.text}
              </p>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 h-px bg-[var(--color-line)]">
          <motion.div
            className="h-full origin-left bg-[var(--color-gold)]"
            style={{ width: progressWidth }}
          />
        </div>
      </div>
    </section>
  );
}
