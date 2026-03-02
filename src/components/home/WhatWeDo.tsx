import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Card {
  num: string;
  category: string;
  body: string;
  href: string;
  image: string;
}

const CARDS: Card[] = [
  {
    num: '01',
    category: 'Workplace Security',
    body: 'Zero Trust frameworks, endpoint protection, and identity management — built for the modern hybrid workforce.',
    href: '/services/workplace-security',
    image: '/images/card-bg-2.png',
  },
  {
    num: '02',
    category: 'Workplace AI',
    body: 'AI and data intelligence help your business adapt, innovate, and lead. From deployment to adoption.',
    href: '/services/workplace-ai',
    image: '/images/card-bg-4.png',
  },
  {
    num: '03',
    category: 'Workplace Automation',
    body: 'Intelligent Power Platform workflows connect your apps, data, and teams — eliminating repetitive manual processes.',
    href: '/services/workplace-automation',
    image: '/images/card-bg-1.png',
  },
  {
    num: '04',
    category: 'Cloud Migration',
    body: "Whether you're lifting-and-shifting or re-architecting, we guide every stage of your cloud journey.",
    href: '/services/cloud-migration',
    image: '/images/card-bg-3.png',
  },
];

function ServiceCard({ card, index }: { card: Card; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      className="group relative overflow-hidden min-h-[420px] cursor-pointer"
    >
      {/* Background image */}
      <img
        src={card.image}
        alt={card.category}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out scale-100 group-hover:scale-[1.04]"
        loading="lazy"
      />

      {/* Permanent dark gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.15) 100%)',
        }}
      />
      {/* Extra dark layer that lifts on hover */}
      <div className="absolute inset-0 bg-black/30 opacity-100 group-hover:opacity-0 transition-opacity duration-500" />

      {/* Top accent line — appears on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.6), transparent)' }}
      />

      {/* Content — pinned to bottom */}
      <div className="absolute inset-0 flex flex-col justify-end p-8">
        {/* Eyebrow — always visible */}
        <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-white/50 mb-2">
          {card.num} — {card.category}
        </p>

        {/* Title — always visible */}
        <h3 className="text-[32px] font-semibold text-white leading-tight mb-4">
          {card.category}
        </h3>

        {/* Description — hidden at rest, slides up on hover/focus-within */}
        <p className="text-[14px] text-white/70 leading-relaxed mb-5 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-500">
          {card.body}
        </p>

        {/* CTA — hidden at rest, slides up on hover/focus-within with slight extra delay */}
        <Link
          to={card.href}
          className="inline-flex items-center gap-2 text-[13px] font-medium text-white opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-500 self-start focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 rounded-sm"
          style={{ transitionDelay: '60ms' }}
        >
          Learn more
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />
        </Link>
      </div>
    </motion.div>
  );
}

export function WhatWeDo() {
  const headingRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: '-60px' });

  return (
    <section className="relative bg-[#0a0a0a] py-24 overflow-hidden">
      {/* Dot grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      {/* Radial fade at edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 40%, #0a0a0a 100%)',
        }}
      />

      <div className="relative max-w-[1240px] mx-auto px-10">
        {/* Two-column header */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12"
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-semibold mb-3">
              What we do
            </p>
            <h2 className="text-[42px] lg:text-[52px] font-semibold text-white leading-tight">
              Our core Microsoft<br />solutions
            </h2>
          </div>
          <p className="text-[14px] text-white/35 max-w-[260px] lg:text-right leading-relaxed">
            Four practice areas. One trusted Microsoft partner across APAC.
          </p>
        </motion.div>

        {/* 2×2 card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CARDS.map((card, i) => (
            <ServiceCard key={card.category} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
