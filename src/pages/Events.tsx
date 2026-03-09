import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { EventCard, FeaturedEventCard } from '@/components/events/EventCard';
import { EventFilters } from '@/components/events/EventFilters';
import { EventService } from '@/services/EventService';
import type { Event, UIFilters } from '@/types/events';

const EMPTY_FILTERS: UIFilters = { date: 'all' };

function applyDateFilter(events: Event[], date: UIFilters['date']): Event[] {
  if (date === 'all') return events;
  const now = Date.now();
  const days = date === 'week' ? 7 : date === 'month' ? 30 : 90;
  const cutoff = now + days * 86_400_000;
  return events.filter(e => {
    if (!e.event_date) return false;
    const t = new Date(e.event_date).getTime();
    return t >= now && t <= cutoff;
  });
}

function SkeletonCard() {
  return <div className="aspect-[4/5] bg-white/[0.04] animate-pulse" />;
}

export function Events() {
  const [upcoming, setUpcoming] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<UIFilters>(EMPTY_FILTERS);

  useEffect(() => {
    setLoading(true);
    setError(null);
    EventService.getEvents({
      status: 'upcoming',
      ...(filters.category ? { category: filters.category } : {}),
      ...(filters.type     ? { type: filters.type }         : {}),
    })
      .then(data => setUpcoming(data))
      .catch(() => setError('Failed to load events. Please try again.'))
      .finally(() => setLoading(false));
  }, [filters.category, filters.type]);

  const filtered = useMemo(
    () => applyDateFilter(upcoming, filters.date),
    [upcoming, filters.date],
  );

  const [featured, ...rest] = filtered;

  return (
    <div className="min-h-screen bg-[#080808] text-white">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-[76px]">
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Blue ambient glow */}
        <div
          className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(0,120,212,0.12) 0%, transparent 60%)',
            filter: 'blur(80px)',
          }}
        />

        <div className="relative max-w-[1240px] mx-auto px-10 py-16 pb-12">
          <div className="relative">
            {/* Ghost watermark */}
            <div
              className="absolute -top-4 left-0 text-[140px] lg:text-[200px] font-black text-white/[0.025] leading-none select-none pointer-events-none tracking-tighter"
              aria-hidden
            >
              EVENTS
            </div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-semibold mb-5">
                Events & Webinars
              </p>
              <h1 className="text-[42px] lg:text-[56px] font-semibold leading-tight text-white mb-4 max-w-2xl">
                Expand your knowledge.<br />
                <span className="text-white/40 font-light">Connect with experts.</span>
              </h1>
              <p className="text-[14px] text-white/35 max-w-xl leading-relaxed">
                Join NEX4 and Microsoft-led sessions on cloud, security, AI, and modern
                workplace transformation — live across APAC.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Sticky filter bar ─────────────────────────────────────────────── */}
      <div className="sticky top-[76px] z-20 border-y border-white/[0.07] bg-[#080808]/90 backdrop-blur-md">
        <div className="max-w-[1240px] mx-auto px-10 py-4">
          <EventFilters filters={filters} onChange={setFilters} />
        </div>
      </div>

      {/* ── Upcoming Events ───────────────────────────────────────────────── */}
      <section className="max-w-[1240px] mx-auto px-10 py-14">
        <div className="flex items-baseline gap-4 mb-8">
          <h2 className="text-[13px] uppercase tracking-[0.2em] text-white/50 font-semibold">
            Upcoming Events
          </h2>
          {!loading && (
            <span className="text-[11px] font-mono text-white/20">
              {filtered.length} {filtered.length === 1 ? 'event' : 'events'}
            </span>
          )}
        </div>

        {error && (
          <p className="text-red-400/70 text-sm mb-8">{error}</p>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.05]">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center border border-white/[0.06]">
            <p className="text-white/20 text-[13px] mb-1">No upcoming events match your filters.</p>
            <button
              onClick={() => setFilters(EMPTY_FILTERS)}
              className="text-[11px] text-white/35 hover:text-white/60 transition-colors underline underline-offset-2"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-px bg-white/[0.05]">
            {/* Featured — first event */}
            {featured && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <FeaturedEventCard event={featured} />
              </motion.div>
            )}

            {/* Grid */}
            {rest.length > 0 && (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
              >
                {rest.map(event => (
                  <motion.div
                    key={event.id}
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
                    }}
                  >
                    <EventCard event={event} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        )}
      </section>

      {/* ── On-Demand ─────────────────────────────────────────────────────── */}
      <section className="border-t border-white/[0.06]">
        <div className="max-w-[1240px] mx-auto px-10 py-14">
          <div className="flex items-baseline gap-4 mb-8">
            <h2 className="text-[13px] uppercase tracking-[0.2em] text-white/50 font-semibold">
              On-Demand
            </h2>
          </div>

          {/* Placeholder */}
          <div
            className="relative overflow-hidden border border-white/[0.06] py-20 flex flex-col items-center justify-center gap-4"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(0,120,212,0.06) 0%, transparent 70%)',
              }}
            />
            <p className="relative text-[11px] uppercase tracking-[0.2em] text-white/20 font-semibold">
              On-demand content
            </p>
            <p className="relative text-white/10 text-[13px]">Available soon — check back after the event.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
