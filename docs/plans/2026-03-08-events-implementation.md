# Events Feature Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a full events system (landing page, registration page, admin dashboard) backed by Supabase, and migrate all existing static images to Supabase Storage.

**Architecture:** A `EventService` class in `src/services/EventService.ts` abstracts all DB access behind a single interface. In dev it uses the Supabase JS client directly from the browser. In prod it will call Lambda API endpoints. Switching is done via `VITE_USE_SUPABASE=true/false` — no component code changes needed. Admin is a protected `/admin` route within the existing React app.

**Tech Stack:** React 19, TypeScript, Supabase JS v2, React Hook Form + Zod (already installed), Tailwind CSS 4, Framer Motion 12, Lucide React, Vitest + Testing Library (to be installed).

---

### Task 1: Install Supabase JS + configure environment

**Files:**
- Modify: `package.json` (via npm)
- Create: `.env.local`
- Create: `.env.example`

**Step 1: Install Supabase JS client**

```bash
npm install @supabase/supabase-js
```

Expected: `added 1 package` (or similar), no errors.

**Step 2: Create `.env.local`**

```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
VITE_USE_SUPABASE=true
```

> Get these values from Supabase Dashboard → Project Settings → API.

**Step 3: Create `.env.example`** (safe to commit)

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_USE_SUPABASE=true
```

**Step 4: Ensure `.env.local` is gitignored**

Open `.gitignore` and verify it contains `.env.local`. If not, add it.

**Step 5: Commit**

```bash
git add .env.example package.json package-lock.json
git commit -m "feat: install supabase-js and add env config"
```

---

### Task 2: Create Supabase schema and storage bucket (manual Supabase step)

> This is a manual step done in Supabase Dashboard. No code to write.

**Step 1: Open Supabase Dashboard → SQL Editor and run:**

```sql
-- Events table
create table events (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  slug           text not null unique,
  description    text,
  key_takeaways  jsonb default '[]',
  hero_image_url text,
  category       text not null check (category in (
    'workplace-productivity','workplace-security','workplace-ai',
    'workplace-automation','workplace-backup','cloud-migration'
  )),
  type           text not null check (type in ('webinar','workshop','event')),
  status         text not null default 'upcoming' check (status in ('upcoming','on_demand')),
  event_date     timestamptz,
  created_at     timestamptz default now()
);

-- Registrations table
create table registrations (
  id             uuid primary key default gen_random_uuid(),
  event_id       uuid references events(id) on delete cascade,
  first_name     text not null,
  last_name      text not null,
  email          text not null,
  company_name   text,
  job_title      text,
  country        text not null,
  registered_at  timestamptz default now()
);

-- Row Level Security
alter table events enable row level security;
alter table registrations enable row level security;

-- Allow public read on events
create policy "events_public_read" on events
  for select using (true);

-- Allow public insert on registrations
create policy "registrations_public_insert" on registrations
  for insert with check (true);

-- Allow authenticated users full access (admin)
create policy "events_admin_all" on events
  for all using (auth.role() = 'authenticated');

create policy "registrations_admin_read" on registrations
  for select using (auth.role() = 'authenticated');
```

**Step 2: Create storage bucket**

In Supabase Dashboard → Storage → New bucket:
- Name: `assets`
- Public: ✅ enabled
- Allowed MIME types: `image/png, image/jpeg, image/webp`

**Step 3: Insert 2 seed events for development**

```sql
insert into events (title, slug, description, category, type, status, event_date) values
(
  'Securing Your Hybrid Workforce',
  'securing-hybrid-workforce',
  'Learn Zero Trust best practices for distributed teams using Microsoft Defender and Entra ID.',
  'workplace-security',
  'webinar',
  'upcoming',
  now() + interval '14 days'
),
(
  'Getting Started with Microsoft Copilot',
  'getting-started-copilot',
  'A hands-on workshop covering Copilot integration across M365 apps for daily productivity.',
  'workplace-ai',
  'workshop',
  'upcoming',
  now() + interval '30 days'
);
```

---

### Task 3: Supabase client init + EventService

**Files:**
- Create: `src/lib/supabase.ts`
- Create: `src/services/EventService.ts`
- Create: `src/types/events.ts`

**Step 1: Create types file `src/types/events.ts`**

```typescript
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

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  key_takeaways: KeyTakeaway[];
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

export interface EventFilters {
  category?: EventCategory;
  type?: EventType;
  status?: EventStatus;
}
```

**Step 2: Create Supabase client `src/lib/supabase.ts`**

```typescript
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!url || !key) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(url, key);
```

**Step 3: Create EventService `src/services/EventService.ts`**

```typescript
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
```

**Step 4: Run the dev server and verify no TypeScript errors**

```bash
npm run build 2>&1 | head -30
```

Expected: build succeeds with 0 errors.

**Step 5: Commit**

```bash
git add src/lib/supabase.ts src/services/EventService.ts src/types/events.ts
git commit -m "feat: add supabase client, EventService, and event types"
```

---

### Task 4: Install Vitest and test EventService

**Files:**
- Modify: `package.json` (via npm)
- Modify: `vite.config.ts`
- Create: `src/services/EventService.test.ts`

**Step 1: Install Vitest and Testing Library**

```bash
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

**Step 2: Add test script to `package.json`**

In the `scripts` section, add:
```json
"test": "vitest run",
"test:watch": "vitest"
```

**Step 3: Configure Vitest in `vite.config.ts`**

