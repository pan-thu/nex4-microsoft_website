# Homepage Build Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Update Navbar/Footer to black-and-white theme, then build 4 homepage sections (Hero Slider, What We Do, Testimonials, Our Locations).

**Architecture:** All sections live in `src/components/home/`. Each is a self-contained component imported into `src/pages/Home.tsx`. Framer Motion handles all animation (AnimatePresence for sliders, motion.div + useInView for scroll entrances). No new dependencies needed — everything is already installed.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, Framer Motion 12, react-intersection-observer, Lucide React, React Router 7

---

## Theme Constants (reference throughout)

```
bg-black          — primary background
bg-[#0a0a0a]      — section alternate bg (barely off-black)
text-white        — primary text
text-white/60     — secondary text
text-white/30     — muted / labels
border-white/10   — dividers
white             — all accents (replaces #22b7cd cyan)
```

---

### Task 1: Update Navbar — swap cyan (#22b7cd) to white

**Files:**
- Modify: `src/components/common/Navbar.tsx`

**What to change (every occurrence of `#22b7cd` or `[#22b7cd]`):**

1. **Ambient glow blob** (line ~525): remove `bg-[#22b7cd]/[0.18]` glow entirely — replace with nothing (delete the div)
2. **Bottom accent line** (line ~529): change gradient from `rgba(34,183,205,...)` to `rgba(255,255,255,0.12)` solid/uniform:
   ```tsx
   style={{ background: 'rgba(255,255,255,0.08)' }}
   ```
3. **Active border-left on section buttons** (line ~273): `'#22b7cd'` → `'rgba(255,255,255,0.9)'`
4. **Active border-left on sub-links** (line ~309): `'#22b7cd'` → `'rgba(255,255,255,0.9)'`
5. **Active border-left on insights categories** (line ~388): `'#22b7cd'` → `'rgba(255,255,255,0.9)'`
6. **ArrowRight icon color** (line ~319): `text-[#22b7cd]` → `text-white`
7. **Contact Us button** (lines ~561-565):
   ```tsx
   className="ml-1 px-5 py-2.5 text-[14px] font-medium text-black bg-white hover:bg-white/90 transition-colors duration-150"
   ```
8. **Mobile Contact Us button** (line ~665):
   ```tsx
   className="flex justify-center px-6 py-3 text-[14px] font-medium text-black bg-white hover:bg-white/90 transition-colors"
   ```
9. **Mega menu top accent lines** (two instances, lines ~245 and ~363): change gradient to white:
   ```tsx
   style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.15) 70%, transparent 100%)' }}
   ```
10. **Mega menu glow blobs** (lines ~248-250, ~366-367): reduce opacity, change to white:
    ```tsx
    <div className="pointer-events-none absolute -top-20 -left-20 w-[400px] h-[300px] rounded-full bg-white/[0.03] blur-3xl" />
    <div className="pointer-events-none absolute -bottom-20 -right-20 w-[300px] h-[200px] rounded-full bg-white/[0.03] blur-3xl" />
    ```
11. **NavLink underline** (line ~473): `after:bg-[#22b7cd]` → `after:bg-white`

**Step 1: Make all the changes above in Navbar.tsx**

**Step 2: Verify build passes**
```bash
cd /data/projects/nex4-microsoft_website && npm run build 2>&1 | tail -10
```
Expected: `✓ built in` with no TypeScript errors

**Step 3: Commit**
```bash
git add src/components/common/Navbar.tsx
git commit -m "style: swap navbar cyan accents to white theme"
```

---

### Task 2: Update Footer — swap cyan to white

**Files:**
- Modify: `src/components/common/Footer.tsx`

**Read the file first, then apply:**
1. Any `#22b7cd` color → white equivalent
2. Any glow blobs → change `bg-[#22b7cd]/[...]` to `bg-white/[0.03]`
3. Social icon hover colors: `hover:text-[#22b7cd]` → `hover:text-white`
4. Any border accent using cyan → `rgba(255,255,255,0.08)`
5. CTA buttons/links using cyan → white

**Step 1: Read footer and identify all cyan usages**
```bash
grep -n "22b7cd\|0078d4\|0078D4" src/components/common/Footer.tsx
```

