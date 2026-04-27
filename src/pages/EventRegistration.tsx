import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Tag, User } from 'lucide-react';
import { EventService } from '@/services/EventService';
import { RegistrationForm } from '@/components/events/RegistrationForm';
import { KeyTakeaways } from '@/components/events/KeyTakeaways';
import { BackgroundBlobs } from '@/components/common/BackgroundBlobs';
import { CATEGORY_SHORT, TYPE_LABEL } from '@/lib/eventConstants';
import type { Event } from '@/types/events';

function formatDateLong(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#060606] pt-[76px]">
      <div className="h-72 bg-white/[0.03] animate-pulse" />
      <div className="max-w-[1240px] mx-auto px-10 py-14 grid lg:grid-cols-[1fr_400px] gap-12">
        <div className="space-y-5">
          {[80, 60, 90, 70].map((w, i) => (
            <div key={i} className="h-4 bg-white/[0.05] animate-pulse rounded-sm" style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className="h-[480px] bg-white/[0.03] animate-pulse" />
      </div>
    </div>
  );
}

export function EventRegistration() {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    EventService.getEvent(slug)
      .then(e => { if (!e) setNotFound(true); else setEvent(e); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingSkeleton />;

  if (notFound || !event) {
    return (
      <div className="min-h-screen bg-[#060606] text-white pt-[76px] flex flex-col items-center justify-center gap-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">404</p>
        <h2 className="text-2xl font-semibold text-white">Event not found.</h2>
        <Link
          to="/events"
          className="flex items-center gap-2 text-[13px] text-white/35 hover:text-white transition-colors mt-2"
        >
          <ArrowLeft size={14} /> Back to Events
        </Link>
      </div>
    );
  }

  const dateStr = formatDateLong(event.event_date);

  return (
    <div className="min-h-screen bg-[#060606] text-white relative">
      <BackgroundBlobs />

      {/* ── Hero banner ──────────────────────────────────────────────────── */}
      <div className="relative pt-[76px] overflow-hidden">
        {/* Background image */}
        <div className="relative h-72 lg:h-80 overflow-hidden">
          {event.hero_image_url ? (
            <img
              src={event.hero_image_url}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />
          )}

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/60 to-[#080808]/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/70 to-transparent" />

          {/* Back link */}
          <div className="absolute top-6 left-0 right-0 max-w-[1240px] mx-auto px-10">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 text-[11px] text-white/35 hover:text-white/70 transition-colors uppercase tracking-[0.15em] font-medium"
            >
              <ArrowLeft size={12} /> All Events
            </Link>
          </div>

          {/* Event meta — bottom of banner */}
          <div className="absolute bottom-0 left-0 right-0 max-w-[1240px] mx-auto px-10 pb-8">
            {/* Badges */}
            <div className="flex gap-2 mb-4">
              <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40 border border-white/15 rounded-full px-2.5 py-0.5">
                {TYPE_LABEL[event.type]}
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40 border border-white/10 rounded-full px-2.5 py-0.5">
                {CATEGORY_SHORT[event.category]}
              </span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-[28px] lg:text-[38px] font-semibold text-white max-w-2xl leading-tight"
            >
              {event.title}
            </motion.h1>
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="max-w-[1240px] mx-auto px-10 py-12">
        <div className="grid lg:grid-cols-[1fr_400px] gap-12 lg:gap-16 items-start">

          {/* Left — event details */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            className="flex flex-col gap-10"
          >
            {/* Date + category */}
            <div className="flex flex-wrap gap-5 pb-8 border-b border-white/[0.06] rounded-sm">
              {dateStr && (
                <div className="flex items-center gap-2.5 text-[13px] text-white/40">
                  <Calendar size={14} className="text-white/20" />
                  {dateStr}
                </div>
              )}
              <div className="flex items-center gap-2.5 text-[13px] text-white/40">
                <Tag size={14} className="text-white/20" />
                {CATEGORY_SHORT[event.category]}
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-semibold mb-4">
                  About this event
                </p>
                {event.description.trim().startsWith('<')
                  ? <div className="prose-content text-[16px]" dangerouslySetInnerHTML={{ __html: event.description }} />
                  : <p className="text-[16px] text-white/55 leading-[1.85]">{event.description}</p>
                }
              </div>
            )}

            {/* Key takeaways */}
            {event.key_takeaways.length > 0 && (
              <KeyTakeaways items={event.key_takeaways} />
            )}

            {/* Speakers */}
            {event.speakers && event.speakers.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-semibold mb-4">
                  Speakers
                </p>
                <div className="flex flex-wrap gap-4">
                  {event.speakers.map((speaker, i) => (
                    <div key={i} className="flex items-center gap-3 border border-white/[0.06] rounded-xl px-4 py-3">
                      {speaker.photo_url ? (
                        <img
                          src={speaker.photo_url}
                          alt={speaker.name}
                          className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/10 shrink-0 flex items-center justify-center">
                          <User size={16} className="text-white/30" />
                        </div>
                      )}
                      <div>
                        <p className="text-[14px] font-medium text-white">{speaker.name}</p>
                        {speaker.title && <p className="text-[12px] text-white/40">{speaker.title}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Right — registration form (sticky) */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
            className="lg:sticky lg:top-28"
          >
            <RegistrationForm eventId={event.id} eventTitle={event.title} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
