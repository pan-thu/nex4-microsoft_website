export type BlogCategory =
  | 'workplace-productivity'
  | 'workplace-security'
  | 'workplace-ai'
  | 'workplace-automation'
  | 'workplace-backup'
  | 'cloud-migration';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  hero_image_url: string | null;
  category: BlogCategory;
  tags: string[];
  author_name: string;
  author_title: string | null;
  author_avatar_url: string | null;
  reading_time: number | null;
  published_at: string;
  created_at: string;
}

export type NewsCategory =
  | 'company'
  | 'partnership'
  | 'product'
  | 'industry'
  | 'awards';

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  hero_image_url: string | null;
  category: NewsCategory;
  published_at: string;
  created_at: string;
  reading_time: number | null;
  author_name: string | null;
  author_title: string | null;
  author_avatar_url: string | null;
}

export type ContentDateFilter = 'all' | 'week' | 'month' | 'quarter' | 'year';

export interface BlogUIFilters {
  category?: BlogCategory;
  date: ContentDateFilter;
}

export interface NewsUIFilters {
  category?: NewsCategory;
  date: ContentDateFilter;
}
