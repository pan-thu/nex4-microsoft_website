import { cn } from '@/lib/utils';
import { BLOG_CATEGORIES, CONTENT_DATE_FILTERS } from '@/lib/blogConstants';
import type { BlogCategory, ContentDateFilter, BlogUIFilters } from '@/types/blog';

interface Props {
  filters: BlogUIFilters;
  onChange: (filters: BlogUIFilters) => void;
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'shrink-0 text-[11px] font-medium px-3 py-1 rounded-full border transition-all duration-200',
        active
          ? 'bg-white text-black border-white'
          : 'border-white/15 text-white/45 hover:border-white/35 hover:text-white/80',
      )}
    >
      {children}
    </button>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="shrink-0 text-[9px] uppercase tracking-[0.18em] text-white/25 font-semibold">
      {children}
    </span>
  );
}

export function BlogFilters({ filters, onChange }: Props) {
  function setCategory(value: BlogCategory | undefined) {
    onChange({ ...filters, category: value });
  }
  function setDate(value: ContentDateFilter) {
    onChange({ ...filters, date: value });
  }

  return (
    <div className="flex flex-wrap gap-x-5 gap-y-3 items-center">
      {/* Date */}
      <div className="flex items-center gap-2.5">
        <GroupLabel>When</GroupLabel>
        <div className="flex gap-1.5">
          {CONTENT_DATE_FILTERS.map(d => (
            <Pill
              key={d.value}
              active={filters.date === d.value}
              onClick={() => setDate(d.value)}
            >
              {d.label}
            </Pill>
          ))}
        </div>
      </div>

      <div className="w-px h-5 bg-white/10 hidden sm:block" />

      {/* Topic */}
      <div className="flex items-center gap-2.5 min-w-0">
        <GroupLabel>Topic</GroupLabel>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          <Pill active={!filters.category} onClick={() => setCategory(undefined)}>All</Pill>
          {BLOG_CATEGORIES.map(c => (
            <Pill
              key={c.value}
              active={filters.category === c.value}
              onClick={() => setCategory(filters.category === c.value ? undefined : c.value)}
            >
              {c.label}
            </Pill>
          ))}
        </div>
      </div>
    </div>
  );
}
