import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
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
      className="group flex flex-col bg-[#0a0a0a] border border-white/[0.08] hover:border-white/25 transition-all duration-300 hover:-translate-y-1"
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
          <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/30 border border-white/10 px-2 py-0.5">
            {TYPE_LABEL[event.type]}
          </span>
          {date && (
            <span className="text-[10px] font-mono text-white/30 tabular-nums">{date}</span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-white font-semibold text-[15px] leading-snug group-hover:text-white/85 transition-colors line-clamp-2">
          {event.title}
        </h3>

        {/* Category */}
        <p className="text-[10px] uppercase tracking-[0.15em] text-white/25 font-medium">
          {CATEGORY_SHORT[event.category]}
        </p>

        {/* CTA */}
        <div className="mt-auto pt-3 border-t border-white/[0.06] flex items-center gap-1.5 text-[12px] text-white/40 group-hover:text-white/70 transition-colors">
          Register
          <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform duration-200" />
        </div>
      </div>
    </Link>
  );
}

/** Featured card — horizontal, first upcoming event */
export function FeaturedEventCard({ event }: { event: Event }) {
  const date = formatDate(event.event_date);
  const days = daysUntil(event.event_date);
  const soon = days !== null && days <= 14 && days >= 0;

  return (
    <Link
      to={`/events/${event.slug}`}
      className={cn(
        'group grid lg:grid-cols-[55%_45%] bg-[#0a0a0a] border border-white/[0.08] hover:border-white/25 transition-all duration-300',
      )}
    >
      {/* Image — left */}
      <div className="aspect-video lg:aspect-auto overflow-hidden bg-white/5 relative min-h-[280px]">
        {event.hero_image_url ? (
          <img
            src={event.hero_image_url}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0a]/60 hidden lg:block" />
      </div>

      {/* Content — right */}
      <div className="flex flex-col justify-between p-8 lg:p-10 gap-6">
        {/* Top labels */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/25">
              Featured
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40 border border-white/10 px-2 py-0.5 w-fit">
              {TYPE_LABEL[event.type]}
            </span>
          </div>
          {soon && (
            <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-white/60">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {days === 0 ? 'Today' : `In ${days} days`}
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <h2 className="text-white font-semibold text-[28px] lg:text-[32px] leading-tight mb-3 group-hover:text-white/85 transition-colors">
            {event.title}
          </h2>
          {event.description && (
            <p className="text-[13px] text-white/40 leading-relaxed line-clamp-2">
              {event.description}
            </p>
          )}
        </div>

        {/* Bottom */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[9px] uppercase tracking-[0.15em] text-white/20 mb-1">
              {CATEGORY_SHORT[event.category]}
            </p>
            {date && (
              <p className="text-[12px] font-mono text-white/50 tabular-nums">{date}</p>
            )}
          </div>
          <div className="flex items-center gap-2 text-[13px] font-medium text-white/50 group-hover:text-white transition-colors shrink-0">
            Register now
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
          </div>
        </div>
      </div>
    </Link>
  );
}
