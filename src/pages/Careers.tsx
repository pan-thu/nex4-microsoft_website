import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { CareerService } from '@/services/CareerService';
import { BackgroundBlobs } from '@/components/common/BackgroundBlobs';
import { ASSETS } from '@/lib/assets';
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
    <div className="mb-6">
      <p className="text-[9px] uppercase tracking-[0.2em] text-white/20 font-semibold mb-2.5">{label}</p>
      <div className="flex flex-col gap-0.5">
        {options.map(({ value, count }) => {
          const active = selected.includes(value);
          return (
            <button
              key={value}
              onClick={() => toggle(value)}
              className={cn(
                'flex items-center justify-between text-left px-0 py-1.5 transition-colors duration-150 group',
              )}
            >
              <span className={cn(
                'text-[12px] transition-colors duration-150',
                active ? 'text-white font-medium' : 'text-white/35 group-hover:text-white/60',
              )}>
                {active && <span className="mr-2 text-white/50">—</span>}
                {value}
              </span>
              <span className={cn(
                'text-[10px] tabular-nums transition-colors duration-150 ml-3',
                active ? 'text-white/35' : 'text-white/15',
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
}

function FilterSidebar({ jobs, filters, onChange }: FilterSidebarProps) {
  const hasFilters = Object.values(filters).some((v) => v.length > 0);

  // Compute option counts from the FULL unfiltered list
  const workplaceTypeCounts  = useMemo(() => countBy(jobs, (j) => j.workplace_type), [jobs]);
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
    <aside className="hidden lg:block w-[220px] shrink-0">
      <div className="flex flex-col pt-14 pb-10 pl-8 pr-4">

        {/* Clear all */}
        {hasFilters && (
          <div className="flex justify-end mb-6">
            <button
              onClick={() => onChange(EMPTY_FILTERS)}
              className="text-[10px] text-white/25 hover:text-white/55 transition-colors underline underline-offset-2"
            >
              Clear all
            </button>
          </div>
        )}

        <FilterGroup
          label="Workplace type"
          options={toOptions(workplaceTypeCounts)}
          selected={filters.workplaceTypes}
          onChange={(v) => set('workplaceTypes', v)}
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
      className="border-t border-white/[0.05] group first:border-t-0"
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
      {/* Background image */}
      <img
        src={ASSETS.scene5}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      {/* Gradient overlays */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.60) 55%, rgba(0,0,0,0.30) 100%)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.70) 0%, transparent 50%)' }} />

      <div className="relative z-10 max-w-[1240px] mx-auto px-8 flex flex-col justify-end" style={{ minHeight: 580, paddingBottom: 80 }}>
        <nav className="flex items-center gap-2 mb-10">
          <Link to="/" className="text-[11px] text-white/30 hover:text-white/55 transition-colors">Home</Link>
          <ChevronRight size={11} className="text-white/20" />
          <span className="text-[11px] text-white/45">Careers</span>
        </nav>

        <p className="text-[10px] uppercase tracking-[0.24em] font-semibold text-white/35 mb-5">Careers at NEX4</p>
        <h1 className="text-[46px] lg:text-[62px] font-semibold leading-tight text-white max-w-[640px] mb-7">
          Build your <span className="gradient-text">future.</span><br />
          <span className="font-light">Grow with <span className="gradient-text">us.</span></span>
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

        <div className="max-w-[1240px] mx-auto w-full flex">
          <FilterSidebar
            jobs={jobs}
            filters={filters}
            onChange={setFilters}
          />

          <main className="flex-1 min-w-0 py-14 pl-12 pr-10">
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
