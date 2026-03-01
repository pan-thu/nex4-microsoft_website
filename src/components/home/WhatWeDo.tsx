import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Card {
  category: string;
  headline: string;
  body: string;
  href: string;
}

const CARDS: Card[] = [
  {
    category: 'Workplace Security',
    headline: 'We help you protect your business from every angle.',
    body: 'Zero Trust frameworks, endpoint protection, and identity management — built for the modern hybrid workforce.',
    href: '/services/workplace-security',
  },
  {
    category: 'Workplace AI',
    headline: 'We help you unlock real value with Microsoft Copilot.',
    body: 'AI and data intelligence help your business adapt, innovate, and lead. From deployment to adoption.',
    href: '/services/workplace-ai',
  },
  {
    category: 'Workplace Automation',
    headline: 'We help you automate work and free your people.',
    body: 'Intelligent Power Platform workflows connect your apps, data, and teams — eliminating repetitive manual processes.',
    href: '/services/workplace-automation',
  },
  {
    category: 'Cloud Migration',
    headline: 'We help you move to Azure with confidence.',
    body: "Whether you're lifting-and-shifting or re-architecting, we guide every stage of your cloud journey.",
    href: '/services/cloud-migration',
  },
];

function ServiceCard({ card, index }: { card: Card; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      className="group flex flex-col px-8 py-10 hover:bg-white/[0.03] transition-colors duration-300"
      style={{
        borderRight: index < CARDS.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
      }}
    >
      <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-white/30 mb-5">
        {card.category}
      </p>
      <h3 className="text-[24px] font-semibold text-white leading-snug mb-5 flex-1">
        {card.headline}
      </h3>
      <p className="text-[14px] text-white/50 leading-relaxed mb-8">
        {card.body}
      </p>
      <Link
        to={card.href}
        className="inline-flex items-center gap-3 px-5 py-2.5 border border-white/15 text-white/60 text-[13px] font-medium rounded-full hover:border-white/50 hover:text-white transition-all duration-200 self-start group/btn"
      >
        Learn more
        <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform duration-200" />
      </Link>
    </motion.div>
  );
}

export function WhatWeDo() {
  const headingRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: '-60px' });

  return (
    <section className="bg-[#0a0a0a] py-24">
      <div className="max-w-[1240px] mx-auto px-10">
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-[42px] lg:text-[52px] font-semibold text-white mb-3">
            What we do
          </h2>
          <p className="text-[15px] text-white/40">
            Our core Microsoft solutions
          </p>
        </motion.div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 2 }}
        >
          {CARDS.map((card, i) => (
            <ServiceCard key={card.category} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
