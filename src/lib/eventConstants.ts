import type { EventCategory, EventType, DateFilter } from '@/types/events';

export const EVENT_CATEGORIES: { value: EventCategory; label: string }[] = [
  { value: 'workplace-productivity', label: 'Workplace Productivity' },
  { value: 'workplace-security',     label: 'Workplace Security' },
  { value: 'workplace-ai',           label: 'Workplace AI' },
  { value: 'workplace-automation',   label: 'Workplace Automation' },
  { value: 'workplace-backup',       label: 'Workplace Backup' },
  { value: 'cloud-migration',        label: 'Cloud Migration' },
];

export const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: 'webinar',  label: 'Webinar' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'event',    label: 'Event' },
];

export const DATE_FILTERS: { value: DateFilter; label: string }[] = [
  { value: 'all',     label: 'Any Time' },
  { value: 'week',    label: 'This Week' },
  { value: 'month',   label: 'This Month' },
  { value: 'quarter', label: 'Next 3 Months' },
];

export const CATEGORY_SHORT: Record<string, string> = {
  'workplace-productivity': 'Productivity',
  'workplace-security':     'Security',
  'workplace-ai':           'AI',
  'workplace-automation':   'Automation',
  'workplace-backup':       'Backup',
  'cloud-migration':        'Cloud',
};

export const TYPE_LABEL: Record<string, string> = {
  webinar:  'Webinar',
  workshop: 'Workshop',
  event:    'Event',
};