Add a `test` block. The full file should look like:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
  // existing build config...
});
```

**Step 4: Create `src/test/setup.ts`**

```typescript
import '@testing-library/jest-dom';
```

**Step 5: Create `src/services/EventService.test.ts`**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Supabase client before importing EventService
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
    storage: { from: vi.fn() },
  },
}));

import { EventService } from './EventService';
import { supabase } from '@/lib/supabase';

const mockEvent = {
  id: '1',
  title: 'Test Event',
  slug: 'test-event',
  description: 'desc',
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

  it('returns events array on success', async () => {
    const mockChain = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
    };
    (mockChain as any).then = undefined; // prevent auto-then
    // Make the final await return data
    Object.assign(mockChain, {
      then: undefined,
      [Symbol.toPrimitive]: undefined,
    });
    // Use a resolved-promise approach
    const selectFn = vi.fn().mockReturnValue({
      order: vi.fn().mockResolvedValue({ data: [mockEvent], error: null }),
    });
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({ select: selectFn });

    const result = await EventService.getEvents();
    expect(result).toEqual([mockEvent]);
  });

  it('throws on Supabase error', async () => {
    const selectFn = vi.fn().mockReturnValue({
      order: vi.fn().mockResolvedValue({ data: null, error: new Error('DB error') }),
    });
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({ select: selectFn });

    await expect(EventService.getEvents()).rejects.toThrow('DB error');
  });
});

describe('EventService.createRegistration', () => {
  it('inserts registration without throwing', async () => {
    const insertFn = vi.fn().mockResolvedValue({ error: null });
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({ insert: insertFn });

    await expect(
      EventService.createRegistration({
        event_id: '1',
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane@example.com',
        country: 'Myanmar',
      })
    ).resolves.toBeUndefined();
  });
});
```

**Step 6: Run tests**

```bash
npm test
```

Expected: all tests pass (green).

**Step 7: Commit**

```bash
git add vite.config.ts src/test/setup.ts src/services/EventService.test.ts package.json package-lock.json
git commit -m "test: add vitest setup and EventService unit tests"
```

---

### Task 5: Migrate public/images to Supabase Storage

**Files:**
- Create: `src/lib/assets.ts`
- Modify: `src/components/common/Navbar.tsx`
- Modify: `src/components/home/HeroSlider.tsx`

**Step 1: Upload images to Supabase Storage**

In Supabase Dashboard → Storage → `assets` bucket, create a folder `site/` and upload all files from `public/images/`:
- `card-bg-1.png` → `site/card-bg-1.png`
- `card-bg-2.png` → `site/card-bg-2.png`
- `card-bg-3.png` → `site/card-bg-3.png`
- `card-bg-4.png` → `site/card-bg-4.png`
- `card-bg-insights-1.png` → `site/card-bg-insights-1.png`
- `card-bg-insights-2.png` → `site/card-bg-insights-2.png`
- `hero-1.png` → `site/hero-1.png`
- `hero-2.png` → `site/hero-2.png`
- `hero-3.png` → `site/hero-3.png`
- `logo.png` → `site/logo.png`

After uploading, copy the public URL base — it will be: `https://YOUR_PROJECT_ID.supabase.co/storage/v1/object/public/assets`

**Step 2: Create `src/lib/assets.ts`**

```typescript
const BASE = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/assets/site`;

export const ASSETS = {
  logo:          `${BASE}/logo.png`,
  cardBg1:       `${BASE}/card-bg-1.png`,
  cardBg2:       `${BASE}/card-bg-2.png`,
  cardBg3:       `${BASE}/card-bg-3.png`,
  cardBg4:       `${BASE}/card-bg-4.png`,
  insightsBg1:   `${BASE}/card-bg-insights-1.png`,
  insightsBg2:   `${BASE}/card-bg-insights-2.png`,
  hero1:         `${BASE}/hero-1.png`,
  hero2:         `${BASE}/hero-2.png`,
  hero3:         `${BASE}/hero-3.png`,
};
```

**Step 3: Update `Navbar.tsx` — replace the `IMG` object**

Find:
```typescript
const IMG = {
  c1: '/images/card-bg-1.png',
  c2: '/images/card-bg-2.png',
  c3: '/images/card-bg-3.png',
  c4: '/images/card-bg-4.png',
  i1: '/images/card-bg-insights-1.png',
  i2: '/images/card-bg-insights-2.png',
};
```

Replace with:
```typescript
import { ASSETS } from '@/lib/assets';

const IMG = {
  c1: ASSETS.cardBg1,
  c2: ASSETS.cardBg2,
  c3: ASSETS.cardBg3,
  c4: ASSETS.cardBg4,
  i1: ASSETS.insightsBg1,
  i2: ASSETS.insightsBg2,
};
```

**Step 4: Update `HeroSlider.tsx`** — find any `/images/hero-*.png` references and replace with `ASSETS.hero1`, `ASSETS.hero2`, `ASSETS.hero3`. Also update logo reference in `Navbar.tsx` from `/images/logo.png` to `ASSETS.logo`.

**Step 5: Verify visually**

```bash
npm run dev
```

Open `http://localhost:3000` — confirm all images still load (navbar card images, hero slides, logo).

**Step 6: Commit**

```bash
git add src/lib/assets.ts src/components/common/Navbar.tsx src/components/home/HeroSlider.tsx
git commit -m "feat: migrate static images to Supabase Storage"
```

