import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import type { ServiceData } from '@/data/services';

// ── Hero ──────────────────────────────────────────────────────────────────────

function Hero({ data }: { data: ServiceData }) {
  return (
    <section
      className="relative bg-black overflow-hidden"
      style={{ minHeight: 760 }}
    >
      {/* Hero image */}
      <img
        src={data.heroImage}
        alt={data.title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark overlay — strong left, fades right */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.93) 0%, rgba(0,0,0,0.76) 42%, rgba(0,0,0,0.38) 72%, rgba(0,0,0,0.12) 100%)' }}
      />
      {/* Bottom-up darkening for readability */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 45%)' }}
      />

      {/* Purple orb — top right */}
      <div
        className="absolute -top-24 -right-24 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(104,33,122,0.24) 0%, rgba(0,120,212,0.16) 50%, transparent 70%)', filter: 'blur(90px)' }}
      />
      {/* Cyan orb — mid right */}
      <div
        className="absolute top-1/2 right-1/4 w-[380px] h-[380px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,188,242,0.13) 0%, transparent 65%)', filter: 'blur(65px)' }}
      />

      {/* Content anchored to bottom-left */}
      <div
        className="relative z-10 max-w-[1240px] mx-auto px-10 flex flex-col justify-end"
        style={{ minHeight: 760, paddingBottom: 88 }}
      >
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-10">
          <Link to="/" className="text-[11px] text-white/30 hover:text-white/55 transition-colors">Home</Link>
          <ChevronRight size={11} className="text-white/18" />
          <span className="text-[11px] text-white/30">Services</span>
          <ChevronRight size={11} className="text-white/18" />
          <span className="text-[11px] text-white/45">{data.category}</span>
        </nav>

        {/* Eyebrow */}
        <p className="text-[10px] uppercase tracking-[0.24em] font-semibold text-white/35 mb-5">
          {data.category}
        </p>

        {/* Headline — light weight with one semibold break */}
        <h1 className="text-[44px] lg:text-[58px] font-light leading-[1.08] text-white max-w-[700px] mb-7">
          {data.title}
        </h1>

        {/* Tagline */}
        <p className="text-[16px] text-white/52 leading-relaxed max-w-[520px] mb-10">
          {data.tagline}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-4">
          <Link
            to="/contact-us"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-[14px] font-medium hover:bg-white/90 transition-colors duration-150"
          >
            Talk to Our Team
            <ArrowRight size={14} />
          </Link>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-[14px] text-white/45 hover:text-white/80 transition-colors duration-200"
          >
            All Services
            <ArrowRight size={13} />
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
    <section className="relative bg-[#080808] py-24 overflow-hidden">
      {/* Blue→cyan top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(0,120,212,0.45) 35%, rgba(0,188,242,0.30) 65%, transparent 100%)' }}
      />
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 40%, #080808 100%)' }}
      />

      <div className="relative max-w-[1240px] mx-auto px-10">
        <motion.div
          ref={ref}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
        >
          {/* Left: heading */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/28 font-semibold mb-4">Overview</p>
            <h2 className="text-[34px] lg:text-[42px] font-semibold text-white leading-tight">
              {data.overviewHeading}
            </h2>
            <div className="mt-8 h-px bg-white/[0.08]" />
          </div>

          {/* Right: paragraphs */}
          <div className="lg:pt-14">
            <p className="text-[16px] text-white/58 leading-relaxed mb-6">{data.overviewParagraphs[0]}</p>
            <p className="text-[15px] text-white/38 leading-relaxed">{data.overviewParagraphs[1]}</p>
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
    <section className="relative bg-[#050505] py-24 overflow-hidden border-t border-white/[0.05]">
      {/* Purple + blue blob — top left */}
      <div
        className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(104,33,122,0.18) 0%, rgba(0,120,212,0.10) 55%, transparent 70%)', filter: 'blur(80px)' }}
      />
      {/* Blue orb — mid right */}
      <div
        className="absolute top-1/2 -right-24 w-[440px] h-[440px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,120,212,0.20) 0%, transparent 65%)', filter: 'blur(70px)' }}
      />

      <div className="relative max-w-[1240px] mx-auto px-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/28 font-semibold mb-3">Key Benefits</p>
          <h2 className="text-[32px] lg:text-[40px] font-semibold text-white">Why Choose NEX4</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
          {data.benefits.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.12 }}
                className="px-0 md:px-10 py-10 first:md:pl-0 last:md:pr-0"
              >
                <div className="mb-6 w-12 h-12 flex items-center justify-center border border-white/[0.08]">
                  <Icon size={22} className="text-white/55" />
                </div>
                <h3 className="text-[17px] font-semibold text-white mb-3 leading-snug">{benefit.title}</h3>
                <p className="text-[14px] text-white/45 leading-relaxed">{benefit.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Capabilities ──────────────────────────────────────────────────────────────

function Capabilities({ data }: { data: ServiceData }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className="relative bg-[#0a0a0a] py-24 overflow-hidden">
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 40%, #0a0a0a 100%)' }}
      />

      <div className="relative max-w-[1240px] mx-auto px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-16 lg:gap-28">

          {/* Sticky heading column */}
          <div className="lg:sticky lg:top-28 self-start">
            <motion.div
              ref={ref}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/28 font-semibold mb-3">Capabilities</p>
              <h2 className="text-[32px] lg:text-[38px] font-semibold text-white leading-tight">
                {data.capabilitiesHeading}
              </h2>
              <p className="text-[14px] text-white/32 mt-5 leading-relaxed">
                Structured delivery across every stage — from assessment through to optimisation.
              </p>
            </motion.div>
          </div>

          {/* Numbered list */}
          <div className="divide-y divide-white/[0.06]">
            {data.capabilities.map((cap, i) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, x: 16 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.1 + i * 0.08, ease: 'easeOut' }}
                className="py-8 flex gap-8 items-start"
              >
                <span className="text-[11px] font-mono text-white/18 tracking-widest w-8 shrink-0 pt-1">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-[17px] font-semibold text-white mb-2 leading-snug">{cap.title}</h3>
                  <p className="text-[14px] text-white/45 leading-relaxed">{cap.body}</p>
                </div>
              </motion.div>
            ))}
          </div>

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
    <section className="relative bg-[#050505] py-20 border-t border-white/[0.05]">
      <div className="max-w-[1240px] mx-auto px-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-20"
        >
          <div className="shrink-0">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/28 font-semibold mb-1">Technologies</p>
            <h3 className="text-[22px] font-semibold text-white">We work with</h3>
          </div>

          <div className="flex flex-wrap gap-3">
            {data.technologies.map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.15 + i * 0.05 }}
                className="px-4 py-2 border border-white/[0.10] text-[13px] text-white/45 hover:border-white/22 hover:text-white/75 transition-all duration-200"
              >
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
    <section className="relative bg-black py-24 overflow-hidden border-t border-white/[0.05]">
      {/* Centered blue+purple gradient blob */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,120,212,0.13) 0%, rgba(104,33,122,0.09) 45%, transparent 70%)', filter: 'blur(60px)' }}
      />

      <div className="relative max-w-[1240px] mx-auto px-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]"
        >
          {data.stats.map((stat) => (
            <div
              key={stat.label}
              className="px-0 md:px-12 py-14 md:py-16 text-center first:md:pl-0 last:md:pr-0"
            >
              <p className="leading-none text-white mb-4 tabular-nums">
                <span className="text-[68px] lg:text-[84px] font-light">{stat.value}</span>
                {stat.suffix && (
                  <span className="text-[36px] lg:text-[46px] font-light text-white/50 ml-1">{stat.suffix}</span>
                )}
              </p>
              <p className="text-[12px] text-white/32 uppercase tracking-[0.13em] max-w-[220px] mx-auto leading-relaxed">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── Related Services ──────────────────────────────────────────────────────────

function Related({ data }: { data: ServiceData }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className="relative bg-[#080808] py-24 border-t border-white/[0.05]">
      <div className="max-w-[1240px] mx-auto px-10">

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6"
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/28 font-semibold mb-2">Related Services</p>
            <h2 className="text-[30px] lg:text-[36px] font-semibold text-white">You might also need</h2>
          </div>
          <Link
            to="/"
            className="text-[13px] text-white/35 hover:text-white/70 transition-colors duration-200 inline-flex items-center gap-1.5 shrink-0"
          >
            View all services <ArrowRight size={13} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.related.map((rel, i) => (
            <motion.div
              key={rel.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.1 + i * 0.10 }}
              className="group relative overflow-hidden cursor-pointer"
              style={{ minHeight: 300 }}
            >
              <Link to={`/services/${rel.slug}`} className="block h-full">
                <img
                  src={rel.image}
                  alt={rel.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                />
                {/* Base gradient */}
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.65) 45%, rgba(0,0,0,0.22) 100%)' }}
                />
                {/* Extra dark lifted on hover */}
                <div className="absolute inset-0 bg-black/32 opacity-100 group-hover:opacity-0 transition-opacity duration-500" />
                {/* Blue accent line appears on hover */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'linear-gradient(90deg, rgba(0,120,212,0.9), rgba(0,188,242,0.5), transparent)' }}
                />

                {/* Rest state */}
                <div className="absolute inset-x-0 bottom-0 p-6 group-hover:opacity-0 transition-opacity duration-300">
                  <h3 className="text-[19px] font-semibold text-white">{rel.title}</h3>
                </div>

                {/* Hover state */}
                <div className="absolute inset-x-0 bottom-0 p-6 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 ease-out">
                  <h3 className="text-[19px] font-semibold text-white mb-2">{rel.title}</h3>
                  <p className="text-[13px] text-white/55 leading-relaxed mb-4">{rel.tagline}</p>
                  <span className="inline-flex items-center gap-1.5 text-[12px] text-white/60">
                    Learn more <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
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
    <section className="relative bg-black py-28 overflow-hidden">
      {/* Large centered gradient blob — strongest colour moment on the page */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 75% 90% at 50% 50%, rgba(0,120,212,0.22) 0%, rgba(104,33,122,0.16) 48%, transparent 72%)', filter: 'blur(80px)' }}
      />

      <div className="relative z-10 max-w-[1240px] mx-auto px-10 text-center">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-semibold mb-6">Get Started</p>
          <h2 className="text-[38px] lg:text-[50px] font-light text-white mb-6 leading-tight max-w-[680px] mx-auto">
            {data.ctaHeadline}
          </h2>
          <p className="text-[16px] text-white/45 mb-10 max-w-[480px] mx-auto leading-relaxed">
            {data.ctaBody}
          </p>
          <Link
            to="/contact-us"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black text-[15px] font-medium hover:bg-white/90 transition-colors duration-150"
          >
            Talk to Our Team
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ── Page assembly ─────────────────────────────────────────────────────────────

export function ServicePage({ data }: { data: ServiceData }) {
  return (
    <div className="pt-[76px]">
      <Hero data={data} />
      <Overview data={data} />
      <Benefits data={data} />
      <Capabilities data={data} />
      <Technologies data={data} />
      <Stats data={data} />
      <Related data={data} />
      <CTA data={data} />
    </div>
  );
}
