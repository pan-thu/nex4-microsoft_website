# Homepage Sections — Design Document
Date: 2026-03-02

## Overview
Build the NEX4 homepage with four sections, plus update the Navbar and Footer to a black-and-white theme (remove #22b7cd cyan accent, replace with white).

## Color Theme Change
- Replace all `#22b7cd` (cyan) with white-based equivalents throughout Navbar and Footer
- Active nav indicator: `border-left: 2px solid white` (was cyan)
- "Contact Us" button: `bg-white text-black` (was `bg-[#22b7cd] text-white`)
- Ambient glow blobs: reduce/remove cyan, keep subtle white/5 or remove entirely
- Accent lines (top/bottom of mega menus, navbar bottom): white/10 gradient
- ArrowRight icons in mega menu: `text-white` (was cyan)
- ScrollProgress bar: white (was #0078D4)
- The four homepage sections follow the same black-and-white palette

---

## Section 1 — Hero Slider

### Layout
- `min-h-screen` minus 76px navbar padding
- Background: `bg-black`
- **Left** (55%): eyebrow label, headline, CTA
- **Right** (45%): clipped card-bg image with left-edge gradient fade

### Slides (3 total)
1. Eyebrow: `WORKPLACE AI` | Headline: "Empower Your People with a Smarter **Digital Workplace**" | Image: card-bg-3.png | CTA: "Explore Workplace AI"
2. Eyebrow: `WORKPLACE SECURITY` | Headline: "Protect What Matters. Secure **Every Endpoint.**" | Image: card-bg-2.png | CTA: "Explore Security"
3. Eyebrow: `CLOUD MIGRATION` | Headline: "Your Journey to Azure **Starts Here**" | Image: card-bg-4.png | CTA: "Explore Cloud"

### Interactions
- Auto-advance: 5s `useEffect` interval, reset on manual nav
- Transition: Framer Motion `AnimatePresence` with `mode="wait"` — slide fades left/right + opacity
- Bottom controls: `←` `→` circle buttons (white border, white icon) + `01 / 03` counter in white/40
- Accent word in headline: `text-white font-bold` (italic or heavier weight) — no cyan

### Component
`src/components/home/HeroSlider.tsx`

---

## Section 2 — What We Do

### Layout
- Background: `bg-[#0a0a0a]` (subtle separation from hero's pure black)
- Centered heading: `"What We Do"` — white, ~48px
- Subheading: `"Our core Microsoft solutions"` — white/50, small
- 4-column grid with `1px rgba(255,255,255,0.08)` vertical dividers

### Cards (4 total)
| # | Category | Headline | Link |
|---|----------|----------|------|
| 1 | WORKPLACE SECURITY | "We help you protect your business from every angle." | /services/workplace-security |
| 2 | WORKPLACE AI | "We help you unlock real value with Microsoft Copilot." | /services/workplace-ai |
| 3 | WORKPLACE AUTOMATION | "We help you automate work and free your people." | /services/workplace-automation |
| 4 | CLOUD MIGRATION | "We help you move to Azure with confidence." | /services/cloud-migration |

### Card anatomy
- Category: 11px uppercase tracking-widest white/40
- Headline: ~28px bold white, 2-3 lines
- Body: 14px white/50, ~2 sentences
- CTA: outlined pill `border border-white/20 text-white/70 hover:border-white hover:text-white` + ArrowRight icon
- Hover state: card bg lifts to `white/[0.03]`

### Component
`src/components/home/WhatWeDo.tsx`

---

## Section 3 — Testimonials

### Layout
- Background: `bg-black`
- Section label: `"TESTIMONIALS"` — uppercase tracking-widest white/30
- Heading: `"What they think of us"` — white, ~42px

### Data (4 testimonials from original site)
1. **Trevor Virtue**, Designer — "The tailored strategies provided by NEX4 were transformative. We saw a significant increase in efficiency and a noticeable reduction in operational costs."
2. **Emma Miller**, SMM Manager — "NEX4's modern workspace design has revolutionized the way we work. The integration of advanced collaboration tools and ergonomic setups has boosted our productivity."
3. **Paul Trueman**, Designer — "Migrating to the cloud with NEX4's support has been a game-changer. We've reduced our IT expenses by 40% and improved our operational scalability."
4. **Anonymous**, Designer — "The email migration process was seamless, with zero downtime and no data loss. NEX4's expertise ensured a smooth transition to Microsoft 365."

### Interactions
- Shows 1 testimonial at a time
- Framer Motion AnimatePresence crossfade
- Prev/Next text+arrow buttons (white/50, hover white)
- Dot indicators below (active = white, inactive = white/20)

### Component
`src/components/home/Testimonials.tsx`

---

## Section 4 — Our Locations

### Layout
- Background: `bg-black`
- Large stacked heading left-aligned: `"Our\nLocations"` — display size (~72px), white, light weight
- Region: only `APAC` shown (active, white underline) — static, no other tabs
- 4 equal-width cards in a row

### Locations (APAC)
| Country | Photo (Unsplash) |
|---------|-----------------|
| Myanmar | Yangon skyline |
| Thailand | Bangkok cityscape |
| Cambodia | Phnom Penh / Angkor area |
| Japan | Tokyo skyline |

### Card anatomy
- 4:3 aspect ratio photo (rounded corners or sharp, consistent with theme)
- Country name below: 12px uppercase tracking-widest white
- Hover: image scale 1.03, transition 300ms

### Bottom accent
- Thin horizontal gradient line: `white/10` to `white/5` (replaces EPAM's cyan→purple)

### Component
`src/components/home/OurLocations.tsx`

---

## File Structure
```
src/
  components/
    common/
      Navbar.tsx       (modify — swap cyan for white)
      Footer.tsx       (modify — swap cyan for white)
      ScrollProgress.tsx (modify — bar color to white)
    home/
      HeroSlider.tsx   (new)
      WhatWeDo.tsx     (new)
      Testimonials.tsx (new)
      OurLocations.tsx (new)
  pages/
    Home.tsx           (modify — compose all 4 sections)
```

## Libraries Used
- `framer-motion` — AnimatePresence for slide/fade transitions, motion.div for scroll-triggered entrance animations
- `react-intersection-observer` — trigger entrance animations on scroll
- `lucide-react` — ArrowRight, ArrowLeft, ChevronLeft, ChevronRight icons
