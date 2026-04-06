export type WorkplaceType = 'Hybrid' | 'Office' | 'Remote';
export type JobStatus = 'active' | 'closed';

export interface JobPosting {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  description: string | null;
  hero_image_url: string | null;
  workplace_type: WorkplaceType;
  city: string;
  open_to_relocation: boolean;
  specialization: string;
  skills: string[];
  is_hot: boolean;
  status: JobStatus;
  created_at: string;
}

export interface CareerFilters {
  workplaceTypes: string[];
  cities: string[];
  relocation: string[];       // 'Yes' | 'No'
  specializations: string[];
  skills: string[];
}