---

### Task 6: Add routes to App.tsx

**Files:**
- Modify: `src/App.tsx`

**Step 1: Add imports and routes**

Replace the contents of `src/App.tsx`:

```typescript
import { Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { ScrollProgress } from '@/components/common/ScrollProgress';
import { BackToTop } from '@/components/common/BackToTop';
import { Home } from '@/pages/Home';
import { Events } from '@/pages/Events';
import { EventRegistration } from '@/pages/EventRegistration';
import { AdminLogin } from '@/pages/admin/AdminLogin';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollProgress />
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:slug" element={<EventRegistration />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}

export default App;
```

**Step 2: Create placeholder page files** (so the app doesn't crash while other tasks are in progress)

Create `src/pages/Events.tsx`:
```typescript
export function Events() { return <div className="pt-20 p-8 text-white">Events — coming soon</div>; }
```

Create `src/pages/EventRegistration.tsx`:
```typescript
export function EventRegistration() { return <div className="pt-20 p-8 text-white">Registration — coming soon</div>; }
```

Create `src/pages/admin/AdminLogin.tsx`:
```typescript
export function AdminLogin() { return <div className="pt-20 p-8 text-white">Admin Login — coming soon</div>; }
```

Create `src/pages/admin/AdminDashboard.tsx`:
```typescript
export function AdminDashboard() { return <div className="pt-20 p-8 text-white">Admin — coming soon</div>; }
```

**Step 3: Run dev server, verify routes don't throw**

```bash
npm run dev
```

Navigate to `/events`, `/events/test`, `/admin/login` — each should show its placeholder text.

**Step 4: Commit**

```bash
git add src/App.tsx src/pages/Events.tsx src/pages/EventRegistration.tsx src/pages/admin/AdminLogin.tsx src/pages/admin/AdminDashboard.tsx
git commit -m "feat: add events and admin routes with placeholder pages"
```

---

### Task 7: EventCard component

**Files:**
- Create: `src/components/events/EventCard.tsx`

**Step 1: Create `src/components/events/EventCard.tsx`**

```typescript
import { Link } from 'react-router-dom';
import { Calendar, Tag } from 'lucide-react';
import type { Event } from '@/types/events';

const CATEGORY_LABELS: Record<string, string> = {
  'workplace-productivity': 'Productivity',
  'workplace-security': 'Security',
  'workplace-ai': 'AI',
  'workplace-automation': 'Automation',
  'workplace-backup': 'Backup',
  'cloud-migration': 'Cloud',
};

const TYPE_LABELS: Record<string, string> = {
  webinar: 'Webinar',
  workshop: 'Workshop',
  event: 'Event',
};

interface Props {
  event: Event;
}

export function EventCard({ event }: Props) {
  const formattedDate = event.event_date
    ? new Date(event.event_date).toLocaleDateString('en-US', {
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
      })
    : null;

  return (
    <Link
      to={`/events/${event.slug}`}
      className="group flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Hero image */}
      <div className="aspect-video bg-white/10 overflow-hidden">
        {event.hero_image_url ? (
          <img
            src={event.hero_image_url}
            alt={event.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Badges */}
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/10 text-white/70">
            {TYPE_LABELS[event.type]}
          </span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/10 text-white/70">
            {CATEGORY_LABELS[event.category]}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-white font-semibold text-base leading-snug group-hover:text-white/80 transition-colors">
          {event.title}
        </h3>

        {/* Description */}
        {event.description && (
          <p className="text-white/50 text-sm leading-relaxed line-clamp-2">{event.description}</p>
        )}

        {/* Date */}
        {formattedDate && (
          <div className="mt-auto flex items-center gap-1.5 text-white/40 text-xs pt-2 border-t border-white/10">
            <Calendar size={12} />
            {formattedDate}
          </div>
        )}
      </div>
    </Link>
  );
}
```

**Step 2: Verify TypeScript**

```bash
npm run build 2>&1 | grep -E "error|Error" | head -10
```

Expected: no errors.

**Step 3: Commit**

```bash
git add src/components/events/EventCard.tsx
git commit -m "feat: add EventCard component"
```

---

### Task 8: EventFilters component

**Files:**
- Create: `src/components/events/EventFilters.tsx`
- Create: `src/lib/eventConstants.ts`

**Step 1: Create `src/lib/eventConstants.ts`**

```typescript
import type { EventCategory, EventType } from '@/types/events';

export const EVENT_CATEGORIES: { value: EventCategory; label: string }[] = [
  { value: 'workplace-productivity', label: 'Workplace Productivity' },
  { value: 'workplace-security',    label: 'Workplace Security' },
  { value: 'workplace-ai',          label: 'Workplace AI' },
  { value: 'workplace-automation',  label: 'Workplace Automation' },
  { value: 'workplace-backup',      label: 'Workplace Backup' },
  { value: 'cloud-migration',       label: 'Cloud Migration' },
];

export const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: 'webinar',  label: 'Webinar' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'event',    label: 'Event' },
];
```

**Step 2: Create `src/components/events/EventFilters.tsx`**

```typescript
import { EVENT_CATEGORIES, EVENT_TYPES } from '@/lib/eventConstants';
import type { EventCategory, EventFilters as Filters, EventType } from '@/types/events';
import { cn } from '@/lib/utils';

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function EventFilters({ filters, onChange }: Props) {
  function setCategory(value: EventCategory | undefined) {
    onChange({ ...filters, category: value });
  }

  function setType(value: EventType | undefined) {
    onChange({ ...filters, type: value });
  }

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCategory(undefined)}
          className={cn(
            'text-sm px-4 py-1.5 rounded-full border transition-all',
            !filters.category
              ? 'bg-white text-black border-white'
              : 'border-white/20 text-white/60 hover:border-white/40 hover:text-white'
          )}
        >
          All
        </button>
        {EVENT_CATEGORIES.map(c => (
          <button
            key={c.value}
            onClick={() => setCategory(filters.category === c.value ? undefined : c.value)}
            className={cn(
              'text-sm px-4 py-1.5 rounded-full border transition-all',
              filters.category === c.value
                ? 'bg-white text-black border-white'
                : 'border-white/20 text-white/60 hover:border-white/40 hover:text-white'
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-white/20 hidden sm:block" />

      {/* Type pills */}
      <div className="flex flex-wrap gap-2">
        {EVENT_TYPES.map(t => (
          <button
            key={t.value}
            onClick={() => setType(filters.type === t.value ? undefined : t.value)}
            className={cn(
              'text-sm px-4 py-1.5 rounded-full border transition-all',
              filters.type === t.value
                ? 'bg-white text-black border-white'
                : 'border-white/20 text-white/60 hover:border-white/40 hover:text-white'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
```

**Step 3: Build check**

```bash
npm run build 2>&1 | grep -E "error|Error" | head -10
```

Expected: no errors.

**Step 4: Commit**

```bash
git add src/components/events/EventFilters.tsx src/lib/eventConstants.ts
git commit -m "feat: add EventFilters component and event constants"
```

---

### Task 9: Events landing page (`/events`)

**Files:**
- Modify: `src/pages/Events.tsx`

**Step 1: Replace placeholder with full implementation**

```typescript
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EventCard } from '@/components/events/EventCard';
import { EventFilters } from '@/components/events/EventFilters';
import { EventService } from '@/services/EventService';
import type { Event, EventFilters as Filters } from '@/types/events';

export function Events() {
  const [upcoming, setUpcoming] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({});

  useEffect(() => {
    setLoading(true);
    EventService.getEvents({ ...filters, status: 'upcoming' })
      .then(setUpcoming)
      .catch(() => setError('Failed to load events. Please try again.'))
      .finally(() => setLoading(false));
  }, [filters.category, filters.type]);

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      {/* Hero */}
      <section className="py-16 px-6 border-b border-white/10">
        <div className="max-w-6xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white/40 text-sm uppercase tracking-widest mb-4"
          >
            Events & Webinars
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
          >
            Expand your knowledge.<br />Connect with experts.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-lg max-w-2xl"
          >
            Join NEX4 and Microsoft-led sessions on cloud, security, AI, and modern workplace transformation across APAC.
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 px-6 border-b border-white/10 sticky top-[76px] z-10 bg-black/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto">
          <EventFilters filters={filters} onChange={setFilters} />
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-semibold mb-8">Upcoming Events</h2>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="aspect-[4/5] rounded-2xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : upcoming.length === 0 ? (
            <p className="text-white/40 text-sm">No upcoming events match your filters.</p>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {upcoming.map(event => (
                <motion.div
                  key={event.id}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* On-Demand Events (placeholder) */}
      <section className="py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">On-Demand</h2>
          <p className="text-white/30 text-sm">On-demand content coming soon.</p>
        </div>
      </section>
    </div>
  );
}
```

**Step 2: Start dev server and navigate to `/events`**

```bash
npm run dev
```

Verify:
- Events load from Supabase (you should see the 2 seed events)
- Filter pills work (clicking a category re-fetches)
- Loading skeleton shows briefly before data arrives
- Empty state shows when no matches

**Step 3: Commit**

```bash
git add src/pages/Events.tsx
git commit -m "feat: implement events landing page"
```

---

### Task 10: KeyTakeaways component

**Files:**
- Create: `src/components/events/KeyTakeaways.tsx`

**Step 1: Create `src/components/events/KeyTakeaways.tsx`**

This renders the 2×2 icon grid shown in the reference design (bottom-left of registration page).

```typescript
import { Brain, Rocket, Fingerprint, CheckSquare } from 'lucide-react';
import type { KeyTakeaway } from '@/types/events';

// Default icon map — maps icon name string to a Lucide icon
const ICON_MAP: Record<string, React.ElementType> = {
  brain: Brain,
  rocket: Rocket,
  fingerprint: Fingerprint,
  check: CheckSquare,
};

interface Props {
  items: KeyTakeaway[];
}

export function KeyTakeaways({ items }: Props) {
  if (!items.length) return null;

  return (
    <div>
      <p className="font-semibold text-white mb-4">
        In this session, you&apos;ll learn:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item, i) => {
          const Icon = ICON_MAP[item.icon] ?? Brain;
          return (
            <div key={i} className="flex gap-3 items-start">
              <div className="shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <Icon size={20} className="text-white" />
              </div>
              <p className="text-white/70 text-sm leading-relaxed">{item.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

**Step 2: Build check**

```bash
npm run build 2>&1 | grep -E "error|Error" | head -10
```

**Step 3: Commit**

```bash
git add src/components/events/KeyTakeaways.tsx
git commit -m "feat: add KeyTakeaways component"
```

---

### Task 11: RegistrationForm component

**Files:**
- Create: `src/components/events/RegistrationForm.tsx`

React Hook Form + Zod are already installed.

**Step 1: Create `src/components/events/RegistrationForm.tsx`**

```typescript
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EventService } from '@/services/EventService';
import { cn } from '@/lib/utils';

