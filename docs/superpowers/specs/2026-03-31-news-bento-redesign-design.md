# News Landing Page — Bento Redesign

**Date:** 2026-03-31  
**Status:** Approved

## Goal

Redesign `src/pages/News.tsx` so it matches the visual design of `src/pages/CaseStudies.tsx`: full-bleed image bento cards with hover-reveal content, a 3-column mosaic grid, and a matching sticky filter bar.

---

## Approach

Direct port — copy the bento grid and card pattern from `CaseStudies.tsx` into `News.tsx`. No shared abstractions. News and case studies have different data shapes (`published_at`, `reading_time`, `category` vs `client`, `industry`, `category`) so a shared component would be a leaky abstraction.

The external `NewsCard` component (`src/components/news/NewsCard.tsx`) is left unchanged; it is no longer used by `News.tsx` but may be used elsewhere.

---

## Card: `NewsBentoCard` (inline in News.tsx)

- Full-bleed `hero_image_url` filling the entire card via `object-cover`; `scale-[1.04]` on hover (700ms ease-out transition)
- Permanent bottom gradient: `rgba(0,0,0,0.97) → transparent` so text is always readable
- Hover: `bg-black/30 → bg-black/10` transition (image breathes)
- Top accent line: `h-[2px]` white gradient, `opacity-0 → opacity-100` on hover
- **Badges (top-left):** category pill + date pill — `text-[9px] uppercase tracking-[0.18em]`, `border border-white/15 rounded-full`, `backdrop-blur-sm bg-black/20`
- **Rest state (bottom):** article title pinned to bottom, fades out on hover
  - Featured (index 0): `text-[22px] lg:text-[26px]`, max-w-lg
  - Regular: `text-[16px]`, `line-clamp-2`
- **Hover state (bottom):** title + excerpt + "Read article →" CTA slides up (`translate-y-full → translate-y-0`, 500ms ease-out)
  - Featured excerpt: `text-[14px]`, `line-clamp-3`
  - Regular excerpt: `text-[12px]`, `line-clamp-2`
- **Missing image fallback:** dark dot-grid gradient (`radial-gradient(rgba(0,120,212,0.1)...)` + dot grid), same as current `NewsCard` placeholder
- `rounded-2xl` on all cards

---

## Grid

- Lift `BENTO_LAYOUTS`, `GROUP_SIZE`, `GROUP_ROWS`, and `getBentoPlacement` verbatim from `CaseStudies.tsx`
- CSS grid: `gridTemplateColumns: 'repeat(3, 1fr)'`, `gridAutoRows: '280px'`, `gap-3`
- `PAGE_SIZE = 8` (one full bento group)
- Stagger animation: `initial={{ opacity: 0, y: 16 }}`, `delay: index * 0.06`
- Skeleton loading: 6× `rounded-2xl bg-white/[0.04] animate-pulse` at fixed heights (2× tall + 4× short)
- "Load more" button: `rounded-full` (matches case studies, fixes square style in current News)

---

## Filter Bar

- Inline `Pill` component (same as case studies): `text-[11px] font-medium px-3 py-1 rounded-full border`; active: `bg-white text-black border-white`; inactive: `border-white/15 text-white/45`
- Group label: `text-[9px] uppercase tracking-[0.18em] text-white/25 font-semibold`
- Groups: **"When"** (date filter: All / Week / Month / Quarter / Year) + divider + **"Category"** (news categories)
- Sticky bar wrapper unchanged: `sticky top-[76px] z-20 border-y border-white/[0.07] backdrop-blur-md`
- `NewsFilters` component is replaced by the inline filter bar; the component file is left unchanged

---

## Files Changed

| File | Change |
|------|--------|
| `src/pages/News.tsx` | Full rewrite: inline bento card, bento grid, inline filter bar |
| `src/components/news/NewsFilters.tsx` | No change (left in place) |
| `src/components/news/NewsCard.tsx` | No change (left in place) |

---

## What Is Not Changing

- Hero section (`News.tsx`) — identical structure, copy, and animations
- Supabase data fetching logic — unchanged
- Filter logic (`applyDateFilter`, `NewsUIFilters`) — unchanged
- `NewsFilters.tsx` and `NewsCard.tsx` component files — untouched