**Step 2: Apply all replacements**

**Step 3: Verify build**
```bash
npm run build 2>&1 | tail -5
```

**Step 4: Commit**
```bash
git add src/components/common/Footer.tsx
git commit -m "style: swap footer cyan accents to white theme"
```

---

### Task 3: Update ScrollProgress — bar color to white

**Files:**
- Modify: `src/components/common/ScrollProgress.tsx`

**Change:** progress bar color from `#0078D4` (or any blue) to `rgba(255,255,255,0.6)`

**Step 1: Read and update**
Read `src/components/common/ScrollProgress.tsx`, find the progress bar color, change to `rgba(255,255,255,0.6)`.

**Step 2: Commit**
```bash
git add src/components/common/ScrollProgress.tsx
git commit -m "style: scroll progress bar to white"
```

---

### Task 4: Create HeroSlider component

**Files:**
- Create: `src/components/home/HeroSlider.tsx`

**Full implementation:**

```tsx
import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Slide {
  eyebrow: string;
  headlinePre: string;
  headlineAccent: string;
  headlinePost: string;
  cta: string;
  ctaHref: string;
  image: string;
}

const SLIDES: Slide[] = [
  {
    eyebrow: 'Workplace AI',
    headlinePre: 'Empower Your People with a Smarter',
    headlineAccent: 'Digital Workplace',
    headlinePost: '',
    cta: 'Explore Workplace AI',
    ctaHref: '/services/workplace-ai',
    image: '/images/card-bg-3.png',
  },
  {
    eyebrow: 'Workplace Security',
    headlinePre: 'Protect What Matters. Secure',
    headlineAccent: 'Every Endpoint.',
    headlinePost: '',
    cta: 'Explore Security',
    ctaHref: '/services/workplace-security',
    image: '/images/card-bg-2.png',
  },
  {
    eyebrow: 'Cloud Migration',
    headlinePre: 'Your Journey to Azure',
    headlineAccent: 'Starts Here',
    headlinePost: '',
    cta: 'Explore Cloud',
    ctaHref: '/services/cloud-migration',
    image: '/images/card-bg-4.png',
  },
];

const INTERVAL_MS = 5000;

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.55, ease: [0.32, 0, 0.67, 0] as const },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
    transition: { duration: 0.35, ease: [0.33, 1, 0.68, 1] as const },
  }),
};

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);

  const go = useCallback(
    (next: number) => {
      setDir(next > index ? 1 : -1);
      setIndex(next);
    },
    [index],
  );

  const prev = () => go((index - 1 + SLIDES.length) % SLIDES.length);
  const next = () => go((index + 1) % SLIDES.length);

  useEffect(() => {
    const id = setInterval(() => {
      setDir(1);
      setIndex((i) => (i + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[index];
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <section className="relative bg-black overflow-hidden" style={{ minHeight: 'calc(100vh - 76px)' }}>
      <div className="max-w-[1240px] mx-auto px-10 h-full flex items-center" style={{ minHeight: 'calc(100vh - 76px)' }}>

        {/* Left — text */}
        <div className="relative z-10 flex-1 pr-12 py-24">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={index}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {/* Eyebrow */}
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-semibold mb-6">
                {slide.eyebrow}
              </p>

              {/* Headline */}
              <h1 className="text-[52px] lg:text-[62px] font-light leading-[1.1] text-white mb-10 max-w-[580px]">
                {slide.headlinePre}{' '}
                <span className="font-semibold text-white">{slide.headlineAccent}</span>
                {slide.headlinePost && ' ' + slide.headlinePost}
              </h1>

              {/* CTA */}
              <Link
                to={slide.ctaHref}
                className="group inline-flex flex-col gap-2"
              >
                <span className="text-[14px] font-semibold text-white/70 group-hover:text-white transition-colors duration-200">
                  {slide.cta}
                </span>
                <ArrowRight
                  size={18}
                  className="text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all duration-200"
                />
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="absolute bottom-12 left-0 flex items-center gap-4">
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:border-white/60 hover:text-white transition-all duration-200"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:border-white/60 hover:text-white transition-all duration-200"
            >
              <ArrowRight size={16} />
            </button>
            <span className="text-[13px] text-white/30 font-mono tracking-widest ml-1">
              {pad(index + 1)} / {pad(SLIDES.length)}
            </span>
          </div>
        </div>

        {/* Right — image */}
        <div className="hidden lg:block relative w-[45%] shrink-0" style={{ height: 'calc(100vh - 76px)' }}>
          {/* Left fade */}
          <div className="absolute inset-y-0 left-0 w-40 z-10 bg-gradient-to-r from-black to-transparent" />
          <AnimatePresence mode="wait">
            <motion.img
              key={index}
              src={slide.image}
              alt=""
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.7, ease: 'easeOut' } }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
        </div>

      </div>

      {/* Progress bar — thin white line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/5">
        <motion.div
          key={index}
          className="h-full bg-white/30"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: INTERVAL_MS / 1000, ease: 'linear' }}
        />
      </div>
    </section>
  );
}
```