const schema = z.object({
  first_name:   z.string().min(1, 'Required'),
  last_name:    z.string().min(1, 'Required'),
  email:        z.string().email('Invalid email'),
  company_name: z.string().optional(),
  job_title:    z.string().optional(),
  country:      z.string().min(1, 'Required'),
});

type FormData = z.infer<typeof schema>;

interface Props {
  eventId: string;
  eventTitle: string;
}

export function RegistrationForm({ eventId, eventTitle }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setServerError(null);
    try {
      await EventService.createRegistration({ event_id: eventId, ...data });
      setSubmitted(true);
    } catch {
      setServerError('Something went wrong. Please try again.');
    }
  }

  if (submitted) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">✓</span>
        </div>
        <h3 className="text-white font-semibold text-lg mb-2">You&apos;re registered!</h3>
        <p className="text-white/50 text-sm">We&apos;ll send confirmation details to your email.</p>
      </div>
    );
  }

  const fields: { name: keyof FormData; label: string; required: boolean; type?: string }[] = [
    { name: 'first_name',   label: 'First name',   required: true },
    { name: 'last_name',    label: 'Last name',    required: true },
    { name: 'email',        label: 'Email',        required: true, type: 'email' },
    { name: 'company_name', label: 'Company name', required: false },
    { name: 'job_title',    label: 'Job title',    required: false },
    { name: 'country',      label: 'Country',      required: true },
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 lg:p-8">
      <h3 className="text-white font-bold text-xl mb-1">Register now.</h3>
      <p className="text-white/40 text-sm mb-6">Here is my information.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {fields.map(f => (
          <div key={f.name}>
            <input
              {...register(f.name)}
              type={f.type ?? 'text'}
              placeholder={`${f.label}${f.required ? ' *' : ''}`}
              className={cn(
                'w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder:text-white/30 text-sm outline-none transition-all',
                errors[f.name]
                  ? 'border-red-400/60 focus:border-red-400'
                  : 'border-white/15 focus:border-white/40'
              )}
            />
            {errors[f.name] && (
              <p className="text-red-400 text-xs mt-1">{errors[f.name]?.message}</p>
            )}
          </div>
        ))}

        {serverError && <p className="text-red-400 text-sm">{serverError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Registering…' : `Register for ${eventTitle}`}
        </button>

        <p className="text-white/20 text-xs text-center">
          By registering you agree to our{' '}
          <a href="#" className="underline hover:text-white/40">privacy policy</a>.
        </p>
      </form>
    </div>
  );
}
```

**Step 2: Build check**

```bash
npm run build 2>&1 | grep -E "error|Error" | head -10
```

**Step 3: Commit**

```bash
git add src/components/events/RegistrationForm.tsx
git commit -m "feat: add RegistrationForm with Zod validation"
```

---

### Task 12: Event registration page (`/events/:slug`)

**Files:**
- Modify: `src/pages/EventRegistration.tsx`

**Step 1: Replace placeholder with full implementation**

```typescript
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar } from 'lucide-react';
import { EventService } from '@/services/EventService';
import { RegistrationForm } from '@/components/events/RegistrationForm';
import { KeyTakeaways } from '@/components/events/KeyTakeaways';
import type { Event } from '@/types/events';

