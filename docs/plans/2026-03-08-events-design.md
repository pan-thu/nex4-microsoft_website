# Events Feature Design

**Date:** 2026-03-08
**Status:** Approved

---

## Overview

Add a full events system to the NEX4 Microsoft website: a public events landing page, individual event registration pages, and a minimal admin dashboard for managing events and registrations.

---

## Infrastructure

### Development
- **Database:** Supabase (PostgreSQL)
- **File Storage:** Supabase Storage
- **Auth:** Supabase Auth

### Production (AWS)
- **Frontend:** S3 + CloudFront (static React/Vite build)
- **Backend API:** Lambda + API Gateway
- **Database:** RDS PostgreSQL
- **File Storage:** S3
- **Auth:** AWS Cognito
- **Admin:** Protected `/admin` route within the same React app

### Dev → Prod Abstraction
A `EventService` class in `src/services/EventService.ts` abstracts all data access. In development it uses the Supabase JS client; in production it calls Lambda API endpoints. Switching is controlled by an environment variable (`VITE_USE_SUPABASE=true/false`). No component-level code changes needed at migration time.

---

## Pages

### `/events` — Events Landing Page

Two sections:

1. **Upcoming Events** — grid of event cards, each linking to `/events/:slug`
2. **On-Demand Events** — placeholder section (populated later)

Both sections share a filter bar:
- **Category** (from service nav): Workplace Productivity, Workplace Security, Workplace AI, Workplace Automation, Workplace Backup, Cloud Migration
- **Type**: Webinar, Workshop, Event

### `/events/:slug` — Event Registration Page

Two-column layout (reference: Microsoft partner template):
- **Left column:** Hero image, event title, subtitle, description, key takeaways (icon grid)
- **Right column:** Sticky registration form card

Registration form fields:
| Field | Required |
|-------|----------|
| First name | Yes |
| Last name | Yes |
| Email | Yes |
| Company name | No |
| Job title | No |
| Country | Yes |

On submit: registration saved to database, success state shown in-place (no page redirect).

### `/admin` — Admin Dashboard (Protected)

Gated behind login. Minimal CRUD interface:
- **Events:** list, create, edit, delete, toggle upcoming/on-demand status
- **Registrations:** read-only table per event, CSV export

---

## Database Schema

### `events`
```sql
id             uuid PRIMARY KEY DEFAULT gen_random_uuid()
title          text NOT NULL
slug           text NOT NULL UNIQUE
description    text
key_takeaways  jsonb          -- [{ icon: string, text: string }]
hero_image_url text
category       text           -- enum: workplace-productivity | security | ai | automation | backup | cloud
type           text           -- enum: webinar | workshop | event
status         text           -- enum: upcoming | on_demand
event_date     timestamptz
created_at     timestamptz DEFAULT now()
```

### `registrations`
```sql
id             uuid PRIMARY KEY DEFAULT gen_random_uuid()
event_id       uuid REFERENCES events(id) ON DELETE CASCADE
first_name     text NOT NULL
last_name      text NOT NULL
email          text NOT NULL
company_name   text
job_title      text
country        text NOT NULL
registered_at  timestamptz DEFAULT now()
```

---

## File Storage Migration

Current static assets in `public/images/` are migrated to Supabase Storage (dev) / S3 (prod) in a public bucket. Image URLs are referenced by absolute URL in components and stored in the `events.hero_image_url` column for event-specific images.

---

## Service Layer

```
src/
└── services/
    ├── EventService.ts      -- getEvents(filters), getEvent(slug), createRegistration(data)
    ├── supabase/
    │   └── client.ts        -- Supabase JS client init
    └── api/
        └── client.ts        -- Fetch wrapper for Lambda API (prod)
```

---

## Admin Auth

- **Dev:** Supabase Auth (email + password, single admin user)
- **Prod:** AWS Cognito user pool

Admin routes protected by a `<ProtectedRoute>` wrapper component that checks auth state before rendering.

---

## Component Structure

```
src/
├── pages/
│   ├── Events.tsx               -- /events landing
│   ├── EventRegistration.tsx    -- /events/:slug
│   └── admin/
│       ├── AdminLogin.tsx
│       ├── AdminDashboard.tsx
│       ├── AdminEvents.tsx
│       └── AdminRegistrations.tsx
├── components/
│   └── events/
│       ├── EventCard.tsx
│       ├── EventFilters.tsx
│       ├── RegistrationForm.tsx
│       └── KeyTakeaways.tsx
└── services/
    └── EventService.ts
```

---

## Out of Scope (for now)

- On-demand events content (placeholder section only)
- Email confirmation on registration
- Public-facing registrant counts
- Event capacity limits