**Step 1: Create the file with the code above**

**Step 2: Verify TypeScript**
```bash
cd /data/projects/nex4-microsoft_website && npm run build 2>&1 | tail -10
```
Expected: built with no errors

**Step 3: Wire into Home.tsx temporarily to verify**

In `src/pages/Home.tsx`:
```tsx
import { HeroSlider } from '@/components/home/HeroSlider';

export function Home() {
  return (
    <div className="pt-[76px]">
      <HeroSlider />
    </div>
  );
}
```

**Step 4: Commit**
```bash
git add src/components/home/HeroSlider.tsx src/pages/Home.tsx
git commit -m "feat: add HeroSlider component with 3 auto-advancing slides"
```

---

### Task 5: Create WhatWeDo component

**Files:**
- Create: `src/components/home/WhatWeDo.tsx`

**Full implementation:**

```tsx
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Card {
  category: string;
  headline: string;
  body: string;
  href: string;
}

const CARDS: Card[] = [
  {
    category: 'Workplace Security',
    headline: 'We help you protect your business from every angle.',
    body: 'Zero Trust frameworks, endpoint protection, and identity management — built for the modern hybrid workforce.',
    href: '/services/workplace-security',
  },
  {
    category: 'Workplace AI',
    headline: 'We help you unlock real value with Microsoft Copilot.',
    body: 'AI and data intelligence help your business adapt, innovate, and lead. From deployment to adoption.',
    href: '/services/workplace-ai',
  },
  {
    category: 'Workplace Automation',
    headline: 'We help you automate work and free your people.',
    body: 'Intelligent Power Platform workflows connect your apps, data, and teams — eliminating repetitive manual processes.',
    href: '/services/workplace-automation',
  },
  {
    category: 'Cloud Migration',
    headline: 'We help you move to Azure with confidence.',
    body: "Whether you're lifting-and-shifting or re-architecting, we guide every stage of your cloud journey.",
    href: '/services/cloud-migration',
  },
];

function ServiceCard({ card, index }: { card: Card; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      className="group flex flex-col px-8 py-10 hover:bg-white/[0.03] transition-colors duration-300"
      style={{
        borderRight: index < CARDS.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
      }}
    >
      <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-white/30 mb-5">
        {card.category}
      </p>
      <h3 className="text-[24px] font-semibold text-white leading-snug mb-5 flex-1">
        {card.headline}
      </h3>
      <p className="text-[14px] text-white/50 leading-relaxed mb-8">
        {card.body}
      </p>
      <Link
        to={card.href}
        className="inline-flex items-center gap-3 px-5 py-2.5 border border-white/15 text-white/60 text-[13px] font-medium rounded-full hover:border-white/50 hover:text-white transition-all duration-200 self-start group/btn"
      >
        Learn more
        <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform duration-200" />
      </Link>
    </motion.div>
  );
}

export function WhatWeDo() {
  const headingRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: '-60px' });

  return (
    <section className="bg-[#0a0a0a] py-24">
      <div className="max-w-[1240px] mx-auto px-10">

        {/* Heading */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-[42px] lg:text-[52px] font-semibold text-white mb-3">
            What we do
          </h2>
          <p className="text-[15px] text-white/40">
            Our core Microsoft solutions
          </p>
        </motion.div>

        {/* Cards grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 2 }}
        >
          {CARDS.map((card, i) => (
            <ServiceCard key={card.category} card={card} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}
```

