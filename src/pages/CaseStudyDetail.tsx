import { useRef, useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { BackgroundBlobs } from '@/components/common/BackgroundBlobs';
import { CASE_STUDIES_BY_SLUG } from '@/data/caseStudies';
import { cn } from '@/lib/utils';

// ── Constants ─────────────────────────────────────────────────────────────────

const TOC_ITEMS = [
  { label: 'Overview',    id: 'overview'    },
  { label: 'Challenge',   id: 'challenge'   },
  { label: 'Approach',    id: 'approach'    },
  { label: 'Technologies',id: 'technologies'},
  { label: 'Results',     id: 'results'     },
] as const;

const SCROLL_OFFSET = 96;

// ── TOC Sidebar ───────────────────────────────────────────────────────────────

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
    TOC_ITEMS.forEach(({ id }) => {
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
        <p className="text-[9px] uppercase tracking-[0.2em] text-white/20 font-semibold mb-4 px-3">
          On this page
        </p>
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

        <Link
          to="/case-studies"
          className="flex items-center gap-2 px-3 py-2 text-[12px] text-white/30 hover:text-white/60 transition-colors"
        >
          <ArrowLeft size={12} />
          All case studies
        </Link>
      </div>
    </aside>
  );
}

// ── Section wrapper with fade-in ──────────────────────────────────────────────

function Section({ id, children }: { id: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });

  return (
    <motion.section
      id={id}
      ref={ref as React.RefObject<HTMLElement & HTMLDivElement>}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="py-14 border-b border-white/[0.05]"
    >
      {children}
    </motion.section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] uppercase tracking-[0.25em] text-white/25 font-semibold mb-6">
      {children}
    </p>
  );
}

// ── Result stat card ──────────────────────────────────────────────────────────

function ResultCard({ value, suffix, label, index }: { value: string; suffix?: string; label: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.08, ease: 'easeOut' }}
      className="border border-white/[0.07] rounded-2xl p-6 flex flex-col gap-2 hover:border-white/20 transition-colors duration-300"
    >
      <div className="flex items-baseline gap-1">
        <span className="text-[42px] font-black leading-none gradient-text">{value}</span>
        {suffix && <span className="text-[18px] font-semibold text-white/50">{suffix}</span>}
      </div>
      <p className="text-[13px] text-white/45 leading-snug">{label}</p>
    </motion.div>
  );
}

// ── Approach step ─────────────────────────────────────────────────────────────

function ApproachStep({ title, body, index }: { title: string; body: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -16 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.07, ease: 'easeOut' }}
      className="flex gap-5"
    >
      <div className="shrink-0 mt-1 flex flex-col items-center">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white border border-white/20"
          style={{ background: 'rgba(0,120,212,0.18)' }}
        >
          {index + 1}
        </div>
        <div className="w-px flex-1 mt-2 bg-white/[0.06]" />
      </div>
      <div className="pb-8">
        <h4 className="text-[15px] font-semibold text-white mb-2">{title}</h4>
        <p className="text-[14px] text-white/50 leading-relaxed">{body}</p>
      </div>
    </motion.div>
  );
}

// ── Pill ──────────────────────────────────────────────────────────────────────

