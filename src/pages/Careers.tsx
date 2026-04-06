import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { CareerService } from '@/services/CareerService';
import { BackgroundBlobs } from '@/components/common/BackgroundBlobs';
import { cn } from '@/lib/utils';
import type { JobPosting, CareerFilters } from '@/types/career';

// ── Helpers ───────────────────────────────────────────────────────────────────

const EMPTY_FILTERS: CareerFilters = {
  workplaceTypes: [],
  cities: [],
  relocation: [],
  specializations: [],
  skills: [],
};

function countBy<T>(items: T[], key: (item: T) => string): Record<string, number> {
  return items.reduce<Record<string, number>>((acc, item) => {
    const k = key(item);
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});
}

function applyFilters(jobs: JobPosting[], filters: CareerFilters): JobPosting[] {
  return jobs.filter((job) => {
    if (filters.workplaceTypes.length > 0 && !filters.workplaceTypes.includes(job.workplace_type)) return false;
    if (filters.cities.length > 0 && !filters.cities.includes(job.city)) return false;
    if (filters.relocation.length > 0) {
      const val = job.open_to_relocation ? 'Yes' : 'No';
      if (!filters.relocation.includes(val)) return false;
    }
    if (filters.specializations.length > 0 && !filters.specializations.includes(job.specialization)) return false;
    if (filters.skills.length > 0 && !filters.skills.some((s) => job.skills.includes(s))) return false;
    return true;
  });
}

// ── Filter Sidebar ────────────────────────────────────────────────────────────

interface FilterGroupProps {
  label: string;
  options: { value: string; count: number }[];
  selected: string[];
  onChange: (values: string[]) => void;
}

