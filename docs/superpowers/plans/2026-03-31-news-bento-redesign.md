# News Landing Page Bento Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite `src/pages/News.tsx` so its card and grid design matches `src/pages/CaseStudies.tsx` — full-bleed image bento cards with hover-reveal content, 3-column mosaic grid, and matching sticky filter bar.

**Architecture:** Single-file rewrite of `News.tsx`. The bento layout utilities (`BENTO_LAYOUTS`, `getBentoPlacement`) are copied verbatim from `CaseStudies.tsx`. All data-fetching and filter logic is preserved unchanged. No new files are created; `NewsCard.tsx` and `NewsFilters.tsx` are left untouched (just no longer imported by `News.tsx`).

**Tech Stack:** React 19, TypeScript, Framer Motion, Tailwind CSS 4, Lucide React, React Router 7

---

## File Map

| File | Change |
|------|--------|
| `src/pages/News.tsx` | Full rewrite — inline bento card, bento grid, inline Pill + filter bar |
| `src/components/news/NewsCard.tsx` | No change |
| `src/components/news/NewsFilters.tsx` | No change |

---

## Task 1: Rewrite `src/pages/News.tsx`

**Files:**
- Modify: `src/pages/News.tsx`

This is a single coherent visual rewrite. All steps produce the final file — follow them in order.

- [ ] **Step 1: Replace the file content with the full rewrite below**

Open `src/pages/News.tsx` and replace its entire contents with:

