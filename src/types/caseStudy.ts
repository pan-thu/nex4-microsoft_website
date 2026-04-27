// ── Supabase row (snake_case) ─────────────────────────────────────────────────

export interface CaseStudyRow {
  id: string;
  slug: string;
  client: string;
  industry: string;
  category: string;
  title: string;
  excerpt: string;
  image_url: string | null;
  challenge: string;
  approach_intro: string;
  approach: unknown;      // JSONB: CaseStudyApproachStep[]
  technologies: string[];
  results_intro: string;
  results: unknown;       // JSONB: CaseStudyResult[]
  testimonial: unknown;   // JSONB: CaseStudyTestimonial | null
  related_service: unknown; // JSONB: { title: string; slug: string }
  created_at: string;
}

export type CaseStudyCategory =
  | 'workplace-productivity'
  | 'workplace-security'
  | 'workplace-ai'
  | 'workplace-automation'
  | 'workplace-backup'
  | 'cloud-migration';

export interface CaseStudyResult {
  value: string;
  suffix?: string;
  label: string;
}

export interface CaseStudyApproachStep {
  title: string;
  body: string;
}

export interface CaseStudyTestimonial {
  quote: string;
  name: string;
  title: string;
  photo_url?: string;
}

export interface CaseStudyFull {
  slug: string;
  client: string;
  industry: string;
  category: CaseStudyCategory;
  title: string;
  excerpt: string;
  image: string;
  challenge: string;
  approachIntro: string;
  approach: CaseStudyApproachStep[];
  technologies: string[];
  resultsIntro: string;
  results: CaseStudyResult[];
  testimonial?: CaseStudyTestimonial;
  relatedService: { title: string; slug: string };
}