function FilterGroup({ label, options, selected, onChange }: FilterGroupProps) {
  if (options.length === 0) return null;

  function toggle(value: string) {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value],
    );
  }

  return (
    <div className="mb-7">
      <p className="text-[10px] uppercase tracking-[0.18em] text-white/28 font-semibold mb-3">{label}</p>
      <div className="flex flex-col gap-2">
        {options.map(({ value, count }) => {
          const active = selected.includes(value);
          return (
            <button
              key={value}
              onClick={() => toggle(value)}
              className="flex items-center gap-2.5 text-left group"
            >
              {/* Custom checkbox */}
              <span className={cn(
                'w-3.5 h-3.5 shrink-0 border transition-all duration-150',
                active
                  ? 'border-white bg-white'
                  : 'border-white/20 group-hover:border-white/40',
              )}>
                {active && (
                  <svg viewBox="0 0 10 8" fill="none" className="w-full h-full p-[1px]">
                    <path d="M1 4l2.5 2.5L9 1" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span className={cn(
                'flex-1 text-[12px] transition-colors duration-150',
                active ? 'text-white' : 'text-white/40 group-hover:text-white/65',
              )}>
                {value}
              </span>
              <span className={cn(
                'text-[11px] tabular-nums transition-colors duration-150',
                active ? 'text-white/40' : 'text-white/20',
              )}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface FilterSidebarProps {
  jobs: JobPosting[];
  filters: CareerFilters;
  onChange: (f: CareerFilters) => void;
  resultCount: number;
}

function FilterSidebar({ jobs, filters, onChange, resultCount }: FilterSidebarProps) {
  const hasFilters = Object.values(filters).some((v) => v.length > 0);

  // Compute option counts from the FULL unfiltered list
  const workplaceTypeCounts = useMemo(() => countBy(jobs, (j) => j.workplace_type), [jobs]);
  const cityCounts          = useMemo(() => countBy(jobs, (j) => j.city), [jobs]);
  const relocationCounts    = useMemo(() => countBy(jobs, (j) => (j.open_to_relocation ? 'Yes' : 'No')), [jobs]);
  const specializationCounts = useMemo(() => countBy(jobs.filter(j => j.specialization), (j) => j.specialization), [jobs]);
  const skillCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    jobs.forEach((j) => j.skills.forEach((s) => { counts[s] = (counts[s] ?? 0) + 1; }));
    return counts;
  }, [jobs]);

  function toOptions(counts: Record<string, number>) {
    return Object.entries(counts)
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count);
  }

  function set<K extends keyof CareerFilters>(key: K, values: string[]) {
    onChange({ ...filters, [key]: values });
  }

  return (
    <aside className="hidden lg:block w-[260px] shrink-0">
      <div className="sticky top-[76px] flex flex-col pt-14 pb-10 pl-10 pr-4 overflow-y-auto max-h-[calc(100vh-76px)]">

        {/* Result count + clear */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-[11px] text-white/30">
            <span className="text-white font-medium tabular-nums">{resultCount}</span> {resultCount === 1 ? 'role' : 'roles'}
          </p>
          {hasFilters && (
            <button
              onClick={() => onChange(EMPTY_FILTERS)}
              className="text-[10px] text-white/25 hover:text-white/55 transition-colors underline underline-offset-2"
            >
              Clear all
            </button>
          )}
        </div>

        <FilterGroup
          label="Workplace type"
          options={toOptions(workplaceTypeCounts)}
          selected={filters.workplaceTypes}
          onChange={(v) => set('workplaceTypes', v)}
        />

        <FilterGroup
          label="City"
          options={toOptions(cityCounts)}
          selected={filters.cities}
          onChange={(v) => set('cities', v)}
        />

        <FilterGroup
          label="Open to relocation"
          options={toOptions(relocationCounts)}
          selected={filters.relocation}
          onChange={(v) => set('relocation', v)}
        />

        <FilterGroup
          label="Specializations"
          options={toOptions(specializationCounts)}
          selected={filters.specializations}
          onChange={(v) => set('specializations', v)}
        />

        <FilterGroup
          label="Skills"
          options={toOptions(skillCounts)}
          selected={filters.skills}
          onChange={(v) => set('skills', v)}
        />
      </div>
    </aside>
  );
}

// ── Job Card ──────────────────────────────────────────────────────────────────

function JobCard({ job, index }: { job: JobPosting; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  const visibleSkills = job.skills.slice(0, 1);
  const extraSkills   = job.skills.length - visibleSkills.length;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="border-t border-white/[0.05] group"
    >
      <Link to={`/careers/${job.slug}`} className="block py-8 pr-6">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            {/* HOT badge */}
            {job.is_hot && (
              <span className="inline-block mb-3 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white rounded-full"
                style={{ background: 'linear-gradient(90deg, #7c3aed, #2563eb)' }}>
                Hot
              </span>
            )}

            {/* Title */}
            <h3 className="text-[22px] font-semibold text-white group-hover:text-white/85 transition-colors leading-snug mb-3">
              {job.title}
            </h3>

            {/* Location & type */}
            <p className="text-[11px] uppercase tracking-[0.14em] font-semibold text-white/45 mb-1">
              {job.workplace_type} in {job.city}
            </p>

            {/* Specialization + skills */}
            {(job.specialization || job.skills.length > 0) && (
              <p className="text-[11px] uppercase tracking-[0.14em] font-semibold text-white/45 mb-5">
                {job.specialization}
                {job.specialization && job.skills.length > 0 && ' · '}
                {visibleSkills.join(', ')}
                {extraSkills > 0 && (
                  <span className="underline underline-offset-2 ml-1 cursor-default">
                    &amp; {extraSkills} other{extraSkills > 1 ? 's' : ''}
                  </span>
                )}
              </p>
            )}

            {/* Summary */}
            {job.summary && (
              <p className="text-[14px] text-white/45 leading-relaxed line-clamp-3 max-w-[640px]">
                {job.summary}
              </p>
            )}
          </div>

          {/* Chevron */}
          <div className="shrink-0 mt-1">
            <ChevronRight
              size={18}
              className="text-white/20 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all duration-200"
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative bg-black overflow-hidden" style={{ minHeight: 580 }}>
      {/* Decorative blobs */}
      <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(104,33,122,0.22) 0%, rgba(0,120,212,0.14) 50%, transparent 70%)', filter: 'blur(90px)' }} />
      <div className="absolute top-1/2 left-1/3 w-[360px] h-[360px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,188,242,0.10) 0%, transparent 65%)', filter: 'blur(70px)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)' }} />

      <div className="relative z-10 max-w-[1240px] mx-auto px-10 flex flex-col justify-end" style={{ minHeight: 580, paddingBottom: 80 }}>
        <nav className="flex items-center gap-2 mb-10">
          <Link to="/" className="text-[11px] text-white/30 hover:text-white/55 transition-colors">Home</Link>
          <ChevronRight size={11} className="text-white/20" />
          <span className="text-[11px] text-white/45">Careers</span>
        </nav>

        <p className="text-[10px] uppercase tracking-[0.24em] font-semibold text-white/35 mb-5">Careers at NEX4</p>
        <h1 className="text-[44px] lg:text-[58px] font-light leading-[1.08] text-white max-w-[640px] mb-7">
          Build your future<br />with us
        </h1>
        <p className="text-[16px] text-white/50 leading-relaxed max-w-[480px]">
          Join a team of driven professionals delivering cloud, security, and modern workplace solutions across Southeast Asia.
        </p>
      </div>
    </section>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="py-24 text-center border-t border-white/[0.05]">
      <p className="text-white/25 text-[14px] mb-4">No roles match your current filters.</p>
      <button
        onClick={onClear}
        className="text-[12px] text-white/35 hover:text-white/65 transition-colors underline underline-offset-2"
      >
        Clear filters
      </button>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="flex flex-col">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="border-t border-white/[0.05] py-8">
          <div className="h-4 w-16 bg-white/[0.05] rounded-full mb-3 animate-pulse" />
          <div className="h-7 w-72 bg-white/[0.06] mb-3 animate-pulse" />
          <div className="h-3 w-48 bg-white/[0.04] mb-5 animate-pulse" />
          <div className="h-4 w-full max-w-lg bg-white/[0.03] animate-pulse" />
        </div>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function Careers() {
  const [jobs, setJobs]       = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CareerFilters>(EMPTY_FILTERS);

  useEffect(() => {
    CareerService.getJobs()
      .then(setJobs)
      .finally(() => setLoading(false));
  }, []);

  const filteredJobs = useMemo(() => applyFilters(jobs, filters), [jobs, filters]);

  return (
    <div className="pt-[76px] bg-[#060606] relative">
      <BackgroundBlobs />

      <div className="relative" style={{ zIndex: 1 }}>
        <Hero />

        <div className="max-w-[1400px] mx-auto flex">
          <FilterSidebar
            jobs={jobs}
            filters={filters}
            onChange={setFilters}
            resultCount={filteredJobs.length}
          />

          <main className="flex-1 min-w-0 py-14 pr-10 lg:pr-14">
            {loading ? (
              <Skeleton />
            ) : filteredJobs.length === 0 ? (
              <EmptyState onClear={() => setFilters(EMPTY_FILTERS)} />
            ) : (
              <div>
                {filteredJobs.map((job, i) => (
                  <JobCard key={job.id} job={job} index={i} />
                ))}
                {/* Final border */}
                <div className="border-t border-white/[0.05]" />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
