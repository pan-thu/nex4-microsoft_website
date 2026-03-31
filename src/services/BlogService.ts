import { supabase } from '@/lib/supabase';
import type { BlogPost, NewsArticle, BlogCategory, NewsCategory } from '@/types/blog';

export const BlogService = {
  async getPosts(filters: { category?: BlogCategory } = {}): Promise<BlogPost[]> {
    let query = supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false });
    if (filters.category) query = query.eq('category', filters.category);
    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  },

  async getPost(slug: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error) throw error;
    return data;
  },

  async getRelatedPosts(category: BlogCategory, excludeSlug: string): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('category', category)
      .neq('slug', excludeSlug)
      .order('published_at', { ascending: false })
      .limit(3);
    if (error) throw error;
    return data ?? [];
  },
};

export const NewsService = {
  async getArticles(filters: { category?: NewsCategory } = {}): Promise<NewsArticle[]> {
    let query = supabase
      .from('news_articles')
      .select('*')
      .order('published_at', { ascending: false });
    if (filters.category) query = query.eq('category', filters.category);
    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  },

  async getArticle(slug: string): Promise<NewsArticle | null> {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error) throw error;
    return data;
  },

  async getRelatedArticles(category: NewsCategory, excludeSlug: string): Promise<NewsArticle[]> {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('category', category)
      .neq('slug', excludeSlug)
      .order('published_at', { ascending: false })
      .limit(3);
    if (error) throw error;
    return data ?? [];
  },
};
