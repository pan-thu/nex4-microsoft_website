import { supabase } from '@/lib/supabase';
import type { CaseStudyRow, CaseStudyFull, CaseStudyCategory, CaseStudyApproachStep, CaseStudyResult, CaseStudyTestimonial } from '@/types/caseStudy';

function mapRow(row: CaseStudyRow): CaseStudyFull {
  return {
    slug:          row.slug,
    client:        row.client,
    industry:      row.industry,
    category:      row.category as CaseStudyCategory,
    title:         row.title,
    excerpt:       row.excerpt,
    image:         row.image_url ?? '',
    challenge:     row.challenge,
    approachIntro: row.approach_intro,
    approach:      (row.approach as CaseStudyApproachStep[]) ?? [],
    technologies:  row.technologies ?? [],
    resultsIntro:  row.results_intro,
    results:       (row.results as CaseStudyResult[]) ?? [],
    testimonial:   row.testimonial as CaseStudyTestimonial | undefined,
    relatedService: (row.related_service as { title: string; slug: string }) ?? { title: '', slug: '' },
  };
}

export const CaseStudyService = {
  async getAll(): Promise<CaseStudyFull[]> {
    const { data } = await supabase
      .from('case_studies')
      .select('*')
      .order('created_at', { ascending: false });
    return (data as CaseStudyRow[] ?? []).map(mapRow);
  },

  async getAllRows(): Promise<CaseStudyRow[]> {
    const { data } = await supabase
      .from('case_studies')
      .select('*')
      .order('created_at', { ascending: false });
    return (data as CaseStudyRow[]) ?? [];
  },

  async getBySlug(slug: string): Promise<CaseStudyFull | null> {
    const { data } = await supabase
      .from('case_studies')
      .select('*')
      .eq('slug', slug)
      .single();
    if (!data) return null;
    return mapRow(data as CaseStudyRow);
  },
};
