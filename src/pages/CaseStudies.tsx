import { useState, useMemo, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { BackgroundBlobs } from '@/components/common/BackgroundBlobs';
import { ASSETS } from '@/lib/assets';
import { CaseStudyService } from '@/services/CaseStudyService';
import { cn } from '@/lib/utils';
import type { CaseStudyCategory, CaseStudyFull } from '@/types/caseStudy';

// ── Constants ─────────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<CaseStudyCategory, string> = {
  'workplace-productivity': 'Productivity',
  'workplace-security':     'Security',
  'workplace-ai':           'AI',
  'workplace-automation':   'Automation',
  'workplace-backup':       'Backup',
  'cloud-migration':        'Cloud',
};

const ALL_CATEGORIES = Object.entries(CATEGORY_LABELS) as [CaseStudyCategory, string][];

// ── Bento placement ───────────────────────────────────────────────────────────

// Each layout guarantees a gap-free rectangle in a 3-column grid.
// gridColumn / gridRow use CSS line notation: 'start / end'.
// In a 3-col grid lines are 1-4; rows grow as needed (gridAutoRows handles height).

type GridPlacement = { gridColumn: string; gridRow: string };

const BENTO_LAYOUTS: Record<number, GridPlacement[]> = {
  1: [
    { gridColumn: '1/4', gridRow: '1/2' },
  ],
  2: [
    { gridColumn: '1/3', gridRow: '1/2' },
    { gridColumn: '3/4', gridRow: '1/2' },
  ],
  3: [
    { gridColumn: '1/3', gridRow: '1/3' },
    { gridColumn: '3/4', gridRow: '1/2' },
    { gridColumn: '3/4', gridRow: '2/3' },
  ],
  4: [
    { gridColumn: '1/3', gridRow: '1/3' },
    { gridColumn: '3/4', gridRow: '1/2' },
    { gridColumn: '3/4', gridRow: '2/3' },
    { gridColumn: '1/4', gridRow: '3/4' },
  ],
  5: [
    { gridColumn: '1/3', gridRow: '1/3' },
    { gridColumn: '3/4', gridRow: '1/2' },
    { gridColumn: '3/4', gridRow: '2/3' },
    { gridColumn: '1/2', gridRow: '3/4' },
    { gridColumn: '2/4', gridRow: '3/4' },
  ],
  6: [
    { gridColumn: '1/3', gridRow: '1/3' },
    { gridColumn: '3/4', gridRow: '1/2' },
    { gridColumn: '3/4', gridRow: '2/3' },
    { gridColumn: '1/2', gridRow: '3/4' },
    { gridColumn: '2/3', gridRow: '3/4' },
    { gridColumn: '3/4', gridRow: '3/4' },
  ],
  7: [
    { gridColumn: '1/3', gridRow: '1/3' },
    { gridColumn: '3/4', gridRow: '1/2' },
    { gridColumn: '3/4', gridRow: '2/3' },
    { gridColumn: '1/2', gridRow: '3/4' },
    { gridColumn: '2/4', gridRow: '3/4' },
    { gridColumn: '1/3', gridRow: '4/5' },
    { gridColumn: '3/4', gridRow: '4/5' },
  ],
  8: [
    { gridColumn: '1/3', gridRow: '1/3' },
    { gridColumn: '3/4', gridRow: '1/2' },
    { gridColumn: '3/4', gridRow: '2/3' },
    { gridColumn: '1/2', gridRow: '3/4' },
    { gridColumn: '2/4', gridRow: '3/4' },
    { gridColumn: '1/2', gridRow: '4/5' },
    { gridColumn: '2/3', gridRow: '4/5' },
    { gridColumn: '3/4', gridRow: '4/5' },
  ],
};

// Each full group of 8 items spans exactly 4 rows.
// When load-more appends more items, the next group of 8 starts at row 5, 9, 13, …
// Partial last groups use the matching per-count layout, offset by the group's row start.
const GROUP_SIZE = 8;
const GROUP_ROWS = 4;

function getBentoPlacement(index: number, total: number): GridPlacement {
  const groupIndex  = Math.floor(index / GROUP_SIZE);
  const posInGroup  = index % GROUP_SIZE;
  const rowOffset   = groupIndex * GROUP_ROWS;
  const itemsInGroup = Math.min(GROUP_SIZE, total - groupIndex * GROUP_SIZE);

  const layout = BENTO_LAYOUTS[itemsInGroup];
  if (!layout) return { gridColumn: 'auto', gridRow: 'auto' };

  const base = layout[posInGroup];
  if (!base) return { gridColumn: 'auto', gridRow: 'auto' };

  const [rs, re] = base.gridRow.split('/').map(Number);
  return {
    gridColumn: base.gridColumn,
    gridRow: `${rs + rowOffset}/${re + rowOffset}`,
  };
}

