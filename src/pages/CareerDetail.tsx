import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowLeft, MapPin, Monitor, Users } from 'lucide-react';
import { CareerService } from '@/services/CareerService';
import { BackgroundBlobs } from '@/components/common/BackgroundBlobs';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import type { JobPosting } from '@/types/career';

// ── Content renderer (same pattern as BlogPost) ───────────────────────────────

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
        <blockquote key={i} className="border-l-2 border-white/20 pl-5 my-6 italic text-white/50 text-[16px] leading-[1.9]">
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

// ── Loading skeleton ──────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#060606] pt-[76px]">
      <div className="h-72 bg-white/[0.03] animate-pulse" />
      <div className="max-w-[820px] mx-auto px-10 py-14 space-y-5">
        {[80, 60, 90, 70, 85].map((w, i) => (
          <div key={i} className="h-4 bg-white/[0.05] animate-pulse rounded-sm" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function Hero({ job }: { job: JobPosting }) {
  return (
    <section className="relative bg-black overflow-hidden" style={{ minHeight: 440 }}>
      {job.hero_image_url ? (
        <>
          <img src={job.hero_image_url} alt={job.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.93) 0%, rgba(0,0,0,0.76) 42%, rgba(0,0,0,0.38) 72%, rgba(0,0,0,0.12) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 45%)' }} />
        </>
      ) : (
        <>
          <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(104,33,122,0.22) 0%, rgba(0,120,212,0.14) 50%, transparent 70%)', filter: 'blur(90px)' }} />
          <div className="absolute bottom-0 left-1/3 w-[360px] h-[360px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(0,188,242,0.10) 0%, transparent 65%)', filter: 'blur(70px)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)' }} />
        </>
      )}

      <div className="relative z-10 max-w-[1240px] mx-auto px-10 flex flex-col justify-end" style={{ minHeight: 440, paddingBottom: 64 }}>
        <nav className="flex items-center gap-2 mb-10">
          <Link to="/" className="text-[11px] text-white/30 hover:text-white/55 transition-colors">Home</Link>
          <ChevronRight size={11} className="text-white/20" />
          <Link to="/careers" className="text-[11px] text-white/30 hover:text-white/55 transition-colors">Careers</Link>
          <ChevronRight size={11} className="text-white/20" />
          <span className="text-[11px] text-white/45 truncate max-w-[200px]">{job.title}</span>
        </nav>

        {job.is_hot && (
          <span className="inline-block mb-4 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white rounded-full w-fit"
            style={{ background: 'linear-gradient(90deg, #7c3aed, #2563eb)' }}>
            Hot
          </span>
        )}

        <h1 className="text-[40px] lg:text-[52px] font-light leading-[1.08] text-white max-w-[700px] mb-6">
          {job.title}
        </h1>

        {/* Meta pills */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5 text-[12px] text-white/50">
            <Monitor size={13} className="shrink-0" />
            {job.workplace_type}
          </span>
          {job.city && (
            <span className="flex items-center gap-1.5 text-[12px] text-white/50">
              <MapPin size={13} className="shrink-0" />
              {job.city}
            </span>
          )}
          {job.specialization && (
            <span className="flex items-center gap-1.5 text-[12px] text-white/50">
              <Users size={13} className="shrink-0" />
              {job.specialization}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Apply form ────────────────────────────────────────────────────────────────

type ApplyState = { first_name: string; last_name: string; email: string; phone: string; cover_letter: string };
const EMPTY_APPLY: ApplyState = { first_name: '', last_name: '', email: '', phone: '', cover_letter: '' };

function ApplyForm({ jobId }: { jobId: string }) {
  const [form, setForm]           = useState<ApplyState>(EMPTY_APPLY);
  const [errors, setErrors]       = useState<Partial<Record<keyof ApplyState, true>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function field(key: keyof ApplyState, val: string) {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(e => { const n = { ...e }; delete n[key]; return n; });
  }

  function validate() {
    const e: typeof errors = {};
    if (!form.first_name.trim()) e.first_name = true;
    if (!form.last_name.trim())  e.last_name  = true;
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setServerError(null);
    const { error } = await supabase.from('job_applications').insert({
      job_id:       jobId,
      first_name:   form.first_name,
      last_name:    form.last_name,
      email:        form.email,
      phone:        form.phone        || null,
      cover_letter: form.cover_letter || null,
    });
    if (error) setServerError(error.message);
    else setSubmitted(true);
    setSubmitting(false);
  }

  const inputCls = (err?: boolean) => cn(
    'w-full bg-white/[0.04] border px-3 py-2.5 text-white text-[13px] outline-none transition-colors placeholder:text-white/15',
    err ? 'border-red-500/40' : 'border-white/[0.08] focus:border-white/25',
  );

  if (submitted) {
    return (
      <div className="border border-white/[0.08] p-6 text-center">
        <p className="text-[11px] uppercase tracking-[0.15em] text-white/30 font-semibold mb-2">Application received</p>
        <p className="text-[13px] text-white/50 leading-relaxed">Thank you! We'll be in touch shortly.</p>
      </div>
    );
  }

  return (
    <div className="border border-white/[0.08] p-6">
      <p className="text-[11px] uppercase tracking-[0.15em] text-white/28 font-semibold mb-2">Interested?</p>
      <h3 className="text-[16px] font-semibold text-white mb-5 leading-snug">Apply for this role</h3>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <input
            placeholder="First name *"
            value={form.first_name}
            onChange={e => field('first_name', e.target.value)}
            className={inputCls(errors.first_name)}
          />
          <input
            placeholder="Last name *"
            value={form.last_name}
            onChange={e => field('last_name', e.target.value)}
            className={inputCls(errors.last_name)}
          />
        </div>
        <input
          type="email"
          placeholder="Email *"
          value={form.email}
          onChange={e => field('email', e.target.value)}
          className={inputCls(errors.email)}
        />
        <input
          type="tel"
          placeholder="Phone"
          value={form.phone}
          onChange={e => field('phone', e.target.value)}
          className={inputCls()}
        />
        <textarea
          placeholder="Cover letter (optional)"
          value={form.cover_letter}
          onChange={e => field('cover_letter', e.target.value)}
          rows={4}
          className={cn(inputCls(), 'resize-none')}
        />
        {serverError && <p className="text-[11px] text-red-400/70">{serverError}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full px-5 py-3 bg-white text-black text-[13px] font-semibold hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1"
        >
          {submitting ? 'Submitting…' : 'Apply now'}
        </button>
      </form>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function CareerDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [job, setJob]       = useState<JobPosting | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    CareerService.getJob(slug)
      .then((data) => {
        if (!data) setNotFound(true);
        else setJob(data);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingSkeleton />;

  if (notFound || !job) {
    return (
      <div className="min-h-screen bg-[#060606] pt-[76px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/25 text-[14px] mb-4">This position is no longer available.</p>
          <Link to="/careers" className="text-[13px] text-white/45 hover:text-white/70 transition-colors underline underline-offset-2">
            Browse open roles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[76px] bg-[#060606] relative">
      <BackgroundBlobs />

      <div className="relative" style={{ zIndex: 1 }}>
        <Hero job={job} />

        <div className="max-w-[1240px] mx-auto px-10 py-16 grid lg:grid-cols-[1fr_300px] gap-16">
          {/* Main content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-w-0"
          >
            {job.description ? (
              <div className="flex flex-col gap-6">
                {renderContent(job.description)}
              </div>
            ) : (
              <p className="text-white/30 text-[14px]">No description available.</p>
            )}
          </motion.article>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-8"
          >
            {/* Apply form */}
            <ApplyForm jobId={job.id} />

            {/* Details */}
            <div className="border border-white/[0.08] p-6 flex flex-col gap-4">
              <p className="text-[11px] uppercase tracking-[0.15em] text-white/28 font-semibold">Details</p>

              <div>
                <p className="text-[10px] uppercase tracking-[0.1em] text-white/25 mb-1">Workplace</p>
                <p className="text-[13px] text-white/70">{job.workplace_type}</p>
              </div>

              {job.city && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.1em] text-white/25 mb-1">Location</p>
                  <p className="text-[13px] text-white/70">{job.city}</p>
                </div>
              )}

              {job.specialization && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.1em] text-white/25 mb-1">Specialization</p>
                  <p className="text-[13px] text-white/70">{job.specialization}</p>
                </div>
              )}

              <div>
                <p className="text-[10px] uppercase tracking-[0.1em] text-white/25 mb-1">Relocation support</p>
                <p className="text-[13px] text-white/70">{job.open_to_relocation ? 'Yes' : 'No'}</p>
              </div>
            </div>

            {/* Skills */}
            {job.skills.length > 0 && (
              <div className="border border-white/[0.08] p-6">
                <p className="text-[11px] uppercase tracking-[0.15em] text-white/28 font-semibold mb-4">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span key={skill} className="px-3 py-1.5 border border-white/[0.10] text-[12px] text-white/50 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Back link */}
            <button
              onClick={() => navigate('/careers')}
              className="flex items-center gap-2 text-[12px] text-white/30 hover:text-white/60 transition-colors"
            >
              <ArrowLeft size={13} />
              All open roles
            </button>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}
