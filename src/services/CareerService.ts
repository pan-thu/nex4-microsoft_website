import { supabase } from '@/lib/supabase';
import type { JobPosting } from '@/types/career';

export const CareerService = {
  async getJobs(): Promise<JobPosting[]> {
    const { data, error } = await supabase
      .from('job_postings')
      .select('*')
      .eq('status', 'active')
      .order('is_hot', { ascending: false })
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async getAllJobs(): Promise<JobPosting[]> {
    const { data, error } = await supabase
      .from('job_postings')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async getJob(slug: string): Promise<JobPosting | null> {
    const { data, error } = await supabase
      .from('job_postings')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'active')
      .single();
    if (error) throw error;
    return data;
  },
};