// ── Card ──────────────────────────────────────────────────────────────────────

function CaseStudyCard({
  cs,
  index,
  total,
}: {
  cs: CaseStudyFull;
  index: number;
  total: number;
}) {
  const isFeatured = index === 0 && total > 1;
  const placement = getBentoPlacement(index, total);

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl group cursor-pointer"
      style={placement}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: 'easeOut' }}
    >
      <Link to={`/case-studies/${cs.slug}`} className="absolute inset-0 z-20" aria-label={cs.title} />

      {/* Background image */}
      <img
        src={cs.image}
        alt={cs.client}
        loading={index < 3 ? 'eager' : 'lazy'}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />

      {/* Permanent gradient */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.65) 45%, rgba(0,0,0,0.15) 100%)',
        }}
      />
      {/* Hover: slightly lighter so image breathes */}
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-opacity duration-500" />

      {/* Top accent on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.7), rgba(255,255,255,0.2), transparent 70%)' }}
      />

      {/* Industry + category badge — top left */}
      <div className="absolute top-5 left-5 flex items-center gap-2 z-10">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50 border border-white/15 rounded-full px-2.5 py-0.5 backdrop-blur-sm bg-black/20">
          {cs.industry}
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40 border border-white/10 rounded-full px-2.5 py-0.5 backdrop-blur-sm bg-black/20">
          {CATEGORY_LABELS[cs.category]}
        </span>
      </div>

      {/* REST STATE: client + title pinned to bottom */}
      <div className="absolute inset-x-0 bottom-0 p-6 z-10 pointer-events-none group-hover:opacity-0 transition-opacity duration-300">
        <p className="text-[12px] uppercase tracking-[0.18em] font-semibold text-white/40 mb-2">{cs.client}</p>
        <h3
          className={cn(
            'font-semibold text-white leading-snug',
            isFeatured ? 'text-[24px] lg:text-[28px] max-w-lg' : 'text-[18px] line-clamp-2',
          )}
        >
          {cs.title}
        </h3>
      </div>

      {/* HOVER STATE: excerpt + CTA slides up */}
      <div className="absolute inset-x-0 bottom-0 p-6 z-10 pointer-events-none translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
        <p className="text-[12px] uppercase tracking-[0.18em] font-semibold text-white/40 mb-2">{cs.client}</p>
        <h3
          className={cn(
            'font-semibold text-white leading-snug mb-3',
            isFeatured ? 'text-[24px] lg:text-[28px] max-w-lg' : 'text-[18px] line-clamp-2',
          )}
        >
          {cs.title}
        </h3>
        <p
          className={cn(
            'text-white/65 leading-relaxed mb-4',
            isFeatured ? 'text-[15px] max-w-lg line-clamp-3' : 'text-[14px] line-clamp-2',
          )}
        >
          {cs.excerpt}
        </p>
        <span className="inline-flex items-center gap-1.5 text-[14px] font-medium text-white">
          Read the story <ChevronRight size={14} />
        </span>
      </div>
    </motion.div>
  );
}

// ── Filters ───────────────────────────────────────────────────────────────────

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'shrink-0 text-[12px] font-medium px-3 py-1 rounded-full border transition-all duration-200',
        active
          ? 'bg-white text-black border-white'
          : 'border-white/15 text-white/45 hover:border-white/35 hover:text-white/80',
      )}
    >
      {children}
    </button>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 8;

