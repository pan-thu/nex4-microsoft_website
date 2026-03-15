import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CATEGORY_SHORT, TYPE_LABEL } from '@/lib/eventConstants';
import type { Event } from '@/types/events';

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-US', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).toUpperCase();
}

function daysUntil(iso: string | null): number | null {
  if (!iso) return null;
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
}

/** Standard grid card */
export function EventCard({ event }: { event: Event }) {
  const date = formatDate(event.event_date);
  const days = daysUntil(event.event_date);
  const soon = days !== null && days <= 7 && days >= 0;

  return (
    <Link
      to={`/events/${event.slug}`}
      className="group flex flex-col transition-all duration-300 hover:-translate-y-1"
      style={{ background: 'linear-gradient(160deg, #071220 0%, #050c18 60%, #030810 100%)' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'linear-gradient(160deg, #0e2040 0%, #0a1830 60%, #071220 100%)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'linear-gradient(160deg, #071220 0%, #050c18 60%, #030810 100%)')}
    >
      {/* Image */}
      <div className="aspect-video overflow-hidden bg-white/5 relative">
        {event.hero_image_url ? (
          <img
            src={event.hero_image_url}
            alt={event.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-white/5 to-transparent" />
        )}
        {/* Soon badge */}
        {soon && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white text-black text-[9px] font-bold uppercase tracking-[0.15em] px-2 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
            {days === 0 ? 'Today' : `${days}d left`}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Meta row */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30 border border-white/10 rounded-full px-3 py-0.5">
            {TYPE_LABEL[event.type]}
          </span>
          {date && (
            <span className="text-[11px] font-mono text-white/30 tabular-nums">{date}</span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-white font-semibold text-[16px] leading-snug group-hover:text-white/85 transition-colors line-clamp-2">
          {event.title}
        </h3>

        {/* Category */}
        <p className="text-[11px] uppercase tracking-[0.15em] text-white/25 font-medium">
          {CATEGORY_SHORT[event.category]}
        </p>

        {/* CTA */}
        <div className="mt-auto pt-3 border-t border-white/[0.06] flex items-center gap-1.5 text-[13px] text-white/40 group-hover:text-white/70 transition-colors">
          Register
          <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform duration-200" />
        </div>
      </div>
    </Link>
  );
}

