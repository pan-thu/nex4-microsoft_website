import type { BlogCategory, NewsCategory, ContentDateFilter } from '@/types/blog';

export const BLOG_CATEGORIES: { value: BlogCategory; label: string }[] = [
  { value: 'workplace-productivity', label: 'Workplace Productivity' },
  { value: 'workplace-security',     label: 'Workplace Security' },
  { value: 'workplace-ai',           label: 'Workplace AI' },
  { value: 'workplace-automation',   label: 'Workplace Automation' },
  { value: 'workplace-backup',       label: 'Workplace Backup' },
  { value: 'cloud-migration',        label: 'Cloud Migration' },
];

export const NEWS_CATEGORIES: { value: NewsCategory; label: string }[] = [
  { value: 'company',     label: 'Company' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'product',     label: 'Product' },
  { value: 'industry',    label: 'Industry' },
  { value: 'awards',      label: 'Awards' },
];

export const CONTENT_DATE_FILTERS: { value: ContentDateFilter; label: string }[] = [
  { value: 'all',     label: 'All Time' },
  { value: 'week',    label: 'This Week' },
  { value: 'month',   label: 'This Month' },
  { value: 'quarter', label: 'This Quarter' },
  { value: 'year',    label: 'This Year' },
];

export const BLOG_CATEGORY_LABEL: Record<BlogCategory, string> = {
  'workplace-productivity': 'Productivity',
  'workplace-security':     'Security',
  'workplace-ai':           'AI',
  'workplace-automation':   'Automation',
  'workplace-backup':       'Backup',
  'cloud-migration':        'Cloud',
};

export const NEWS_CATEGORY_LABEL: Record<NewsCategory, string> = {
  company:     'Company',
  partnership: 'Partnership',
  product:     'Product',
  industry:    'Industry',
  awards:      'Awards',
};
