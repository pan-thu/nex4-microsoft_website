import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Slide {
  eyebrow: string;
  headlinePre: string;
  headlineAccent: string;
  headlinePost: string;
  cta: string;
  ctaHref: string;
  image: string;
  imageAlt: string;
}

const SLIDES: Slide[] = [
  {
    eyebrow: 'Workplace AI',
    headlinePre: 'Empower Your People with a Smarter',
    headlineAccent: 'Digital Workplace',
    headlinePost: '',
    cta: 'Explore Workplace AI',
    ctaHref: '/services/workplace-ai',
    image: '/images/hero-1.png',
    imageAlt: 'Abstract holographic visualization representing AI-powered workplace transformation',
  },
  {
    eyebrow: 'Workplace Security',
    headlinePre: 'Protect What Matters. Secure',
    headlineAccent: 'Every Endpoint.',
    headlinePost: '',
    cta: 'Explore Security',
    ctaHref: '/services/workplace-security',
    image: '/images/hero-2.png',
    imageAlt: 'Dynamic light streams representing enterprise security and data protection',
  },
  {
    eyebrow: 'Cloud Migration',
    headlinePre: 'Your Journey to Azure',
    headlineAccent: 'Starts Here',
    headlinePost: '',
    cta: 'Explore Cloud',
    ctaHref: '/services/cloud-migration',
    image: '/images/hero-3.png',
    imageAlt: 'Illuminated architecture representing a journey to cloud infrastructure',
  },
];

const INTERVAL_MS = 5000;

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.55, ease: [0.32, 0, 0.67, 0] as const },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
    transition: { duration: 0.35, ease: [0.33, 1, 0.68, 1] as const },
  }),
};

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);

  const go = useCallback((next: number, direction: number) => {
    setDir(direction);
    setIndex(next);
  }, []);

  const prev = useCallback(
    () => go((index - 1 + SLIDES.length) % SLIDES.length, -1),
    [index, go],
  );

  const next = useCallback(
    () => go((index + 1) % SLIDES.length, 1),
    [index, go],
  );

  useEffect(() => {
    const id = setInterval(() => {
      setDir(1);
      setIndex((i) => (i + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[index];
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <section className="relative bg-black overflow-hidden" style={{ minHeight: 680 }}>

      {/* Full-bleed background image */}
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={slide.image}
          alt={slide.imageAlt}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1, transition: { duration: 0.7, ease: 'easeOut' } }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Left-side gradient so text is legible over the image */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.75) 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.1) 100%)',
        }}
      />

      {/* Text content */}
      <div
        className="relative z-10 max-w-[1240px] mx-auto px-10 flex items-center"
        style={{ minHeight: 680 }}
      >
        <div className="py-24 max-w-[600px]">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={index}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {/* Eyebrow */}
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-semibold mb-6">
                {slide.eyebrow}
              </p>

              {/* Headline */}
              <h1 className="text-[52px] lg:text-[62px] font-light leading-[1.1] text-white mb-10">
                {slide.headlinePre}{' '}
                <span className="font-semibold text-white">{slide.headlineAccent}</span>
                {slide.headlinePost && ' ' + slide.headlinePost}
              </h1>

              {/* CTA — arrow inline on the same line */}
              <Link
                to={slide.ctaHref}
                className="group inline-flex items-center gap-3"
              >
                <span className="text-[14px] font-semibold text-white/70 group-hover:text-white transition-colors duration-200">
                  {slide.cta}
                </span>
                <ArrowRight
                  size={16}
                  className="text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all duration-200"
                />
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="absolute bottom-12 left-10 flex items-center gap-4">
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:border-white/60 hover:text-white transition-all duration-200"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:border-white/60 hover:text-white transition-all duration-200"
            >
              <ArrowRight size={16} />
            </button>
            <span className="text-[13px] text-white/30 font-mono tracking-widest ml-1">
              {pad(index + 1)} / {pad(SLIDES.length)}
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/5">
        <motion.div
          key={index}
          className="h-full bg-white/30"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: INTERVAL_MS / 1000, ease: 'linear' }}
        />
      </div>
    </section>
  );
}