function TechPill({ label }: { label: string }) {
  return (
    <span className="text-[11px] font-medium px-3 py-1.5 border border-white/[0.12] text-white/50 hover:border-white/25 hover:text-white/75 transition-colors duration-200 rounded-full">
      {label}
    </span>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function CaseStudyDetail() {
  const { slug } = useParams<{ slug: string }>();
  const cs = slug ? CASE_STUDIES_BY_SLUG[slug] : undefined;

  if (!cs) {
    return (
      <div className="min-h-screen bg-[#060606] text-white pt-[76px] flex flex-col items-center justify-center gap-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">404</p>
        <h2 className="text-2xl font-semibold text-white">Case study not found.</h2>
        <Link
          to="/case-studies"
          className="flex items-center gap-2 text-[13px] text-white/35 hover:text-white transition-colors mt-2"
        >
          <ArrowLeft size={14} /> Back to Case Studies
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white relative">
      <BackgroundBlobs />

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative bg-black overflow-hidden" style={{ minHeight: 600 }}>
        <img
          src={cs.image}
          alt={cs.client}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient overlays */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.78) 45%, rgba(0,0,0,0.42) 75%, rgba(0,0,0,0.15) 100%)' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.60) 0%, transparent 50%)' }}
        />

        {/* Ambient glow */}
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,120,212,0.18) 0%, transparent 65%)', filter: 'blur(80px)' }}
        />

        <div
          className="relative z-10 max-w-[1240px] mx-auto px-10 flex flex-col justify-end"
          style={{ minHeight: 600, paddingBottom: 72 }}
        >
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-10 pt-[76px]">
            <Link to="/" className="text-[11px] text-white/30 hover:text-white/55 transition-colors">Home</Link>
            <ChevronRight size={11} className="text-white/20" />
            <Link to="/case-studies" className="text-[11px] text-white/30 hover:text-white/55 transition-colors">Case Studies</Link>
            <ChevronRight size={11} className="text-white/20" />
            <span className="text-[11px] text-white/45">{cs.client}</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Badges */}
            <div className="flex gap-2 mb-5">
              <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40 border border-white/15 rounded-full px-2.5 py-0.5 backdrop-blur-sm bg-black/20">
                {cs.industry}
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40 border border-white/10 rounded-full px-2.5 py-0.5 backdrop-blur-sm bg-black/20">
                {cs.relatedService.title}
              </span>
            </div>

            <h1 className="text-[36px] lg:text-[52px] font-semibold text-white leading-tight max-w-3xl mb-5">
              {cs.title}
            </h1>
            <p className="text-[16px] text-white/40 max-w-xl leading-relaxed">
              {cs.excerpt}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Two-column layout ──────────────────────────────────────────────── */}
      <div className="max-w-[1240px] mx-auto flex">

        {/* TOC sidebar */}
        <SideTableOfContents />

        {/* Main content */}
        <div className="flex-1 min-w-0 px-10 lg:pl-14 lg:pr-10">

          {/* ── Overview ─────────────────────────────────────────────────── */}
          <Section id="overview">
            <SectionLabel>Overview</SectionLabel>
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <div className="border border-white/[0.07] rounded-xl p-4">
                <p className="text-[9px] uppercase tracking-[0.18em] text-white/25 font-semibold mb-1.5">Client</p>
                <p className="text-[14px] font-semibold text-white">{cs.client}</p>
              </div>
              <div className="border border-white/[0.07] rounded-xl p-4">
                <p className="text-[9px] uppercase tracking-[0.18em] text-white/25 font-semibold mb-1.5">Industry</p>
                <p className="text-[14px] font-semibold text-white">{cs.industry}</p>
              </div>
              <div className="border border-white/[0.07] rounded-xl p-4">
                <p className="text-[9px] uppercase tracking-[0.18em] text-white/25 font-semibold mb-1.5">Service</p>
                <p className="text-[14px] font-semibold text-white">{cs.relatedService.title}</p>
              </div>
            </div>
            <p className="text-[15px] text-white/55 leading-[1.85]">{cs.excerpt}</p>
          </Section>

          {/* ── Challenge ────────────────────────────────────────────────── */}
          <Section id="challenge">
            <SectionLabel>The Challenge</SectionLabel>
            <h2 className="text-[24px] lg:text-[30px] font-semibold text-white leading-tight mb-6 max-w-2xl">
              What stood in the way
            </h2>
            <p className="text-[15px] text-white/55 leading-[1.85]">{cs.challenge}</p>
          </Section>

          {/* ── Approach ─────────────────────────────────────────────────── */}
          <Section id="approach">
            <SectionLabel>Our Approach</SectionLabel>
            <p className="text-[15px] text-white/55 leading-[1.85] mb-10">{cs.approachIntro}</p>
            <div>
              {cs.approach.map((step, i) => (
                <ApproachStep key={i} title={step.title} body={step.body} index={i} />
              ))}
            </div>
          </Section>

          {/* ── Technologies ─────────────────────────────────────────────── */}
          <Section id="technologies">
            <SectionLabel>Technologies</SectionLabel>
            <h2 className="text-[20px] font-semibold text-white mb-6">
              Microsoft stack deployed
            </h2>
            <div className="flex flex-wrap gap-2">
              {cs.technologies.map((tech) => (
                <TechPill key={tech} label={tech} />
              ))}
            </div>

            {/* Microsoft partner note */}
            <div
              className="mt-8 border border-white/[0.06] rounded-xl p-5 flex gap-4 items-center"
              style={{ backgroundImage: 'radial-gradient(rgba(0,120,212,0.07) 0%, transparent 70%)' }}
            >
              <div className="shrink-0">
                <div className="w-6 h-6 grid grid-cols-2 gap-px opacity-70">
                  <div className="bg-[#f25022]" /><div className="bg-[#7fba00]" />
                  <div className="bg-[#00a4ef]" /><div className="bg-[#ffb900]" />
                </div>
              </div>
              <p className="text-[11px] text-white/45 leading-relaxed">
                All solutions are delivered through NEX4's{' '}
                <span className="gradient-text font-medium">Microsoft partner</span>{' '}
                programme, ensuring certified implementation and ongoing support.
              </p>
            </div>
          </Section>

          {/* ── Results ──────────────────────────────────────────────────── */}
          <Section id="results">
            <SectionLabel>Results</SectionLabel>
            <p className="text-[15px] text-white/55 leading-[1.85] mb-8">{cs.resultsIntro}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {cs.results.map((r, i) => (
                <ResultCard key={i} {...r} index={i} />
              ))}
            </div>
          </Section>

        </div>
      </div>
    </div>
  );
}
