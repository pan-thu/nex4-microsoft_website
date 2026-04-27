import { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '@/lib/utils';
import { ASSETS } from '@/lib/assets';
import { BackgroundBlobs } from '@/components/common/BackgroundBlobs';
import type { ServiceData } from '@/data/services';

// ── Constants ─────────────────────────────────────────────────────────────────

const TOC_ITEMS = [
  { label: 'Overview',     id: 'overview'     },
  { label: 'Benefits',     id: 'benefits'     },
  { label: 'Capabilities', id: 'capabilities' },
  { label: 'Technologies', id: 'technologies' },
  { label: 'Outcomes',     id: 'outcomes'     },
  { label: 'Case Studies', id: 'case-studies' },
] as const;

// Cycling background images for capability panels
const CAP_IMAGES = [
  ASSETS.cardBg2, ASSETS.cardBg3, ASSETS.cardBg4,
  ASSETS.cardBg1, ASSETS.hero1,   ASSETS.hero2,
];

const SCROLL_OFFSET = 96; // 76px navbar + 20px breathing room

// ── Side Table of Contents ────────────────────────────────────────────────────

function SideTableOfContents() {
  const [active, setActive] = useState<string>('overview');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-15% 0px -75% 0px' },
    );
    [...TOC_ITEMS.map(({ id }) => id), 'get-started'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET, behavior: 'smooth' });
  };

  return (
    <aside className="hidden lg:block w-[260px] shrink-0">
      <div className="sticky top-[76px] flex flex-col pt-14 pb-10 pl-10 pr-4">
        <nav className="flex flex-col gap-0.5">
          {TOC_ITEMS.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={cn(
                'text-left px-3 py-2 text-[13px] font-medium transition-all duration-150 rounded-full',
                active === id
                  ? 'border border-white/50 text-white'
                  : 'text-white/35 hover:text-white/65 border border-transparent',
              )}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="mt-8 mb-4 h-px bg-white/[0.08]" />

        <button
          onClick={() => scrollTo('get-started')}
          className={cn(
            'text-left px-3 py-2 text-[13px] font-medium transition-all duration-150 rounded-full',
            active === 'get-started'
              ? 'border border-white/50 text-white'
              : 'text-white/35 hover:text-white/65 border border-transparent',
          )}
        >
          Get Started
        </button>
      </div>
    </aside>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function Hero({ data }: { data: ServiceData }) {
  return (
    <section className="relative bg-black overflow-hidden" style={{ minHeight: 760 }}>
      <img src={data.heroImage} alt={data.title} className="absolute inset-0 w-full h-full object-cover" />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.93) 0%, rgba(0,0,0,0.76) 42%, rgba(0,0,0,0.38) 72%, rgba(0,0,0,0.12) 100%)' }}
      />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 45%)' }} />

      <div className="absolute -top-24 -right-24 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(104,33,122,0.24) 0%, rgba(0,120,212,0.16) 50%, transparent 70%)', filter: 'blur(90px)' }} />
      <div className="absolute top-1/2 right-1/4 w-[380px] h-[380px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,188,242,0.13) 0%, transparent 65%)', filter: 'blur(65px)' }} />

      <div className="relative z-10 max-w-[1240px] mx-auto px-10 flex flex-col justify-end" style={{ minHeight: 760, paddingBottom: 88 }}>
        <nav className="flex items-center gap-2 mb-10">
          <Link to="/" className="text-[11px] text-white/30 hover:text-white/55 transition-colors">Home</Link>
          <ChevronRight size={11} className="text-white/20" />
          <span className="text-[11px] text-white/30">Services</span>
          <ChevronRight size={11} className="text-white/20" />
          <span className="text-[11px] text-white/45">{data.category}</span>
        </nav>

        <p className="text-[10px] uppercase tracking-[0.24em] font-semibold text-white/35 mb-5">{data.category}</p>
        <h1 className="text-[44px] lg:text-[58px] font-light leading-[1.08] text-white max-w-[700px] mb-7">{data.title}</h1>
        <p className="text-[16px] text-white/50 leading-relaxed max-w-[520px] mb-10">{data.tagline}</p>

        <div className="flex flex-wrap items-center gap-4">
          <Link to="/contact-us" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-[14px] font-medium rounded-full hover:bg-white/90 hover:scale-[1.04] transition-all duration-150">
            Talk to Our Team <ChevronRight size={14} />
          </Link>
          <Link to="/services" className="inline-flex items-center gap-2 text-[14px] text-white/40 hover:text-white/75 transition-colors duration-200">
            All Services <ChevronRight size={13} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Overview ──────────────────────────────────────────────────────────────────

function Overview({ data }: { data: ServiceData }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="overview" className="py-24 scroll-mt-[96px]">
      <div className="max-w-[1240px] mx-auto px-10">
        <motion.div
          ref={ref}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/28 font-semibold mb-4">Overview</p>
            <h2 className="text-[34px] lg:text-[42px] font-semibold text-white leading-tight">{data.overviewHeading}</h2>
          </div>
          <div className="lg:pt-14">
            <p className="text-[17px] text-white/58 leading-relaxed mb-6">{data.overviewParagraphs[0]}</p>
            <p className="text-[16px] text-white/38 leading-relaxed">{data.overviewParagraphs[1]}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Benefits ──────────────────────────────────────────────────────────────────

function Benefits({ data }: { data: ServiceData }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="benefits" className="py-24 border-t border-white/[0.05] scroll-mt-[96px]">
      <div className="max-w-[1240px] mx-auto px-10">
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="mb-16">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/28 font-semibold mb-3">Key Benefits</p>
          <h2 className="text-[32px] lg:text-[40px] font-semibold text-white">Why Choose <span className="gradient-text">NEX4</span></h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3">
          {data.benefits.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <motion.div key={benefit.title} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 + i * 0.12 }}
                className="px-0 md:px-10 py-10 first:md:pl-0 last:md:pr-0">
                <div className="mb-6 w-12 h-12 flex items-center justify-center">
                  <Icon size={30} className="text-white/55" />
                </div>
                <h3 className="text-[18px] font-semibold text-white mb-3 leading-snug">{benefit.title}</h3>
                <p className="text-[15px] text-white/45 leading-relaxed">{benefit.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Capabilities (tabbed panel with hover reveal) ─────────────────────────────

function Capabilities({ data }: { data: ServiceData }) {
  const [activeTab, setActiveTab] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const tabBarRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const cap = data.capabilities[activeTab];
  const bgImage = CAP_IMAGES[activeTab % CAP_IMAGES.length];

  useEffect(() => {
    const bar = tabBarRef.current;
    if (!bar) return;
    const btn = bar.children[activeTab] as HTMLElement;
    if (!btn) return;
    const barRect = bar.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const btnLeft = btnRect.left - barRect.left + bar.scrollLeft;
    const btnRight = btnLeft + btn.offsetWidth;
    if (btnRight > bar.scrollLeft + bar.clientWidth) {
      bar.scrollTo({ left: btnRight - bar.clientWidth + 24, behavior: 'smooth' });
    } else if (btnLeft < bar.scrollLeft) {
      bar.scrollTo({ left: btnLeft - 24, behavior: 'smooth' });
    }
  }, [activeTab]);

  return (
    <section id="capabilities" className="py-24 border-t border-white/[0.05] scroll-mt-[96px]">
      <div className="px-10">

        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
          className="max-w-[1240px] mx-auto mb-12">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/28 font-semibold mb-3">Capabilities</p>
          <h2 className="text-[32px] lg:text-[38px] font-semibold text-white leading-tight">{data.capabilitiesHeading}</h2>
        </motion.div>

        {/* Tab bar */}
        <div className="max-w-[1240px] mx-auto">
          <div className="flex items-end gap-2 border-b border-white/[0.08]">
            <button onClick={() => tabBarRef.current?.scrollBy({ left: -200, behavior: 'smooth' })}
              className="shrink-0 pb-3 text-white/30 hover:text-white/70 hover:scale-[1.15] transition-all duration-150">
              <ChevronLeft size={16} />
            </button>
            <div ref={tabBarRef} className="flex flex-1 overflow-x-auto [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {data.capabilities.map((c, i) => (
                <button key={c.title} onClick={() => setActiveTab(i)}
                  className={cn('shrink-0 px-5 py-3.5 text-[14px] font-medium whitespace-nowrap border-b-2 -mb-px transition-all duration-150',
                    activeTab === i ? 'text-white border-white/55' : 'text-white/30 border-transparent hover:text-white/58')}>
                  {c.title}
                </button>
              ))}
            </div>
            <button onClick={() => tabBarRef.current?.scrollBy({ left: 200, behavior: 'smooth' })}
              className="shrink-0 pb-3 text-white/30 hover:text-white/70 hover:scale-[1.15] transition-all duration-150">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Panel card with hover reveal */}
        <div className="max-w-[1240px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="relative overflow-hidden"
              style={{ minHeight: 420 }}
            >
              <img src={bgImage} alt={cap.title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0"
                style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.84) 36%, rgba(0,0,0,0.45) 62%, rgba(0,0,0,0.14) 100%)' }} />

              {/* Content — bottom left */}
              <div className="absolute inset-x-0 bottom-0 z-10 p-12 lg:p-14 max-w-[520px]">
                <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/28 mb-5">
                  {String(activeTab + 1).padStart(2, '0')} / {String(data.capabilities.length).padStart(2, '0')}
                </p>
                <h3 className="text-[26px] lg:text-[32px] font-semibold text-white leading-snug mb-6">
                  {cap.title}
                </h3>
                <p className="text-[16px] text-white/55 leading-relaxed mb-8">{cap.body}</p>
                <Link
                  to="/contact-us"
                  className="inline-flex items-center gap-2 border border-white/30 rounded-full px-6 py-2.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-white hover:text-black transition-all duration-200"
                >
                  Explore More <ChevronRight size={13} />
                </Link>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-[2px]"
                style={{ background: 'linear-gradient(90deg, rgba(0,120,212,0.9), rgba(0,188,242,0.5), transparent 60%)' }} />
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}