export function EventRegistration() {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    EventService.getEvent(slug)
      .then(e => { if (!e) setNotFound(true); else setEvent(e); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-20 px-6">
        <div className="max-w-5xl mx-auto py-16 flex gap-8">
          <div className="flex-1 space-y-4">
            <div className="h-8 bg-white/5 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-white/5 rounded animate-pulse w-full" />
            <div className="h-4 bg-white/5 rounded animate-pulse w-2/3" />
          </div>
          <div className="w-full max-w-sm">
            <div className="bg-white/5 rounded-2xl h-96 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !event) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 px-6 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Event not found</h2>
        <Link to="/events" className="text-white/50 hover:text-white flex items-center gap-2 text-sm">
          <ArrowLeft size={16} /> Back to Events
        </Link>
      </div>
    );
  }

  const formattedDate = event.event_date
    ? new Date(event.event_date).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      })
    : null;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero banner */}
      <div className="relative w-full aspect-[3/1] max-h-72 overflow-hidden">
        {event.hero_image_url ? (
          <img src={event.hero_image_url} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-8 max-w-5xl mx-auto w-full">
          <Link to="/events" className="flex items-center gap-1.5 text-white/50 hover:text-white text-sm mb-4 w-fit">
            <ArrowLeft size={14} /> All Events
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-4xl font-bold max-w-xl"
          >
            {event.title}
          </motion.h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-10">
        {/* Left: details */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 space-y-8"
        >
          {formattedDate && (
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <Calendar size={14} />
              {formattedDate}
            </div>
          )}

          {event.description && (
            <p className="text-white/70 leading-relaxed">{event.description}</p>
          )}

          {event.key_takeaways.length > 0 && (
            <KeyTakeaways items={event.key_takeaways} />
          )}
        </motion.div>

        {/* Right: registration form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="w-full lg:max-w-sm lg:sticky lg:top-28 self-start"
        >
          <RegistrationForm eventId={event.id} eventTitle={event.title} />
        </motion.div>
      </div>
    </div>
  );
}
```

**Step 2: Test the page manually**

Navigate to `/events` → click one of the seed events → verify:
- Banner image (or gradient) shows
- Title, description display
- Form renders
- Submitting the form saves a row to `registrations` in Supabase Dashboard

**Step 3: Commit**

```bash
git add src/pages/EventRegistration.tsx
git commit -m "feat: implement event registration page"
```

---

### Task 13: Admin login + ProtectedRoute

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/components/admin/ProtectedRoute.tsx`
- Modify: `src/pages/admin/AdminLogin.tsx`

**Step 1: Create `src/lib/auth.ts`**

```typescript
import { supabase } from '@/lib/supabase';

export const Auth = {
  async signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  },

  async signOut() {
    await supabase.auth.signOut();
  },

  async getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },
};
```

**Step 2: Create `src/components/admin/ProtectedRoute.tsx`**

```typescript
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Auth } from '@/lib/auth';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    Auth.getSession().then(s => {
      setAuthed(!!s);
      setChecked(true);
    });
  }, []);

  if (!checked) return null;
  if (!authed) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
```

**Step 3: Replace `src/pages/admin/AdminLogin.tsx`**

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Auth } from '@/lib/auth';
import { cn } from '@/lib/utils';

const schema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});
type FormData = z.infer<typeof schema>;

export function AdminLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setError(null);
    try {
      await Auth.signIn(data.email, data.password);
      navigate('/admin/events');
    } catch {
      setError('Invalid email or password.');
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-white text-2xl font-bold mb-8">Admin Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            {...register('email')}
            type="email"
            placeholder="Email"
            className={cn(
              'w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder:text-white/30 text-sm outline-none',
              errors.email ? 'border-red-400/60' : 'border-white/15 focus:border-white/40'
            )}
          />
          <input
            {...register('password')}
            type="password"
            placeholder="Password"
            className={cn(
              'w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder:text-white/30 text-sm outline-none',
              errors.password ? 'border-red-400/60' : 'border-white/15 focus:border-white/40'
            )}
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

**Step 4: Update `App.tsx` to wrap admin routes with ProtectedRoute**

In `src/App.tsx`, add the import and wrap `/admin/*`:

```typescript
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';

// In <Routes>:
<Route path="/admin/login" element={<AdminLogin />} />
<Route path="/admin/*" element={
  <ProtectedRoute><AdminDashboard /></ProtectedRoute>
} />
```

**Step 5: Create an admin user in Supabase**

In Supabase Dashboard → Authentication → Users → Invite user.
Set email and password for the admin account.

**Step 6: Test login flow**

Navigate to `/admin/events` — should redirect to `/admin/login`. Log in with the admin credentials — should redirect to `/admin/events` (still a placeholder).

**Step 7: Commit**

```bash
git add src/lib/auth.ts src/components/admin/ProtectedRoute.tsx src/pages/admin/AdminLogin.tsx src/App.tsx
git commit -m "feat: add admin auth with ProtectedRoute and login page"
```

---

### Task 14: AdminDashboard shell

**Files:**
- Modify: `src/pages/admin/AdminDashboard.tsx`
- Create: `src/pages/admin/AdminEvents.tsx`
- Create: `src/pages/admin/AdminRegistrations.tsx`

**Step 1: Replace `src/pages/admin/AdminDashboard.tsx`**

```typescript
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { Calendar, Users, LogOut } from 'lucide-react';
import { Auth } from '@/lib/auth';
import { AdminEvents } from './AdminEvents';
import { AdminRegistrations } from './AdminRegistrations';
import { cn } from '@/lib/utils';

export function AdminDashboard() {
  const navigate = useNavigate();

  async function handleSignOut() {
    await Auth.signOut();
    navigate('/admin/login');
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-white/10 flex flex-col pt-20 px-4 pb-6">
        <nav className="flex flex-col gap-1 flex-1">
          <NavLink
            to="/admin/events"
            className={({ isActive }) => cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
              isActive ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'
            )}
          >
            <Calendar size={15} /> Events
          </NavLink>
          <NavLink
            to="/admin/registrations"
            className={({ isActive }) => cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
              isActive ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'
            )}
          >
            <Users size={15} /> Registrations
          </NavLink>
        </nav>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/40 hover:text-white transition-colors"
        >
          <LogOut size={15} /> Sign out
        </button>
      </aside>

      {/* Content */}
      <main className="flex-1 pt-20 px-8 pb-8 overflow-auto">
        <Routes>
          <Route path="events" element={<AdminEvents />} />
          <Route path="registrations" element={<AdminRegistrations />} />
        </Routes>
      </main>
    </div>
  );
}
```

**Step 2: Create placeholder `src/pages/admin/AdminEvents.tsx`**

```typescript
export function AdminEvents() { return <div>Events — coming in next task</div>; }
```

**Step 3: Create placeholder `src/pages/admin/AdminRegistrations.tsx`**

```typescript
export function AdminRegistrations() { return <div>Registrations — coming in next task</div>; }
```

**Step 4: Verify admin navigation works**

Navigate to `/admin/events` after login — sidebar should show, nav links should highlight correctly.

**Step 5: Commit**

```bash
git add src/pages/admin/AdminDashboard.tsx src/pages/admin/AdminEvents.tsx src/pages/admin/AdminRegistrations.tsx
git commit -m "feat: add admin dashboard shell with sidebar navigation"
```

---

### Task 15: AdminEvents — CRUD + image upload

**Files:**
- Modify: `src/pages/admin/AdminEvents.tsx`

**Step 1: Replace with full implementation**

```typescript
import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Upload } from 'lucide-react';
import { EventService } from '@/services/EventService';
import { EVENT_CATEGORIES, EVENT_TYPES } from '@/lib/eventConstants';
import type { Event } from '@/types/events';
import { cn } from '@/lib/utils';