**Step 1: Create the file**

**Step 2: Add to Home.tsx**
```tsx
import { HeroSlider } from '@/components/home/HeroSlider';
import { WhatWeDo } from '@/components/home/WhatWeDo';

export function Home() {
  return (
    <div className="pt-[76px]">
      <HeroSlider />
      <WhatWeDo />
    </div>
  );
}
```

**Step 3: Build check**
```bash
npm run build 2>&1 | tail -5
```

**Step 4: Commit**
```bash
git add src/components/home/WhatWeDo.tsx src/pages/Home.tsx
git commit -m "feat: add WhatWeDo section with 4 service cards"
```

---

### Task 6: Create Testimonials component

**Files:**
- Create: `src/components/home/Testimonials.tsx`

**Full implementation:**

```tsx
import { useState, useRef } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Testimonial {
  quote: string;
  name: string;
  title: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote: 'The tailored strategies provided by NEX4 were transformative. We saw a significant increase in efficiency and a noticeable reduction in operational costs. Our employees are more satisfied and motivated than ever.',
    name: 'Trevor Virtue',
    title: 'Designer',
  },
  {
    quote: "NEX4's modern workspace design has revolutionized the way we work. The integration of advanced collaboration tools and ergonomic setups has boosted our productivity and employee engagement. Complaints about the workspace have dropped dramatically.",
    name: 'Emma Miller',
    title: 'SMM Manager',
  },
  {
    quote: "Migrating to the cloud with NEX4's support has been a game-changer. We've reduced our IT expenses by 40% and improved our operational scalability. The enhanced data security gives us peace of mind.",
    name: 'Paul Trueman',
    title: 'Designer',
  },
  {
    quote: 'The email migration process was seamless, with zero downtime and no data loss. NEX4\'s expertise ensured a smooth transition to Microsoft 365, and we\'ve experienced a significant reduction in email-related issues.',
    name: 'Anonymous',
    title: 'IT Manager',
  },
];

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const go = (next: number) => {
    setDir(next > index ? 1 : -1);
    setIndex(next);
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.45, ease: 'easeOut' as const } },
    exit: (d: number) => ({ x: d > 0 ? -40 : 40, opacity: 0, transition: { duration: 0.25 } }),
  };

  return (
    <section className="bg-black py-24 border-t border-white/[0.05]">
      <div className="max-w-[1240px] mx-auto px-10">

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-16">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/30 font-semibold mb-3">
              Testimonials
            </p>
            <h2 className="text-[38px] lg:text-[46px] font-semibold text-white">
              What they think of us
            </h2>
          </div>

          {/* Quote area */}
          <div className="max-w-[760px]">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={index}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {/* Large quote mark */}
                <div className="text-[80px] leading-none text-white/10 font-serif mb-4 select-none">
                  &ldquo;
                </div>
                <p className="text-[20px] lg:text-[22px] text-white/80 leading-relaxed font-light mb-10">
                  {TESTIMONIALS[index].quote}
                </p>
                <div className="border-t border-white/10 pt-6">
                  <p className="text-[15px] font-semibold text-white">{TESTIMONIALS[index].name}</p>
                  <p className="text-[13px] text-white/40 mt-0.5">{TESTIMONIALS[index].title}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-6 mt-12">
            <button
              onClick={() => go((index - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              className="flex items-center gap-2 text-[13px] text-white/40 hover:text-white transition-colors duration-200"
              aria-label="Previous testimonial"
            >
              <ArrowLeft size={16} />
              Prev
            </button>
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className="transition-all duration-200"
                  style={{
                    width: i === index ? 20 : 6,
                    height: 6,
                    borderRadius: 3,
                    background: i === index ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.15)',
                  }}
                />
              ))}
            </div>
            <button
              onClick={() => go((index + 1) % TESTIMONIALS.length)}
              className="flex items-center gap-2 text-[13px] text-white/40 hover:text-white transition-colors duration-200"
              aria-label="Next testimonial"
            >
              Next
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
```