export function CaseStudies() {
  const [allStudies, setAllStudies] = useState<CaseStudyFull[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<CaseStudyCategory | null>(null);
  const [activeIndustry, setActiveIndustry] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    CaseStudyService.getAll().then(data => {
      setAllStudies(data);
      setLoading(false);
    });
  }, []);

  const industries = useMemo(
    () => Array.from(new Set(allStudies.map(cs => cs.industry))).sort(),
    [allStudies],
  );

  const filtered = useMemo(() => {
    let list = allStudies;
    if (activeCategory) list = list.filter(cs => cs.category === activeCategory);
    if (activeIndustry) list = list.filter(cs => cs.industry === activeIndustry);
    return list;
  }, [allStudies, activeCategory, activeIndustry]);

  // Reset visible count when filters change
  const handleCategoryChange = useCallback((val: CaseStudyCategory | null) => {
    setActiveCategory(val);
    setVisibleCount(PAGE_SIZE);
  }, []);
  const handleIndustryChange = useCallback((val: string | null) => {
    setActiveIndustry(val);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  if (loading) {
    return (
      <div className="min-h-screen text-white relative pt-[76px]">
        <BackgroundBlobs />
        <div className="max-w-[1240px] mx-auto px-10 py-20 grid grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-white/[0.03] animate-pulse" style={{ height: 280 }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white relative">
      <BackgroundBlobs />

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-[76px]">
        {/* Background image */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${ASSETS.scene2})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.10,
          }}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(6,6,6,0.25) 0%, rgba(6,6,6,0.88) 100%)' }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Dual ambient glows */}
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,120,212,0.14) 0%, transparent 65%)', filter: 'blur(80px)' }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,120,212,0.07) 0%, transparent 65%)', filter: 'blur(80px)' }}
        />

        <div className="relative max-w-[1240px] mx-auto px-10 py-16 pb-12">
          <div className="relative">
            {/* Ghost watermark */}
            <div
              className="absolute -top-6 left-0 font-black text-white/[0.022] leading-none select-none pointer-events-none tracking-tighter whitespace-nowrap"
              style={{ fontSize: 'clamp(80px, 14vw, 190px)' }}
              aria-hidden
            >
              CASE STUDIES
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <p className="text-[11px] uppercase tracking-[0.25em] text-white/30 font-semibold mb-5">
                Client Stories
              </p>
              <h1 className="text-[46px] lg:text-[62px] font-semibold leading-tight text-white mb-4 max-w-2xl">
                Real problems. <span className="gradient-text">Measurable</span><br />
                <span className="font-light">outcomes.</span>
              </h1>
              <p className="text-[16px] text-white/35 max-w-xl leading-relaxed">
                How NEX4 and Microsoft technology have transformed operations, reduced risk,
                and accelerated growth for enterprise clients across APAC.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Sticky filter bar ──────────────────────────────────────────────── */}
      <div className="sticky top-[76px] z-20 border-y border-white/[0.07] backdrop-blur-md">
        <div className="max-w-[1240px] mx-auto px-10 py-4">
          <div className="flex flex-wrap gap-x-5 gap-y-3 items-center">
            {/* Service category */}
            <div className="flex items-center gap-2.5">
              <span className="shrink-0 text-[11px] uppercase tracking-[0.18em] text-white/25 font-semibold">Service</span>
              <div className="flex gap-1.5 flex-wrap">
                <Pill active={!activeCategory} onClick={() => handleCategoryChange(null)}>All</Pill>
                {ALL_CATEGORIES.map(([val, label]) => (
                  <Pill
                    key={val}
                    active={activeCategory === val}
                    onClick={() => handleCategoryChange(activeCategory === val ? null : val)}
                  >
                    {label}
                  </Pill>
                ))}
              </div>
            </div>

            <div className="w-px h-5 bg-white/10 hidden sm:block" />

            {/* Industry */}
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="shrink-0 text-[11px] uppercase tracking-[0.18em] text-white/25 font-semibold">Industry</span>
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                <Pill active={!activeIndustry} onClick={() => handleIndustryChange(null)}>All</Pill>
                {industries.map(ind => (
                  <Pill
                    key={ind}
                    active={activeIndustry === ind}
                    onClick={() => handleIndustryChange(activeIndustry === ind ? null : ind)}
                  >
                    {ind}
                  </Pill>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bento grid ─────────────────────────────────────────────────────── */}
      <section className="max-w-[1240px] mx-auto px-10 py-14">
        <div className="flex items-baseline gap-4 mb-8">
          <h2 className="text-[14px] uppercase tracking-[0.2em] text-white/50 font-semibold">
            Client Stories
          </h2>
          <span className="text-[12px] font-mono text-white/20">
            {filtered.length} {filtered.length === 1 ? 'story' : 'stories'}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center border border-white/[0.06] rounded-2xl">
            <p className="text-white/20 text-[14px] mb-1">No case studies match your filters.</p>
            <button
              onClick={() => { handleCategoryChange(null); handleIndustryChange(null); }}
              className="text-[13px] text-white/35 hover:text-white/60 transition-colors underline underline-offset-2"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div
              className="grid gap-3"
              style={{
                gridTemplateColumns: 'repeat(3, 1fr)',
                gridAutoRows: '280px',
              }}
            >
              {visible.map((cs, i) => (
                <CaseStudyCard key={cs.slug} cs={cs} index={i} total={visible.length} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                  className="px-8 py-3 border border-white/[0.12] rounded-full text-[13px] uppercase tracking-[0.18em] text-white/50 hover:text-white hover:border-white/30 transition-all duration-200"
                >
                  Load more stories
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