type FormState = Omit<Event, 'id' | 'created_at' | 'key_takeaways'> & { key_takeaways_raw: string };

const EMPTY_FORM: FormState = {
  title: '', slug: '', description: '', hero_image_url: '',
  category: 'workplace-ai', type: 'webinar', status: 'upcoming',
  event_date: '', key_takeaways_raw: '[]',
};

function toSlug(s: string) {
  return s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function loadEvents() {
    setLoading(true);
    EventService.getEvents().then(setEvents).finally(() => setLoading(false));
  }

  useEffect(() => { loadEvents(); }, []);

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
    setError(null);
  }

  function openEdit(event: Event) {
    setForm({
      ...event,
      event_date: event.event_date ? event.event_date.slice(0, 16) : '',
      key_takeaways_raw: JSON.stringify(event.key_takeaways, null, 2),
    });
    setEditingId(event.id);
    setShowForm(true);
    setError(null);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this event?')) return;
    await EventService.deleteEvent(id);
    loadEvents();
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    try {
      const url = await EventService.uploadImage(file);
      setForm(f => ({ ...f, hero_image_url: url }));
    } catch {
      setError('Image upload failed.');
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      let takeaways = [];
      try { takeaways = JSON.parse(form.key_takeaways_raw); } catch { setError('Invalid JSON in key takeaways.'); setSaving(false); return; }

      const payload = {
        title: form.title, slug: form.slug, description: form.description,
        hero_image_url: form.hero_image_url || null,
        category: form.category, type: form.type, status: form.status,
        event_date: form.event_date || null,
        key_takeaways: takeaways,
      };

      if (editingId) {
        await EventService.updateEvent(editingId, payload);
      } else {
        await EventService.createEvent(payload as Omit<Event, 'id' | 'created_at'>);
      }
      setShowForm(false);
      loadEvents();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Events</h2>
        <button onClick={openCreate} className="flex items-center gap-2 bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/90 transition-colors">
          <Plus size={15} /> New Event
        </button>
      </div>

      {loading ? (
        <p className="text-white/40 text-sm">Loading…</p>
      ) : (
        <div className="border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 bg-white/5">
              <tr>
                {['Title', 'Category', 'Type', 'Status', 'Date', ''].map(h => (
                  <th key={h} className="text-left text-white/40 font-medium px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-white">{event.title}</td>
                  <td className="px-4 py-3 text-white/50">{event.category}</td>
                  <td className="px-4 py-3 text-white/50">{event.type}</td>
                  <td className="px-4 py-3">
                    <span className={cn('text-xs px-2 py-0.5 rounded-full', event.status === 'upcoming' ? 'bg-green-500/20 text-green-300' : 'bg-white/10 text-white/50')}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/50 text-xs">
                    {event.event_date ? new Date(event.event_date).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => openEdit(event)} className="p-1.5 text-white/40 hover:text-white transition-colors"><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(event.id)} className="p-1.5 text-white/40 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold">{editingId ? 'Edit Event' : 'New Event'}</h3>
              <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white"><X size={18} /></button>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { key: 'title', label: 'Title', type: 'text' },
                { key: 'slug', label: 'Slug', type: 'text' },
                { key: 'description', label: 'Description', type: 'text' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-white/40 text-xs mb-1 block">{f.label}</label>
                  <input
                    type={f.type}
                    value={(form as Record<string, string>)[f.key]}
                    onChange={e => {
                      const val = e.target.value;
                      setForm(prev => ({
                        ...prev,
                        [f.key]: val,
                        ...(f.key === 'title' && !editingId ? { slug: toSlug(val) } : {}),
                      }));
                    }}
                    className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-white/40"
                  />
                </div>
              ))}

              {/* Selects */}
              {[
                { key: 'category', label: 'Category', options: EVENT_CATEGORIES },
                { key: 'type',     label: 'Type',     options: EVENT_TYPES },
                { key: 'status',   label: 'Status',   options: [{ value: 'upcoming', label: 'Upcoming' }, { value: 'on_demand', label: 'On Demand' }] },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-white/40 text-xs mb-1 block">{f.label}</label>
                  <select
                    value={(form as Record<string, string>)[f.key]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-white/40"
                  >
                    {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              ))}

              {/* Date */}
              <div>
                <label className="text-white/40 text-xs mb-1 block">Event Date</label>
                <input
                  type="datetime-local"
                  value={form.event_date ?? ''}
                  onChange={e => setForm(prev => ({ ...prev, event_date: e.target.value }))}
                  className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-white/40"
                />
              </div>

              {/* Image upload */}
              <div>
                <label className="text-white/40 text-xs mb-1 block">Hero Image</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={form.hero_image_url ?? ''}
                    onChange={e => setForm(prev => ({ ...prev, hero_image_url: e.target.value }))}
                    placeholder="https://… or upload below"
                    className="flex-1 bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-white/40"
                  />
                  <label className={cn('flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/15 text-sm cursor-pointer hover:border-white/40 transition-colors', uploading && 'opacity-50 pointer-events-none')}>
                    <Upload size={13} /> {uploading ? 'Uploading…' : 'Upload'}
                    <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
                  </label>
                </div>
                {form.hero_image_url && (
                  <img src={form.hero_image_url} alt="preview" className="mt-2 h-20 rounded-lg object-cover" />
                )}
              </div>

              {/* Key takeaways */}
              <div>
                <label className="text-white/40 text-xs mb-1 block">Key Takeaways (JSON array)</label>
                <textarea
                  value={form.key_takeaways_raw}
                  onChange={e => setForm(prev => ({ ...prev, key_takeaways_raw: e.target.value }))}
                  rows={4}
                  className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-white/40 font-mono"
                  placeholder='[{"icon":"brain","text":"Learn about AI"}]'
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                onClick={handleSave}
                disabled={saving || uploading}
                className="w-full bg-white text-black font-semibold py-2.5 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save Event'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

**Step 2: Test CRUD manually**

- Create a new event (with image upload)
- Edit it
- Delete it
- Verify events appear on `/events`

**Step 3: Commit**

```bash
git add src/pages/admin/AdminEvents.tsx
git commit -m "feat: implement AdminEvents with full CRUD and image upload"
```

---

### Task 16: AdminRegistrations — view + CSV export

**Files:**
- Modify: `src/pages/admin/AdminRegistrations.tsx`

**Step 1: Replace with full implementation**

```typescript
import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { EventService } from '@/services/EventService';
import type { Event, Registration } from '@/types/events';

function exportCSV(registrations: Registration[], eventTitle: string) {
  const headers = ['First Name', 'Last Name', 'Email', 'Company', 'Job Title', 'Country', 'Registered At'];
  const rows = registrations.map(r => [
    r.first_name, r.last_name, r.email,
    r.company_name ?? '', r.job_title ?? '', r.country,
    new Date(r.registered_at).toLocaleString(),
  ]);
  const csv = [headers, ...rows].map(row => row.map(v => `"${v}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${eventTitle.replace(/\s+/g, '-').toLowerCase()}-registrations.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function AdminRegistrations() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    EventService.getEvents().then(e => {
      setEvents(e);
      if (e.length > 0) setSelectedEventId(e[0].id);
    });
  }, []);

  useEffect(() => {
    if (!selectedEventId) return;
    setLoading(true);
    EventService.getRegistrations(selectedEventId)
      .then(setRegistrations)
      .finally(() => setLoading(false));
  }, [selectedEventId]);

  const selectedEvent = events.find(e => e.id === selectedEventId);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Registrations</h2>
          <select
            value={selectedEventId}
            onChange={e => setSelectedEventId(e.target.value)}
            className="bg-white/5 border border-white/15 rounded-lg px-3 py-1.5 text-white text-sm outline-none focus:border-white/40"
          >
            {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
          </select>
        </div>
        {registrations.length > 0 && selectedEvent && (
          <button
            onClick={() => exportCSV(registrations, selectedEvent.title)}
            className="flex items-center gap-2 border border-white/20 text-white text-sm px-4 py-2 rounded-lg hover:border-white/40 transition-colors"
          >
            <Download size={14} /> Export CSV
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-white/40 text-sm">Loading…</p>
      ) : registrations.length === 0 ? (
        <p className="text-white/40 text-sm">No registrations yet for this event.</p>
      ) : (
        <div className="border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 bg-white/5">
              <tr>
                {['Name', 'Email', 'Company', 'Job Title', 'Country', 'Registered'].map(h => (
                  <th key={h} className="text-left text-white/40 font-medium px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {registrations.map(r => (
                <tr key={r.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-white">{r.first_name} {r.last_name}</td>
                  <td className="px-4 py-3 text-white/60">{r.email}</td>
                  <td className="px-4 py-3 text-white/50">{r.company_name ?? '—'}</td>
                  <td className="px-4 py-3 text-white/50">{r.job_title ?? '—'}</td>
                  <td className="px-4 py-3 text-white/50">{r.country}</td>
                  <td className="px-4 py-3 text-white/40 text-xs">{new Date(r.registered_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
```

**Step 2: Test manually**

- Navigate to `/admin/registrations`
- Select an event that has registrations (from testing Task 12)
- Verify table renders
- Click Export CSV — verify file downloads

**Step 3: Run full test suite**

```bash
npm test
```

Expected: all tests pass.

**Step 4: Run build**

```bash
npm run build
```

Expected: 0 TypeScript errors, build succeeds.

**Step 5: Final commit**

```bash
git add src/pages/admin/AdminRegistrations.tsx
git commit -m "feat: implement AdminRegistrations with CSV export"
```

---

## Summary

| Task | Output |
|------|--------|
| 1 | Supabase JS installed, env vars configured |
| 2 | DB schema + seed data in Supabase |
| 3 | Supabase client + EventService |
| 4 | Vitest + EventService tests |
| 5 | public/images migrated to Supabase Storage |
| 6 | All routes wired in App.tsx |
| 7 | EventCard component |
| 8 | EventFilters component + constants |
| 9 | Events landing page |
| 10 | KeyTakeaways component |
| 11 | RegistrationForm component |
| 12 | Event registration page |
| 13 | Admin auth (login + ProtectedRoute) |
| 14 | Admin dashboard shell |
| 15 | AdminEvents CRUD + image upload |
| 16 | AdminRegistrations + CSV export |
