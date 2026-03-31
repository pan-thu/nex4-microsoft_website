import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { NewsCard } from '@/components/news/NewsCard';
import { NewsFilters } from '@/components/news/NewsFilters';
import { NewsService } from '@/services/BlogService';
import { ASSETS } from '@/lib/assets';
import { BackgroundBlobs } from '@/components/common/BackgroundBlobs';
import type { NewsArticle, NewsUIFilters, ContentDateFilter } from '@/types/blog';

const EMPTY_FILTERS: NewsUIFilters = { date: 'all' };
const PAGE_SIZE = 8;

function applyDateFilter(articles: NewsArticle[], date: ContentDateFilter): NewsArticle[] {
  if (date === 'all') return articles;
  const now = Date.now();
  const days = date === 'week' ? 7 : date === 'month' ? 30 : date === 'quarter' ? 90 : 365;
  const cutoff = now - days * 86_400_000;
  return articles.filter(a => new Date(a.published_at).getTime() >= cutoff);
}

function SkeletonCard() {
  return <div className="aspect-[4/5] bg-white/[0.04] animate-pulse" />;
}

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
          <NewsFilters filters={filters} onChange={setFilters} />
        </div>
      </div>

      {/* ── Articles grid ─────────────────────────────────────────────────── */}
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
          <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}>
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center border border-white/[0.06]">
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
            <motion.div
              className="grid gap-5"
              style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
            >
              {visible.map(article => (
                <motion.div
                  key={article.id}
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
                  }}
                >
                  <NewsCard article={article} />
                </motion.div>
              ))}
            </motion.div>

            {hasMore && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                  className="px-8 py-3 border border-white/[0.12] text-[12px] uppercase tracking-[0.18em] text-white/50 hover:text-white hover:border-white/30 transition-all duration-200"
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
