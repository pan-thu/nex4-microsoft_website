import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, Tag, User } from 'lucide-react';
import { BlogService } from '@/services/BlogService';
import { BackgroundBlobs } from '@/components/common/BackgroundBlobs';
import { BlogCard } from '@/components/blog/BlogCard';
import { BLOG_CATEGORY_LABEL } from '@/lib/blogConstants';
import { ASSETS } from '@/lib/assets';
import type { BlogPost as BlogPostType } from '@/types/blog';

function formatDateLong(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

function renderContent(content: string) {
  if (content.trim().startsWith('<')) {
    return <div className="prose-content text-[16px]" dangerouslySetInnerHTML={{ __html: content }} />;
  }
  // Legacy markdown
  return content.split(/\n\n+/).map((para, i) => {
    if (para.startsWith('## ')) {
      return <h2 key={i} className="text-[24px] font-semibold text-white mt-10 mb-4 leading-snug">{para.replace(/^## /, '')}</h2>;
    }
    if (para.startsWith('### ')) {
      return <h3 key={i} className="text-[19px] font-semibold text-white/90 mt-8 mb-3 leading-snug">{para.replace(/^### /, '')}</h3>;
    }
    if (para.startsWith('> ')) {
      return <blockquote key={i} className="border-l-2 border-white/20 pl-5 my-6 italic text-white/50 text-[17px] leading-[1.9]">{para.replace(/^> /, '')}</blockquote>;
    }
    return <p key={i} className="text-[16px] text-white/60 leading-[1.9] mb-0">{para}</p>;
  });
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#060606] pt-[76px]">
      <div className="h-80 bg-white/[0.03] animate-pulse" />
      <div className="max-w-[1240px] mx-auto px-10 py-14 grid lg:grid-cols-[1fr_300px] gap-12">
        <div className="space-y-5">
          {[80, 60, 90, 70, 85, 65].map((w, i) => (
            <div key={i} className="h-4 bg-white/[0.05] animate-pulse rounded-sm" style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className="h-64 bg-white/[0.03] animate-pulse" />
      </div>
    </div>
  );
}

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [related, setRelated] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    BlogService.getPost(slug)
      .then(p => {
        if (!p) { setNotFound(true); return; }
        setPost(p);
        return BlogService.getRelatedPosts(p.category, slug);
      })
      .then(rel => { if (rel) setRelated(rel); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingSkeleton />;

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-[#060606] text-white pt-[76px] flex flex-col items-center justify-center gap-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">404</p>
        <h2 className="text-2xl font-semibold text-white">Post not found.</h2>
        <Link
          to="/blog"
          className="flex items-center gap-2 text-[13px] text-white/35 hover:text-white transition-colors mt-2"
        >
          <ArrowLeft size={14} /> Back to Blog
        </Link>
      </div>
    );
  }

  const dateStr = formatDateLong(post.published_at);

  return (
    <div className="min-h-screen bg-[#060606] text-white relative">
      <BackgroundBlobs />

      {/* ── Hero banner ──────────────────────────────────────────────────── */}
      <div className="relative pt-[76px] overflow-hidden">
        <div className="relative h-80 lg:h-[420px] overflow-hidden">
          {post.hero_image_url ? (
            <img
              src={post.hero_image_url}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${ASSETS.scene7})`,
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
              to="/blog"
              className="inline-flex items-center gap-2 text-[11px] text-white/35 hover:text-white/70 transition-colors uppercase tracking-[0.15em] font-medium rounded-full"
            >
              <ArrowLeft size={12} /> All Posts
            </Link>
          </div>

          {/* Post meta — bottom of banner */}
          <div className="absolute bottom-0 left-0 right-0 max-w-[1240px] mx-auto px-10 pb-8">
            <div className="flex gap-2 mb-4">
              <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40 border border-white/15 rounded-full px-2.5 py-0.5">
                {BLOG_CATEGORY_LABEL[post.category]}
              </span>
              {post.reading_time && (
                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40 border border-white/10 rounded-full px-2.5 py-0.5">
                  {post.reading_time} min read
                </span>
              )}
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-[28px] lg:text-[40px] font-semibold text-white max-w-3xl leading-tight"
            >
              {post.title}
            </motion.h1>
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="max-w-[1240px] mx-auto px-10 py-12">
        <div className="grid lg:grid-cols-[1fr_280px] gap-12 lg:gap-16 items-start">

          {/* ── Left: article content ───────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            className="min-w-0"
          >
            {/* Meta row */}
            <div className="flex flex-wrap gap-5 pb-8 border-b border-white/[0.06] mb-10 rounded-sm">
              <div className="flex items-center gap-2.5 text-[13px] text-white/40">
                <Calendar size={14} className="text-white/20" />
                {dateStr}
              </div>
              <div className="flex items-center gap-2.5 text-[13px] text-white/40">
                <User size={14} className="text-white/20" />
                {post.author_name}
                {post.author_title && <span className="text-white/20">— {post.author_title}</span>}
              </div>
              <div className="flex items-center gap-2.5 text-[13px] text-white/40">
                <Tag size={14} className="text-white/20" />
                {BLOG_CATEGORY_LABEL[post.category]}
              </div>
            </div>

            {/* Excerpt lead */}
            {post.excerpt && (
              <p className="text-[18px] text-white/50 leading-[1.8] mb-8 font-light border-l-2 border-white/10 pl-5">
                {post.excerpt}
              </p>
            )}

            {/* Article body */}
            {post.content ? (
              <div className="space-y-5">
                {renderContent(post.content)}
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

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-10 pt-8 border-t border-white/[0.06]">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-semibold mb-3">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-[11px] text-white/35 border border-white/10 rounded-full px-3 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Author card */}
            <div className="mt-10 border border-white/[0.06] rounded-xl p-6 flex gap-4 items-start">
              {post.author_avatar_url ? (
                <img
                  src={post.author_avatar_url}
                  alt={post.author_name}
                  className="w-12 h-12 rounded-full object-cover shrink-0 border border-white/10"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-white/[0.06] border border-white/10 shrink-0 flex items-center justify-center">
                  <User size={18} className="text-white/30" />
                </div>
              )}
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/25 font-semibold mb-1">Author</p>
                <p className="text-white font-semibold text-[15px]">{post.author_name}</p>
                {post.author_title && (
                  <p className="text-[13px] text-white/35 mt-0.5">{post.author_title}</p>
                )}
              </div>
            </div>

          </motion.div>

          {/* ── Right: sticky sidebar ───────────────────────────────────── */}
          <motion.aside
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
            className="lg:sticky lg:top-28 flex flex-col gap-6"
          >
            {/* Quick facts */}
            <div className="border border-white/[0.06] rounded-xl p-5 flex flex-col gap-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-semibold">About this post</p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-[13px] text-white/40">
                  <Clock size={13} className="text-white/20 shrink-0" />
                  {post.reading_time ? `${post.reading_time} min read` : 'Quick read'}
                </div>
                <div className="flex items-center gap-3 text-[13px] text-white/40">
                  <Calendar size={13} className="text-white/20 shrink-0" />
                  {new Date(post.published_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <div className="flex items-center gap-3 text-[13px] text-white/40">
                  <Tag size={13} className="text-white/20 shrink-0" />
                  {BLOG_CATEGORY_LABEL[post.category]}
                </div>
              </div>
            </div>

            {/* Related posts */}
            {related.length > 0 && (
              <div className="border border-white/[0.06] rounded-xl p-5 flex flex-col gap-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-semibold">Related Posts</p>
                <div className="flex flex-col gap-4">
                  {related.map(r => (
                    <Link
                      key={r.id}
                      to={`/blog/${r.slug}`}
                      className="group flex gap-3 items-start"
                    >
                      {r.hero_image_url && (
                        <img
                          src={r.hero_image_url}
                          alt={r.title}
                          className="w-16 h-12 object-cover shrink-0 border border-white/[0.06] group-hover:opacity-80 transition-opacity"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="text-[12px] text-white/60 group-hover:text-white/90 transition-colors leading-snug line-clamp-2">
                          {r.title}
                        </p>
                        <p className="text-[10px] text-white/20 mt-1 font-mono">
                          {new Date(r.published_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Back link */}
            <Link
              to="/blog"
              className="flex items-center gap-2 text-[11px] text-white/30 hover:text-white/60 transition-colors uppercase tracking-[0.15em] font-medium"
            >
              <ArrowLeft size={11} /> All Blog Posts
            </Link>
          </motion.aside>
        </div>
      </div>

      {/* ── More posts ───────────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="border-t border-white/[0.06]">
          <div className="max-w-[1240px] mx-auto px-10 py-14">
            <div className="flex items-baseline gap-4 mb-8">
              <h2 className="text-[13px] uppercase tracking-[0.2em] text-white/50 font-semibold">
                More in {BLOG_CATEGORY_LABEL[post.category]}
              </h2>
            </div>
            <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
              {related.map(r => <BlogCard key={r.id} post={r} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
