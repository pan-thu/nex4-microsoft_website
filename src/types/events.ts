export type EventCategory =
  | 'workplace-productivity'
  | 'workplace-security'
  | 'workplace-ai'
  | 'workplace-automation'
  | 'workplace-backup'
  | 'cloud-migration';

export type EventType = 'webinar' | 'workshop' | 'event';
export type EventStatus = 'upcoming' | 'on_demand';

export interface KeyTakeaway {
  icon: string;
  text: string;
}

export interface EventSpeaker {
  name: string;
  title?: string;
  photo_url: string | null;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  key_takeaways: KeyTakeaway[];
  speakers: EventSpeaker[];
  hero_image_url: string | null;
  category: EventCategory;
  type: EventType;
  status: EventStatus;
  event_date: string | null;
  created_at: string;
}

export interface Registration {
  id: string;
  event_id: string;
  first_name: string;
  last_name: string;
  email: string;
  company_name: string | null;
  job_title: string | null;
  country: string;
  registered_at: string;
}

export interface RegistrationInput {
  event_id: string;
  first_name: string;
  last_name: string;
  email: string;
  company_name?: string;
  job_title?: string;
  country: string;
}

export type DateFilter = 'all' | 'week' | 'month' | 'quarter';

export interface EventFilters {
  category?: EventCategory;
  type?: EventType;
  status?: EventStatus;
}

export interface UIFilters {
  category?: EventCategory;
  type?: EventType;
  date: DateFilter;
}
