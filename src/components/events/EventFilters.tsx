import { cn } from '@/lib/utils';
import { EVENT_CATEGORIES, EVENT_TYPES, DATE_FILTERS } from '@/lib/eventConstants';
import type { EventCategory, EventType, DateFilter, UIFilters } from '@/types/events';

interface Props {
  filters: UIFilters;
  onChange: (filters: UIFilters) => void;
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
        'shrink-0 text-[12px] font-medium px-3 py-1 rounded-full border transition-all duration-200',
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
    <span className="shrink-0 text-[11px] uppercase tracking-[0.18em] text-white/25 font-semibold">
      {children}
    </span>
  );
}

export function EventFilters({ filters, onChange }: Props) {
  function setType(value: EventType | undefined) {
    onChange({ ...filters, type: value });
  }
  function setDate(value: DateFilter) {
    onChange({ ...filters, date: value });
  }
  function setCategory(value: EventCategory | undefined) {
    onChange({ ...filters, category: value });
  }

  return (
    <div className="flex flex-wrap gap-x-5 gap-y-3 items-center">
      {/* Type */}
      <div className="flex items-center gap-2.5">
        <GroupLabel>Type</GroupLabel>
        <div className="flex gap-1.5">
          <Pill active={!filters.type} onClick={() => setType(undefined)}>All</Pill>
          {EVENT_TYPES.map(t => (
            <Pill
              key={t.value}
              active={filters.type === t.value}
              onClick={() => setType(filters.type === t.value ? undefined : t.value)}
            >
              {t.label}
            </Pill>
          ))}
        </div>
      </div>

      <div className="w-px h-5 bg-white/10 hidden sm:block" />

      {/* When */}
      <div className="flex items-center gap-2.5">
        <GroupLabel>When</GroupLabel>
        <div className="flex gap-1.5">
          {DATE_FILTERS.map(d => (
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
          {EVENT_CATEGORIES.map(c => (
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
