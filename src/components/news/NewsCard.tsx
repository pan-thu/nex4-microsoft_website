import { Link } from 'react-router-dom';
import { ChevronRight, Clock } from 'lucide-react';
import { NEWS_CATEGORY_LABEL } from '@/lib/blogConstants';
import type { NewsArticle } from '@/types/blog';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).toUpperCase();
}

export function NewsCard({ article }: { article: NewsArticle }) {
  const date = formatDate(article.published_at);

  return (
    <Link
      to={`/news/${article.slug}`}
      className="group flex flex-col transition-all duration-300 hover:-translate-y-1"
      style={{ background: 'linear-gradient(160deg, #071220 0%, #050c18 60%, #030810 100%)' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'linear-gradient(160deg, #0e2040 0%, #0a1830 60%, #071220 100%)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'linear-gradient(160deg, #071220 0%, #050c18 60%, #030810 100%)')}
    >
      {/* Image */}
      <div className="aspect-video overflow-hidden bg-white/5 relative">
        {article.hero_image_url ? (
          <img
            src={article.hero_image_url}
            alt={article.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              backgroundImage: 'radial-gradient(rgba(0,120,212,0.1) 0%, transparent 70%), radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
              backgroundSize: '100% 100%, 20px 20px',
            }}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Meta row */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30 border border-white/10 rounded-full px-3 py-0.5">
            {NEWS_CATEGORY_LABEL[article.category]}
          </span>
          <span className="text-[11px] font-mono text-white/30 tabular-nums">{date}</span>
        </div>

        {/* Title */}
        <h3 className="text-white font-semibold text-[16px] leading-snug group-hover:text-white/85 transition-colors line-clamp-2">
          {article.title}
        </h3>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-[13px] text-white/30 leading-relaxed line-clamp-2">{article.excerpt}</p>
        )}

        {/* Footer row */}
        <div className="mt-auto pt-3 border-t border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-1 text-[11px] text-white/20">
            {article.reading_time && (
              <>
                <Clock size={10} />
                <span>{article.reading_time} min read</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-[13px] text-white/40 group-hover:text-white/70 transition-colors">
            Read article
            <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </div>
        </div>
      </div>
    </Link>
  );
}
