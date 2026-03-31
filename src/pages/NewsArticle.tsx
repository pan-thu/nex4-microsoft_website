import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react';
import { NewsService } from '@/services/BlogService';
import { BackgroundBlobs } from '@/components/common/BackgroundBlobs';
import { NewsCard } from '@/components/news/NewsCard';
import { NEWS_CATEGORY_LABEL } from '@/lib/blogConstants';
import { ASSETS } from '@/lib/assets';
import type { NewsArticle as NewsArticleType } from '@/types/blog';

function formatDateLong(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

function renderContent(content: string) {
  return content.split(/\n\n+/).map((para, i) => {
    if (para.startsWith('## ')) {
      return (
        <h2 key={i} className="text-[22px] font-semibold text-white mt-10 mb-4 leading-snug">
          {para.replace(/^## /, '')}
        </h2>
      );
    }
    if (para.startsWith('### ')) {
      return (
        <h3 key={i} className="text-[17px] font-semibold text-white/90 mt-8 mb-3 leading-snug">
          {para.replace(/^### /, '')}
        </h3>
      );
    }
    if (para.startsWith('> ')) {
      return (
        <blockquote
          key={i}
          className="border-l-2 border-white/20 pl-5 my-6 italic text-white/50 text-[16px] leading-[1.9]"
        >
          {para.replace(/^> /, '')}
        </blockquote>
      );
    }
    return (
      <p key={i} className="text-[15px] text-white/60 leading-[1.9] mb-0">
        {para}
      </p>
    );
  });
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#060606] pt-[76px]">
      <div className="h-72 bg-white/[0.03] animate-pulse" />
      <div className="max-w-3xl mx-auto px-10 py-14 space-y-5">
        {[80, 60, 90, 70, 85, 65, 75].map((w, i) => (
          <div key={i} className="h-4 bg-white/[0.05] animate-pulse rounded-sm" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}

export function NewsArticle() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<NewsArticleType | null>(null);
  const [related, setRelated] = useState<NewsArticleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    NewsService.getArticle(slug)
      .then(a => {
        if (!a) { setNotFound(true); return; }
        setArticle(a);
        return NewsService.getRelatedArticles(a.category, slug);
      })
      .then(rel => { if (rel) setRelated(rel); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingSkeleton />;

  if (notFound || !article) {
    return (
      <div className="min-h-screen bg-[#060606] text-white pt-[76px] flex flex-col items-center justify-center gap-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">404</p>
        <h2 className="text-2xl font-semibold text-white">Article not found.</h2>
        <Link
          to="/news"
          className="flex items-center gap-2 text-[13px] text-white/35 hover:text-white transition-colors mt-2"
        >
          <ArrowLeft size={14} /> Back to News
        </Link>
      </div>
    );
  }

  const dateStr = formatDateLong(article.published_at);

  return (
    <div className="min-h-screen bg-[#060606] text-white relative">
      <BackgroundBlobs />

      {/* ── Hero banner ──────────────────────────────────────────────────── */}
      <div className="relative pt-[76px] overflow-hidden">
        <div className="relative h-72 lg:h-80 overflow-hidden">
          {article.hero_image_url ? (
            <img
              src={article.hero_image_url}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${ASSETS.scene8})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.15,
              }}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-[#060606]/65 to-[#060606]/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060606]/60 to-transparent" />

          {/* Back link */}
          <div className="absolute top-6 left-0 right-0 max-w-[1240px] mx-auto px-10">
            <Link
              to="/news"
              className="inline-flex items-center gap-2 text-[11px] text-white/35 hover:text-white/70 transition-colors uppercase tracking-[0.15em] font-medium"
            >
              <ArrowLeft size={12} /> All News
            </Link>
          </div>

          {/* Article meta — bottom of banner */}
          <div className="absolute bottom-0 left-0 right-0 max-w-[1240px] mx-auto px-10 pb-8">
            <div className="flex gap-2 mb-4">
              <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40 border border-white/15 rounded-full px-2.5 py-0.5">
                {NEWS_CATEGORY_LABEL[article.category]}
              </span>
              {article.reading_time && (
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40 border border-white/10 rounded-full px-2.5 py-0.5">
                  {article.reading_time} min read
                </span>
              )}
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-[28px] lg:text-[38px] font-semibold text-white max-w-3xl leading-tight"
            >
              {article.title}
            </motion.h1>
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="max-w-[800px] mx-auto px-10 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
        >
          {/* Meta row */}
          <div className="flex flex-wrap gap-5 pb-8 border-b border-white/[0.06] mb-10">
            <div className="flex items-center gap-2.5 text-[13px] text-white/40">
              <Calendar size={14} className="text-white/20" />
              {dateStr}
            </div>
            <div className="flex items-center gap-2.5 text-[13px] text-white/40">
              <Tag size={14} className="text-white/20" />
              {NEWS_CATEGORY_LABEL[article.category]}
            </div>
            {article.reading_time && (
              <div className="flex items-center gap-2.5 text-[13px] text-white/40">
                <Clock size={14} className="text-white/20" />
                {article.reading_time} min read
              </div>
            )}
          </div>

          {/* Excerpt lead */}
          {article.excerpt && (
            <p className="text-[18px] text-white/50 leading-[1.8] mb-8 font-light border-l-2 border-white/10 pl-5">
              {article.excerpt}
            </p>
          )}

          {/* Article body */}
          {article.content ? (
            <div className="space-y-5">
              {renderContent(article.content)}
            </div>
          ) : (
            <div
              className="border border-white/[0.06] py-16 flex items-center justify-center"
              style={{
                backgroundImage: 'radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            >
              <p className="text-white/15 text-[13px]">Full article coming soon.</p>
            </div>
          )}

          {/* Microsoft partner note */}
          <div
            className="mt-10 border border-white/[0.06] p-5 flex gap-4 items-center"
            style={{ backgroundImage: 'radial-gradient(rgba(0,120,212,0.08) 0%, transparent 70%)' }}
          >
            <div className="shrink-0 mt-0.5">
              <div className="w-6 h-6 grid grid-cols-2 gap-px opacity-70">
                <div className="bg-[#f25022]" /><div className="bg-[#7fba00]" />
                <div className="bg-[#00a4ef]" /><div className="bg-[#ffb900]" />
              </div>
            </div>
            <p className="text-[11px] text-white/50 leading-relaxed">
              NEX4 ICT Solutions is an official{' '}
              <span className="gradient-text font-medium">Microsoft Partner</span> serving
              enterprise clients across APAC — delivering cloud, security, and modern workplace solutions.
            </p>
          </div>

          {/* Back link */}
          <div className="mt-8 pt-6 border-t border-white/[0.06]">
            <Link
              to="/news"
              className="inline-flex items-center gap-2 text-[11px] text-white/30 hover:text-white/60 transition-colors uppercase tracking-[0.15em] font-medium"
            >
              <ArrowLeft size={11} /> Back to All News
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ── More news ────────────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="border-t border-white/[0.06]">
          <div className="max-w-[1240px] mx-auto px-10 py-14">
            <div className="flex items-baseline gap-4 mb-8">
              <h2 className="text-[13px] uppercase tracking-[0.2em] text-white/50 font-semibold">
                More {NEWS_CATEGORY_LABEL[article.category]} News
              </h2>
            </div>
            <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
              {related.map(r => <NewsCard key={r.id} article={r} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