```tsx
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { NewsService } from '@/services/BlogService';
import { ASSETS } from '@/lib/assets';
import { BackgroundBlobs } from '@/components/common/BackgroundBlobs';
import { NEWS_CATEGORIES, CONTENT_DATE_FILTERS, NEWS_CATEGORY_LABEL } from '@/lib/blogConstants';
import { cn } from '@/lib/utils';
import type { NewsArticle, NewsUIFilters, ContentDateFilter } from '@/types/blog';

const EMPTY_FILTERS: NewsUIFilters = { date: 'all' };
const PAGE_SIZE = 8;

// ── Bento layout utilities ─────────────────────────────────────────────────────

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

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).toUpperCase();
}

function applyDateFilter(articles: NewsArticle[], date: ContentDateFilter): NewsArticle[] {
  if (date === 'all') return articles;
  const now = Date.now();
  const days = date === 'week' ? 7 : date === 'month' ? 30 : date === 'quarter' ? 90 : 365;
  const cutoff = now - days * 86_400_000;
  return articles.filter(a => new Date(a.published_at).getTime() >= cutoff);
}

// ── Bento card ─────────────────────────────────────────────────────────────────

function NewsBentoCard({
  article,
  index,
  total,
}: {
  article: NewsArticle;
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
      <Link to={`/news/${article.slug}`} className="absolute inset-0 z-20" aria-label={article.title} />

      {/* Background image or fallback */}
      {article.hero_image_url ? (
        <img
          src={article.hero_image_url}
          alt={article.title}
          loading={index < 3 ? 'eager' : 'lazy'}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(rgba(0,120,212,0.1) 0%, transparent 70%), radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '100% 100%, 20px 20px',
            backgroundColor: '#071220',
          }}
        />
      )}

      {/* Permanent gradient overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.65) 45%, rgba(0,0,0,0.15) 100%)',
        }}
      />
      {/* Hover: image breathes */}
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-opacity duration-500" />

      {/* Top accent on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.7), rgba(255,255,255,0.2), transparent 70%)' }}
      />

      {/* Category + date badges — top */}
      <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
        <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/50 border border-white/15 rounded-full px-2.5 py-0.5 backdrop-blur-sm bg-black/20">
          {NEWS_CATEGORY_LABEL[article.category]}
        </span>
        <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40 border border-white/10 rounded-full px-2.5 py-0.5 backdrop-blur-sm bg-black/20">
          {formatDate(article.published_at)}
        </span>
      </div>

      {/* REST STATE: title pinned to bottom */}
      <div className="absolute inset-x-0 bottom-0 p-6 z-10 pointer-events-none group-hover:opacity-0 transition-opacity duration-300">
        <h3
          className={cn(
            'font-semibold text-white leading-snug',
            isFeatured ? 'text-[22px] lg:text-[26px] max-w-lg' : 'text-[16px] line-clamp-2',
          )}
        >
          {article.title}
        </h3>
      </div>

      {/* HOVER STATE: title + excerpt + CTA slides up */}
      <div className="absolute inset-x-0 bottom-0 p-6 z-10 pointer-events-none translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
        <h3
          className={cn(
            'font-semibold text-white leading-snug mb-3',
            isFeatured ? 'text-[22px] lg:text-[26px] max-w-lg' : 'text-[16px] line-clamp-2',
          )}
        >
          {article.title}
        </h3>
        {article.excerpt && (
          <p
            className={cn(
              'text-white/65 leading-relaxed mb-4',
              isFeatured ? 'text-[14px] max-w-lg line-clamp-3' : 'text-[12px] line-clamp-2',
            )}
          >
            {article.excerpt}
          </p>
        )}
        <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white">
          Read article <ChevronRight size={13} />
        </span>
      </div>
    </motion.div>
  );
}

// ── Filter pill ────────────────────────────────────────────────────────────────

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
        'shrink-0 text-[11px] font-medium px-3 py-1 rounded-full border transition-all duration-200',
        active
          ? 'bg-white text-black border-white'
          : 'border-white/15 text-white/45 hover:border-white/35 hover:text-white/80',
      )}
    >
      {children}
    </button>
  );
}

// ── Skeleton ───────────────────────────────────────────────────────────────────

function SkeletonGrid() {
  return (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: 'repeat(3, 1fr)', gridAutoRows: '280px' }}
    >
      <div className="rounded-2xl bg-white/[0.04] animate-pulse" style={{ gridColumn: '1/3', gridRow: '1/3' }} />
      <div className="rounded-2xl bg-white/[0.04] animate-pulse" style={{ gridColumn: '3/4', gridRow: '1/2' }} />
      <div className="rounded-2xl bg-white/[0.04] animate-pulse" style={{ gridColumn: '3/4', gridRow: '2/3' }} />
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export function News() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<NewsUIFilters>(EMPTY_FILTERS);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setLoading(true);
    setError(null);
    NewsService.getArticles(
      filters.category ? { category: filters.category } : {},
    )
      .then(data => { setArticles(data); setVisibleCount(PAGE_SIZE); })
      .catch(() => setError('Failed to load news. Please try again.'))
      .finally(() => setLoading(false));
  }, [filters.category]);

  const filtered = useMemo(
    () => applyDateFilter(articles, filters.date),
    [articles, filters.date],
  );

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="min-h-screen text-white relative">
      <BackgroundBlobs />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-[76px]">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${ASSETS.scene6})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.12,
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(6,6,6,0.3) 0%, rgba(6,6,6,0.85) 100%)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(0,120,212,0.12) 0%, transparent 60%)',
            filter: 'blur(80px)',
          }}
        />

        <div className="relative max-w-[1240px] mx-auto px-10 py-16 pb-12">
          <div className="relative">
            <div
              className="absolute -top-4 left-0 text-[140px] lg:text-[200px] font-black text-white/[0.025] leading-none select-none pointer-events-none tracking-tighter"
              aria-hidden
            >
              NEWS
            </div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <p className="text-[11px] uppercase tracking-[0.25em] text-white/30 font-semibold mb-5">
                Company & Industry News
              </p>
              <h1 className="text-[46px] lg:text-[62px] font-semibold leading-tight text-white mb-4 max-w-2xl">
                Stay ahead of <span className="gradient-text">what matters.</span><br />
                <span className="font-light">From NEX4 and <span className="gradient-text">beyond.</span></span>
              </h1>
              <p className="text-[16px] text-white/35 max-w-xl leading-relaxed">
                The latest announcements, partnerships, awards, and industry developments
                from NEX4 and the broader Microsoft partner ecosystem.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Sticky filter bar ─────────────────────────────────────────────── */}
      <div className="sticky top-[76px] z-20 border-y border-white/[0.07] backdrop-blur-md">
        <div className="max-w-[1240px] mx-auto px-10 py-4">
          <div className="flex flex-wrap gap-x-5 gap-y-3 items-center">
            <div className="flex items-center gap-2.5">
              <span className="shrink-0 text-[9px] uppercase tracking-[0.18em] text-white/25 font-semibold">When</span>
              <div className="flex gap-1.5">
                {CONTENT_DATE_FILTERS.map(d => (
                  <Pill
                    key={d.value}
                    active={filters.date === d.value}
                    onClick={() => setFilters(f => ({ ...f, date: d.value }))}
                  >
                    {d.label}
                  </Pill>
                ))}
              </div>
            </div>

            <div className="w-px h-5 bg-white/10 hidden sm:block" />

            <div className="flex items-center gap-2.5 min-w-0">
              <span className="shrink-0 text-[9px] uppercase tracking-[0.18em] text-white/25 font-semibold">Category</span>
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                <Pill active={!filters.category} onClick={() => setFilters(f => ({ ...f, category: undefined }))}>All</Pill>
                {NEWS_CATEGORIES.map(c => (
                  <Pill
                    key={c.value}
                    active={filters.category === c.value}
                    onClick={() => setFilters(f => ({ ...f, category: f.category === c.value ? undefined : c.value }))}
                  >
                    {c.label}
                  </Pill>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bento grid ────────────────────────────────────────────────────── */}
      <section className="max-w-[1240px] mx-auto px-10 py-14">
        <div className="flex items-baseline gap-4 mb-8">
          <h2 className="text-[13px] uppercase tracking-[0.2em] text-white/50 font-semibold">
            Latest News
          </h2>
          {!loading && (
            <span className="text-[11px] font-mono text-white/20">
              {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
            </span>
          )}
        </div>

        {error && (
          <p className="text-red-400/70 text-sm mb-8">{error}</p>
        )}

        {loading ? (
          <SkeletonGrid />
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center border border-white/[0.06] rounded-2xl">
            <p className="text-white/20 text-[13px] mb-1">No news articles match your filters.</p>
            <button
              onClick={() => setFilters(EMPTY_FILTERS)}
              className="text-[11px] text-white/35 hover:text-white/60 transition-colors underline underline-offset-2"
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
              {visible.map((article, i) => (
                <NewsBentoCard key={article.id} article={article} index={i} total={visible.length} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                  className="px-8 py-3 border border-white/[0.12] rounded-full text-[12px] uppercase tracking-[0.18em] text-white/50 hover:text-white hover:border-white/30 transition-all duration-200"
                >
                  Load more news
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run:
```bash
npx tsc --noEmit
```
Expected: no errors. If you see `Cannot find name 'X'` for anything in the new imports, check that `@/lib/blogConstants` exports `NEWS_CATEGORY_LABEL` (it does — confirmed in `src/lib/blogConstants.ts`).

- [ ] **Step 3: Verify the dev server renders correctly**

Run:
```bash
npm run dev
```
Navigate to `/news`. Confirm:
- Bento grid renders (featured large card top-left, two smaller cards top-right)
- Hovering a card: title+excerpt+CTA slides up from bottom
- Category badge (top-left) and date badge (top-right) visible
- Filter bar pills work — clicking a category re-fetches; clicking a date filter narrows results
- Loading state shows the skeleton grid (3 bento-shaped placeholders)
- "Load more news" button is rounded-full

- [ ] **Step 4: Commit**

```bash
git add src/pages/News.tsx
git commit -m "feat: redesign news landing page with bento grid matching case studies"
```