**Step 1: Create the file**

**Step 2: Add to Home.tsx**
```tsx
import { Testimonials } from '@/components/home/Testimonials';
// add <Testimonials /> after <WhatWeDo />
```

**Step 3: Build check**
```bash
npm run build 2>&1 | tail -5
```

**Step 4: Commit**
```bash
git add src/components/home/Testimonials.tsx src/pages/Home.tsx
git commit -m "feat: add Testimonials section with 4 quotes and prev/next nav"
```

---

### Task 7: Create OurLocations component

**Files:**
- Create: `src/components/home/OurLocations.tsx`

**Full implementation:**

```tsx
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface Location {
  country: string;
  image: string;
  alt: string;
}

const LOCATIONS: Location[] = [
  {
    country: 'Myanmar',
    image: 'https://images.unsplash.com/photo-1570521462033-3015e76e7432?w=600&q=80&fit=crop',
    alt: 'Yangon, Myanmar',
  },
  {
    country: 'Thailand',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80&fit=crop',
    alt: 'Bangkok, Thailand',
  },
  {
    country: 'Cambodia',
    image: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=600&q=80&fit=crop',
    alt: 'Phnom Penh, Cambodia',
  },
  {
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80&fit=crop',
    alt: 'Tokyo, Japan',
  },
];

function LocationCard({ loc, index }: { loc: Location; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      className="group"
    >
      <div className="overflow-hidden mb-4" style={{ aspectRatio: '4/3' }}>
        <img
          src={loc.image}
          alt={loc.alt}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      </div>
      <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-white/60 group-hover:text-white transition-colors duration-200">
        {loc.country}
      </p>
    </motion.div>
  );
}

export function OurLocations() {
  const headingRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: '-60px' });

  return (
    <section className="bg-black py-24 border-t border-white/[0.05]">
      <div className="max-w-[1240px] mx-auto px-10">

        {/* Header row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <motion.div
            ref={headingRef}
            initial={{ opacity: 0, y: 20 }}
            animate={headingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-[60px] lg:text-[80px] font-light leading-[0.95] text-white">
              Our<br />Locations
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={headingInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-1">
              <span className="text-[12px] uppercase tracking-[0.18em] font-semibold text-white border-b border-white pb-1">
                APAC
              </span>
            </div>
          </motion.div>
        </div>

        {/* Location cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {LOCATIONS.map((loc, i) => (
            <LocationCard key={loc.country} loc={loc} index={i} />
          ))}
        </div>

        {/* Bottom accent line */}
        <div
          className="mt-20 h-px"
          style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.03) 60%, transparent 100%)' }}
        />

      </div>
    </section>
  );
}
```

**Step 1: Create the file**

**Step 2: Add to Home.tsx (final composition)**
```tsx
import { HeroSlider } from '@/components/home/HeroSlider';
import { WhatWeDo } from '@/components/home/WhatWeDo';
import { Testimonials } from '@/components/home/Testimonials';
import { OurLocations } from '@/components/home/OurLocations';

export function Home() {
  return (
    <div className="pt-[76px]">
      <HeroSlider />
      <WhatWeDo />
      <Testimonials />
      <OurLocations />
    </div>
  );
}
```

**Step 3: Final build check**
```bash
npm run build 2>&1 | tail -10
```
Expected: clean build, no TypeScript errors

**Step 4: Lint check**
```bash
npm run lint 2>&1 | tail -10
```
Expected: no errors

**Step 5: Commit**
```bash
git add src/components/home/OurLocations.tsx src/pages/Home.tsx
git commit -m "feat: add OurLocations section with APAC countries"
```

---

### Task 8: Final integration commit

**Step 1: Verify dev server starts**
```bash
npm run dev 2>&1 | head -10
```
Expected: `VITE vXX.XX ready` on port 3000

**Step 2: Final commit**
```bash
git add -A
git commit -m "feat: complete homepage with Hero, WhatWeDo, Testimonials, OurLocations sections"
```