// ── Technologies ──────────────────────────────────────────────────────────────

function Technologies({ data }: { data: ServiceData }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="technologies" className="py-20 border-t border-white/[0.05] scroll-mt-[96px]">
      <div className="max-w-[1240px] mx-auto px-10">
        <motion.div ref={ref} initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-20">
          <div className="shrink-0">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/28 font-semibold mb-1">Technologies</p>
            <h3 className="text-[22px] font-semibold text-white">We work <span className="gradient-text">with</span></h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {data.technologies.map((tech, i) => (
              <motion.span key={tech} initial={{ opacity: 0, scale: 0.95 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.3, delay: 0.15 + i * 0.05 }}
                className="px-4 py-2 border border-white/[0.10] rounded-full text-[14px] text-white/45 hover:border-white/22 hover:text-white/75 transition-all duration-200">
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Stats ─────────────────────────────────────────────────────────────────────

function Stats({ data }: { data: ServiceData }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="outcomes" className="py-24 border-t border-white/[0.05] scroll-mt-[96px]">
      <div className="max-w-[1240px] mx-auto px-10">
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55 }}
          className="grid grid-cols-1 md:grid-cols-3">
          {data.stats.map((stat) => (
            <div key={stat.label} className="px-0 md:px-12 py-14 md:py-16 text-center first:md:pl-0 last:md:pr-0">
              <p className="leading-none text-white mb-4 tabular-nums">
                <span className="text-[68px] lg:text-[84px] font-light">{stat.value}</span>
                {stat.suffix && <span className="text-[36px] lg:text-[46px] font-light text-white/50 ml-1">{stat.suffix}</span>}
              </p>
              <p className="text-[13px] text-white/32 uppercase tracking-[0.13em] max-w-[220px] mx-auto leading-relaxed">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── Case Studies ──────────────────────────────────────────────────────────────

function CaseStudies({ data }: { data: ServiceData }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps', dragFree: true });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const update = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', update);
    emblaApi.on('reInit', update);
    update();
  }, [emblaApi, update]);

  return (
    <section id="case-studies" className="py-24 border-t border-white/[0.05] scroll-mt-[96px]">
      <div className="max-w-[1240px] mx-auto px-10">
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/28 font-semibold mb-2">Case Studies</p>
            <h2 className="text-[30px] lg:text-[36px] font-semibold text-white">Delivered <span className="gradient-text">results</span></h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => emblaApi?.scrollPrev()} disabled={!canPrev} aria-label="Previous"
              className={cn('w-10 h-10 flex items-center justify-center border transition-all duration-200',
                canPrev ? 'border-white/20 text-white/55 hover:border-white/45 hover:text-white hover:scale-[1.1]' : 'border-white/[0.07] text-white/18 cursor-not-allowed')}>
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => emblaApi?.scrollNext()} disabled={!canNext} aria-label="Next"
              className={cn('w-10 h-10 flex items-center justify-center border transition-all duration-200',
                canNext ? 'border-white/20 text-white/55 hover:border-white/45 hover:text-white hover:scale-[1.1]' : 'border-white/[0.07] text-white/18 cursor-not-allowed')}>
              <ChevronRight size={16} />
            </button>
          </div>
        </motion.div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {data.caseStudies.map((cs) => (
              <div key={cs.client + cs.title} className="group flex-[0_0_calc(33.333%-11px)] min-w-0 relative overflow-hidden cursor-pointer" style={{ minHeight: 460 }}>
                {/* Image */}
                <img src={cs.image} alt={cs.client} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out scale-100 group-hover:scale-[1.04]" />

                {/* Permanent gradient */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.72) 45%, rgba(0,0,0,0.2) 100%)' }} />
                {/* Extra dark layer that lifts on hover */}
                <div className="absolute inset-0 bg-black/35 opacity-100 group-hover:opacity-0 transition-opacity duration-500" />

                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.6), transparent)' }} />

                {/* REST STATE: industry + client + title pinned to bottom */}
                <div className="absolute inset-x-0 bottom-0 p-6 z-10 transition-opacity duration-300 group-hover:opacity-0">
                  <p className="text-[9px] uppercase tracking-[0.18em] font-semibold text-white/40 mb-2">{cs.industry} — {cs.client}</p>
                  <h3 className="text-[18px] font-semibold text-white leading-snug line-clamp-2">{cs.title}</h3>
                </div>

                {/* HOVER STATE: full panel slides up from below */}
                <div className="absolute inset-x-0 bottom-0 p-6 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <p className="text-[9px] uppercase tracking-[0.18em] font-semibold text-white/40 mb-2">{cs.industry} — {cs.client}</p>
                  <h3 className="text-[18px] font-semibold text-white leading-snug mb-3">{cs.title}</h3>
                  <p className="text-[13px] text-white/70 leading-relaxed mb-5 line-clamp-3">{cs.description}</p>
                  <span className="inline-flex items-center gap-2 text-[13px] font-medium text-white">Read the story <ChevronRight size={14} /></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── CTA ───────────────────────────────────────────────────────────────────────

function CTA({ data }: { data: ServiceData }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="get-started" className="py-28 border-t border-white/[0.05] scroll-mt-[96px]">
      <div className="max-w-[1240px] mx-auto px-10 text-center">
        <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55 }}>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-semibold mb-6">Get Started</p>
          <h2 className="text-[38px] lg:text-[50px] font-light text-white mb-6 leading-tight max-w-[680px] mx-auto">{data.ctaHeadline}</h2>
          <p className="text-[16px] text-white/45 mb-10 max-w-[480px] mx-auto leading-relaxed">{data.ctaBody}</p>
          <Link to="/contact-us" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black text-[15px] font-medium rounded-full hover:bg-white/90 hover:scale-[1.04] transition-all duration-150">
            Talk to Our Team <ChevronRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ── Page assembly ─────────────────────────────────────────────────────────────

export function ServicePage({ data }: { data: ServiceData }) {
  return (
    <div className="pt-[76px] bg-[#060606] relative">
      <BackgroundBlobs />

      <div className="relative" style={{ zIndex: 1 }}>
      <Hero data={data} />

      {/* Two-column layout: TOC + content, centered */}
      <div className="max-w-[1400px] mx-auto flex">
        <SideTableOfContents />

        <main className="flex-1 min-w-0">
          <Overview data={data} />
          <Benefits data={data} />
          <Capabilities data={data} />
          <Technologies data={data} />
          <Stats data={data} />
          <CaseStudies data={data} />
          <CTA data={data} />
        </main>
      </div>
      </div>
    </div>
  );
}
