import { supabase } from '@/lib/supabase';
import type { Event, EventFilters, Registration, RegistrationInput } from '@/types/events';

export const EventService = {
  async getEvents(filters: EventFilters = {}): Promise<Event[]> {
    let query = supabase.from('events').select('*').order('event_date', { ascending: true });
    if (filters.category) query = query.eq('category', filters.category);
    if (filters.type)     query = query.eq('type', filters.type);
    if (filters.status)   query = query.eq('status', filters.status);
    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  },

  async getEvent(slug: string): Promise<Event | null> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error) throw error;
    return data;
  },

  async createRegistration(input: RegistrationInput): Promise<void> {
    const { error } = await supabase.from('registrations').insert(input);
    if (error) throw error;
  },

  // Admin methods (require authenticated session)
  async createEvent(event: Omit<Event, 'id' | 'created_at'>): Promise<Event> {
    const { data, error } = await supabase.from('events').insert(event).select().single();
    if (error) throw error;
    return data;
  },

  async updateEvent(id: string, updates: Partial<Event>): Promise<Event> {
    const { data, error } = await supabase.from('events').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteEvent(id: string): Promise<void> {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) throw error;
  },

  async getRegistrations(eventId: string): Promise<Registration[]> {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('event_id', eventId)
      .order('registered_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async uploadImage(file: File): Promise<string> {
    const ext = file.name.split('.').pop();
    const path = `events/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('assets').upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from('assets').getPublicUrl(path);
    return data.publicUrl;
  },
};
