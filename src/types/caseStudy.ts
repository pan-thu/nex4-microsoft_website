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
