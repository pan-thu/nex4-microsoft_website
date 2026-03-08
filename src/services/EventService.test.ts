import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Supabase client before importing EventService
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
    storage: { from: vi.fn() },
    auth: { signInWithPassword: vi.fn(), signOut: vi.fn(), getSession: vi.fn() },
  },
}));

import { EventService } from './EventService';
import { supabase } from '@/lib/supabase';

const mockEvent = {
  id: 'abc-123',
  title: 'Test Event',
  slug: 'test-event',
  description: 'A test event',
  key_takeaways: [],
  hero_image_url: null,
  category: 'workplace-ai' as const,
  type: 'webinar' as const,
  status: 'upcoming' as const,
  event_date: null,
  created_at: new Date().toISOString(),
};

describe('EventService.getEvents', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns events on success', async () => {
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: [mockEvent], error: null }),
      }),
    });

    const result = await EventService.getEvents();
    expect(result).toEqual([mockEvent]);
  });

  it('returns empty array when data is null', async () => {
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
    });

    const result = await EventService.getEvents();
    expect(result).toEqual([]);
  });

  it('throws on Supabase error', async () => {
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: null, error: new Error('DB error') }),
      }),
    });

    await expect(EventService.getEvents()).rejects.toThrow('DB error');
  });

  it('applies category filter', async () => {
    const eqMock = vi.fn().mockResolvedValue({ data: [mockEvent], error: null });
    const orderMock = vi.fn().mockReturnValue({ eq: eqMock });
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      select: vi.fn().mockReturnValue({ order: orderMock }),
    });

    await EventService.getEvents({ category: 'workplace-ai' });
    expect(eqMock).toHaveBeenCalledWith('category', 'workplace-ai');
  });
});

describe('EventService.createRegistration', () => {
  beforeEach(() => vi.clearAllMocks());

  it('inserts registration without throwing', async () => {
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      insert: vi.fn().mockResolvedValue({ error: null }),
    });

    await expect(
      EventService.createRegistration({
        event_id: 'abc-123',
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane@example.com',
        country: 'Myanmar',
      })
    ).resolves.toBeUndefined();
  });

  it('throws when Supabase returns an error', async () => {
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      insert: vi.fn().mockResolvedValue({ error: new Error('Insert failed') }),
    });

    await expect(
      EventService.createRegistration({
        event_id: 'abc-123',
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane@example.com',
        country: 'Myanmar',
      })
    ).rejects.toThrow('Insert failed');
  });
});

describe('EventService.getEvent', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns event by slug', async () => {
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockEvent, error: null }),
        }),
      }),
    });

    const result = await EventService.getEvent('test-event');
    expect(result).toEqual(mockEvent);
  });

  it('throws when event not found', async () => {
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: new Error('Not found') }),
        }),
      }),
    });

    await expect(EventService.getEvent('missing')).rejects.toThrow('Not found');
  });
});
