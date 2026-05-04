import { useState, useEffect, useRef, startTransition } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ASSETS } from '@/lib/assets';
import { supabase } from '@/lib/supabase';
import { BLOG_CATEGORY_LABEL, NEWS_CATEGORY_LABEL } from '@/lib/blogConstants';

// ─── Types & Data ──────────────────────────────────────────────────────────────

interface StoryCard {
  tag: string;
  title: string;
  body: string;
  href: string;
  image: string;
}

interface SubLink {
  id: string;
  label: string;
  href: string;
  cards: StoryCard[];
}

interface Section {
  id: string;
  label: string;
  links: SubLink[];
}

interface InsightItem {
  label: string;
  date: string;
  href: string;
}

interface InsightCategory {
  id: string;
  label: string;
  items: InsightItem[];
  cards: StoryCard[];
}

const IMG = {
  c1: ASSETS.cardBg1,
  c2: ASSETS.cardBg2,
  c3: ASSETS.cardBg3,
  c4: ASSETS.cardBg4,
  i1: ASSETS.insightsBg1,
  i2: ASSETS.insightsBg2,
};

const SERVICES_SECTIONS: Section[] = [
  {
    id: 'ai-workforce-experience',
    label: 'AI Workforce Experience',
    links: [
      {
        id: 'workforce-productivity',
        label: 'Workforce Productivity',
        href: '/services/ai-workforce-experience/workforce-productivity',
        cards: [
          { tag: 'Productivity', title: 'Unlock peak performance with Microsoft 365', body: 'Integrated M365 tools eliminate friction and drive measurable gains across every team.', href: '#', image: IMG.c1 },
          { tag: 'Case Study', title: 'From email overload to unified collaboration', body: 'How a 500-person firm cut meeting time by 40% after migrating to Teams and SharePoint.', href: '#', image: IMG.c2 },
        ],
      },
      {
        id: 'workforce-ai',
        label: 'Workforce AI',
        href: '/services/ai-workforce-experience/workforce-ai',
        cards: [
          { tag: 'AI', title: 'How Copilot accelerates a better workplace', body: 'AI and data intelligence help your business adapt, innovate, and lead.', href: '#', image: IMG.c3 },
          { tag: 'Insight', title: 'AI — the key to high-performance operations', body: 'AI integration redefines productivity and elevates business performance at scale.', href: '#', image: IMG.c4 },
        ],
      },
      {
        id: 'workforce-backup-recovery',
        label: 'Workforce Backup & Recovery',
        href: '/services/ai-workforce-experience/workforce-backup-recovery',
        cards: [
          { tag: 'Resilience', title: 'Why backup is non-negotiable for continuity', body: 'Ransomware and outages are inevitable. Your recovery strategy should be too.', href: '#', image: IMG.c1 },
          { tag: 'Best Practice', title: 'Cloud backup best practices for M365', body: 'Protect emails, Teams chats, and SharePoint with a layered, compliant backup strategy.', href: '#', image: IMG.c3 },
        ],
      },
    ],
  },
  {
    id: 'ai-workforce-process',
    label: 'AI Workforce Process',
    links: [
      {
        id: 'workforce-automation',
        label: 'Workforce Automation',
        href: '/services/ai-workforce-process/workforce-automation',
        cards: [
          { tag: 'Automation', title: 'Automate repetitive work with Power Automate', body: 'Build intelligent workflows that connect your apps, data, and people.', href: '#', image: IMG.c4 },
          { tag: 'Case Study', title: 'From manual to automated: a real transformation', body: 'A regional bank cut processing time by 70% using Power Platform in under 3 months.', href: '#', image: IMG.c1 },
        ],
      },
    ],
  },
  {
    id: 'ai-workforce-security',
    label: 'AI Workforce Security',
    links: [
      {
        id: 'workforce-security',
        label: 'Workforce Security',
        href: '/services/ai-workforce-security/workforce-security',
        cards: [
          { tag: 'Security', title: 'Zero Trust for the modern workforce', body: 'Verify every identity, device, and access request — regardless of location.', href: '#', image: IMG.c2 },
          { tag: 'Guide', title: 'Securing your hybrid workforce in 2025', body: 'Protect endpoints, data, and identities across your distributed organisation.', href: '#', image: IMG.c3 },
        ],
      },
    ],
  },
  {
    id: 'ai-workforce-data-cloud',
    label: 'AI Workforce Data & Cloud',
    links: [
      {
        id: 'cloud-migration',
        label: 'Cloud Migration',
        href: '/services/ai-workforce-data-cloud/cloud-migration',
        cards: [
          { tag: 'Cloud', title: 'Your journey to Azure starts here', body: "Whether you're lifting-and-shifting or re-architecting, we guide every stage.", href: '#', image: IMG.c3 },
          { tag: 'Lessons Learned', title: 'Cloud migration: what the data tells us', body: 'Key insights from 100+ migrations — what accelerates success and what teams miss.', href: '#', image: IMG.c4 },
        ],
      },
    ],
  },
];

// ─── Dynamic navbar data ───────────────────────────────────────────────────────

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

// Maps each service sub-link id → the DB category string shared by blog_posts / case_studies
const SERVICE_CATEGORY_MAP: Record<string, string> = {
  'workforce-productivity':    'workplace-productivity',
  'workforce-ai':              'workplace-ai',
  'workforce-backup-recovery': 'workplace-backup',
  'workforce-automation':      'workplace-automation',
  'workforce-security':        'workplace-security',
  'cloud-migration':           'cloud-migration',
};

interface NavbarData {
  insights:     Record<string, { items: InsightItem[]; cards: StoryCard[] }>;
  serviceCards: Record<string, StoryCard[]>;
}

// Module-level singleton — fetch once per page load
let navbarPromise: Promise<NavbarData> | null = null;

async function fetchNavbarData(): Promise<NavbarData> {
  const serviceCategories = Object.values(SERVICE_CATEGORY_MAP);
  const fallbacks = [IMG.i1, IMG.i2, IMG.c1, IMG.c2, IMG.c3, IMG.c4];

  const [
    { data: blogPosts },
    { data: newsArticles },
    { data: events },
    { data: caseStudies },
    { data: serviceBlog },
    { data: serviceCS },
    { data: serviceEvents },
    { data: serviceNews },
  ] = await Promise.all([
    supabase.from('blog_posts').select('title,slug,excerpt,hero_image_url,category,published_at').order('published_at', { ascending: false }).limit(10),
    supabase.from('news_articles').select('title,slug,excerpt,hero_image_url,category,published_at').order('published_at', { ascending: false }).limit(10),
    supabase.from('events').select('title,slug,description,hero_image_url,category,event_date,status').order('event_date', { ascending: false }).limit(10),
    supabase.from('case_studies').select('title,slug,excerpt,image_url,category,created_at').order('created_at', { ascending: false }).limit(10),
    supabase.from('blog_posts').select('title,slug,excerpt,hero_image_url,category,published_at').in('category', serviceCategories).order('published_at', { ascending: false }).limit(60),
    supabase.from('case_studies').select('title,slug,excerpt,image_url,category,created_at').in('category', serviceCategories).order('created_at', { ascending: false }).limit(60),
    supabase.from('events').select('title,slug,description,hero_image_url,category,event_date,status').in('category', serviceCategories).order('event_date', { ascending: false }).limit(60),
    supabase.from('news_articles').select('title,slug,excerpt,hero_image_url,category,published_at').in('category', serviceCategories).order('published_at', { ascending: false }).limit(60),
  ]);

  function toCard(item: Record<string, string>, tag: string, href: string, fallback: string): StoryCard {
    return {
      tag,
      title:  item.title ?? '',
      body:   (item.excerpt ?? item.description ?? '').slice(0, 120),
      href,
      image:  item.hero_image_url || item.image_url || fallback,
    };
  }

  const blog  = (blogPosts    ?? []) as Record<string, string>[];
  const news  = (newsArticles ?? []) as Record<string, string>[];
  const evts  = (events       ?? []) as Record<string, string>[];
  const cs    = (caseStudies  ?? []) as Record<string, string>[];
  const sBlog = (serviceBlog  ?? []) as Record<string, string>[];
  const sCS   = (serviceCS    ?? []) as Record<string, string>[];
  const sEvts = (serviceEvents ?? []) as Record<string, string>[];
  const sNews = (serviceNews  ?? []) as Record<string, string>[];

  // ── Insights panels — store ALL fetched items as cycling cards ──
  const insights: NavbarData['insights'] = {
    blog: {
      items: blog.slice(0, 5).map(p => ({ label: p.title, date: shortDate(p.published_at), href: `/blog/${p.slug}` })),
      cards: blog.map((p, i) => toCard(p, BLOG_CATEGORY_LABEL[p.category as keyof typeof BLOG_CATEGORY_LABEL] ?? 'Blog', `/blog/${p.slug}`, fallbacks[i % fallbacks.length])),
    },
    'case-studies': {
      items: cs.slice(0, 5).map(c => ({ label: c.title, date: shortDate(c.created_at), href: `/case-studies/${c.slug}` })),
      cards: cs.map((c, i) => toCard(c, 'Case Study', `/case-studies/${c.slug}`, fallbacks[i % fallbacks.length])),
    },
    events: {
      items: evts.slice(0, 5).map(e => ({ label: e.title, date: shortDate(e.event_date), href: `/events/${e.slug}` })),
      cards: evts.map((e, i) => toCard(e, e.status === 'upcoming' ? 'Upcoming' : 'On Demand', `/events/${e.slug}`, fallbacks[i % fallbacks.length])),
    },
    news: {
      items: news.slice(0, 5).map(a => ({ label: a.title, date: shortDate(a.published_at), href: `/news/${a.slug}` })),
      cards: news.map((a, i) => toCard(a, NEWS_CATEGORY_LABEL[a.category as keyof typeof NEWS_CATEGORY_LABEL] ?? 'News', `/news/${a.slug}`, fallbacks[i % fallbacks.length])),
    },
  };

  // ── Service featured cards — ALL resource types, full list for cycling ──
  const serviceCards: NavbarData['serviceCards'] = {};
  for (const [subId, cat] of Object.entries(SERVICE_CATEGORY_MAP)) {
    const merged = [
      ...sBlog.filter(p => p.category === cat).map(p => ({ ...p, _ts: p.published_at, _type: 'blog'  as const })),
      ...sCS  .filter(c => c.category === cat).map(c => ({ ...c, _ts: c.created_at,   _type: 'cs'    as const })),
      ...sEvts.filter(e => e.category === cat).map(e => ({ ...e, _ts: e.event_date,   _type: 'event' as const })),
      ...sNews.filter(a => a.category === cat).map(a => ({ ...a, _ts: a.published_at, _type: 'news'  as const })),
    ].sort((a, b) => b._ts.localeCompare(a._ts));

    serviceCards[subId] = merged.map((item, i) => {
      const rec = item as Record<string, string>;
      const fb  = fallbacks[i % fallbacks.length];
      if (item._type === 'blog')  return toCard(rec, BLOG_CATEGORY_LABEL[rec.category as keyof typeof BLOG_CATEGORY_LABEL] ?? 'Blog', `/blog/${rec.slug}`, fb);
      if (item._type === 'cs')    return toCard(rec, 'Case Study', `/case-studies/${rec.slug}`, fb);
      if (item._type === 'event') return toCard(rec, rec.status === 'upcoming' ? 'Upcoming Event' : 'On Demand', `/events/${rec.slug}`, fb);
      return toCard(rec, NEWS_CATEGORY_LABEL[rec.category as keyof typeof NEWS_CATEGORY_LABEL] ?? 'News', `/news/${rec.slug}`, fb);
    });
  }

  return { insights, serviceCards };
}

// Static skeleton used before data loads / if fetch fails
const INSIGHTS_SKELETON: InsightCategory[] = [
  { id: 'blog',          label: 'Blog',          items: [], cards: [] },
  { id: 'case-studies',  label: 'Case Studies',  items: [], cards: [] },
  { id: 'events',        label: 'Events',        items: [], cards: [] },
  { id: 'news',          label: 'News',          items: [], cards: [] },
];

function useNavbarData(): { insightCats: InsightCategory[]; serviceCards: Record<string, StoryCard[]> } {
  const [data, setData] = useState<NavbarData | null>(null);

  useEffect(() => {
    if (!navbarPromise) navbarPromise = fetchNavbarData();
    navbarPromise.then(setData).catch(() => { /* keep skeleton */ });
  }, []);

  const insightCats = INSIGHTS_SKELETON.map(cat => ({
    ...cat,
    items: data?.insights[cat.id]?.items ?? [],
    cards: data?.insights[cat.id]?.cards ?? [],
  }));

  return { insightCats, serviceCards: data?.serviceCards ?? {} };
}

// ─── Story Card ────────────────────────────────────────────────────────────────

function StoryCard({ card }: { card: StoryCard }) {
  return (
    <Link
      to={card.href}
      className="relative flex flex-col justify-end overflow-hidden group rounded-xl"
      style={{ minHeight: 240 }}
    >
      <img
        src={card.image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
      <div className="relative z-10 p-5 pt-12">
        <span className="block text-[11px] uppercase tracking-[0.14em] font-semibold text-white/40 mb-2">
          {card.tag}
        </span>
        <h4 className="text-white text-[15px] font-semibold leading-snug mb-2">{card.title}</h4>
        <p className="text-white/50 text-[13px] leading-relaxed mb-4 line-clamp-2">{card.body}</p>
        <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white/50 group-hover:text-white transition-colors duration-200">
          Read more
          <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform duration-200" />
        </span>
      </div>
    </Link>
  );
}

// ─── Shared Panel Label ────────────────────────────────────────────────────────

function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] uppercase tracking-[0.14em] font-semibold text-white/25 mb-5">
      {children}
    </p>
  );
}

// ─── Services Mega Menu ────────────────────────────────────────────────────────

const CYCLE_MS = 4000;

function ServicesMegaMenu({ visible, serviceCards }: { visible: boolean; serviceCards: Record<string, StoryCard[]> }) {
  const [activeSectionId, setActiveSectionId] = useState(SERVICES_SECTIONS[0].id);
  const [activeSubId, setActiveSubId]         = useState(SERVICES_SECTIONS[0].links[0].id);
  const [pairIndex, setPairIndex]             = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeSection = SERVICES_SECTIONS.find((s) => s.id === activeSectionId) ?? SERVICES_SECTIONS[0];
  const activeSub     = activeSection.links.find((l) => l.id === activeSubId) ?? activeSection.links[0];

  const dynamic   = serviceCards[activeSub.id];
  const allCards  = dynamic && dynamic.length > 0 ? dynamic : activeSub.cards;
  const pairCount = Math.max(1, Math.ceil(allCards.length / 2));
  const visibleCards = allCards.slice(pairIndex * 2, pairIndex * 2 + 2);

  // Restart card cycling whenever the active sub-link or total pairs change
  useEffect(() => {
    setPairIndex(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!visible || pairCount <= 1) return;
    intervalRef.current = setInterval(() => {
      setPairIndex(prev => (prev + 1) % pairCount);
    }, CYCLE_MS);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [activeSub.id, visible, pairCount]);

  const handleSectionEnter = (sectionId: string) => {
    const section = SERVICES_SECTIONS.find((s) => s.id === sectionId)!;
    setActiveSectionId(sectionId);
    setActiveSubId(section.links[0].id);
  };

  const handleSubEnter = (subId: string) => {
    setActiveSubId(subId);
  };

  return (
    <div
      className={cn(
        'absolute top-full left-0 right-0 z-50 transition-[opacity,transform] duration-200 ease-out origin-top',
        visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none',
      )}
    >
      <div
        className="relative bg-black shadow-[0_16px_48px_rgba(0,0,0,0.8)]"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Top accent line */}
        <div
          className="pointer-events-none absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.15) 70%, transparent 100%)' }}
        />
        {/* Ambient glow bleeding in from top-left */}
        <div className="pointer-events-none absolute -top-20 -left-20 w-[400px] h-[300px] rounded-full bg-white/[0.03] blur-3xl" />
        {/* Ambient glow bleeding in from bottom-right */}
        <div className="pointer-events-none absolute -bottom-20 -right-20 w-[300px] h-[200px] rounded-full bg-white/[0.03] blur-3xl" />

        <div className="max-w-[1240px] mx-auto flex" style={{ minHeight: 380 }}>

          {/* Panel 1 — Main sections */}
          <div
            className="w-[220px] shrink-0 py-9 px-7 bg-gradient-to-b from-white/[0.06] to-transparent"
            style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}
          >
            <PanelLabel>Solutions</PanelLabel>
            <ul className="space-y-0.5">
              {SERVICES_SECTIONS.map((section) => (
                <li key={section.id}>
                  <button
                    onMouseEnter={() => handleSectionEnter(section.id)}
                    className={cn(
                      'w-full text-left flex items-center justify-between gap-3 px-3 py-3 transition-all duration-150',
                      activeSectionId === section.id
                        ? 'text-white'
                        : 'text-[#a0a0a8] hover:text-white',
                    )}
                    style={
                      activeSectionId === section.id
                        ? { borderLeft: '2px solid rgba(255,255,255,0.9)', paddingLeft: 10, background: 'rgba(255,255,255,0.04)' }
                        : { borderLeft: '2px solid transparent', paddingLeft: 10 }
                    }
                  >
                    <span className="text-[16px] font-medium">{section.label}</span>
                    <ChevronRight
                      size={14}
                      className={cn(
                        'shrink-0 transition-opacity duration-150',
                        activeSectionId === section.id ? 'opacity-40' : 'opacity-0',
                      )}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Panel 2 — Sub-links */}
          <div
            className="w-[280px] shrink-0 py-9 px-7"
            style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}
          >
            <PanelLabel>{activeSection.label}</PanelLabel>
            <ul className="space-y-0.5">
              {activeSection.links.map((link) => (
                <li key={link.id}>
                  <Link
                    to={link.href}
                    onMouseEnter={() => handleSubEnter(link.id)}
                    className={cn(
                      'flex items-center justify-between gap-3 px-3 py-3 transition-all duration-150',
                      activeSubId === link.id ? 'text-white' : 'text-[#a0a0a8] hover:text-white',
                    )}
                    style={
                      activeSubId === link.id
                        ? { borderLeft: '2px solid rgba(255,255,255,0.9)', paddingLeft: 10, background: 'rgba(255,255,255,0.04)' }
                        : { borderLeft: '2px solid transparent', paddingLeft: 10 }
                    }
                  >
                    <span className="text-[16px]">{link.label}</span>
                    <ChevronRight
                      size={13}
                      className={cn(
                        'shrink-0 text-white transition-all duration-150',
                        activeSubId === link.id ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Panel 3 — Story cards */}
          <div className="flex-1 py-9 px-8">
            <div className="flex items-center justify-between mb-5">
              <p className="text-[11px] uppercase tracking-[0.14em] font-semibold text-white/25">Featured</p>
              {pairCount > 1 && (
                <div className="flex gap-1.5 items-center">
                  {Array.from({ length: pairCount }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPairIndex(i)}
                      className={cn(
                        'h-1 rounded-full transition-all duration-300',
                        pairIndex === i ? 'w-5 bg-white/50' : 'w-1.5 bg-white/20 hover:bg-white/35',
                      )}
                    />
                  ))}
                </div>
              )}
            </div>
            {visibleCards.length > 0 ? (
              <div key={`${activeSub.id}-${pairIndex}`} className="grid grid-cols-2 gap-4 h-[calc(100%-36px)] animate-fade-in">
                {visibleCards.map((card, i) => <StoryCard key={i} card={card} />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 h-[calc(100%-36px)]">
                {[0, 1].map(i => <div key={i} className="bg-white/[0.03] animate-pulse rounded-xl" style={{ minHeight: 240 }} />)}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── Insights Mega Menu ────────────────────────────────────────────────────────

function InsightsMegaMenu({ visible }: { visible: boolean }) {
  const { insightCats: categories } = useNavbarData();
  const [activeCatId, setActiveCatId] = useState(INSIGHTS_SKELETON[0].id);
  const [pairIndex, setPairIndex]     = useState(0);
  const activeCat   = categories.find((c) => c.id === activeCatId) ?? categories[0];
  const navigate    = useNavigate();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pairCount    = Math.max(1, Math.ceil(activeCat.cards.length / 2));
  const visibleCards = activeCat.cards.slice(pairIndex * 2, pairIndex * 2 + 2);

  useEffect(() => {
    setPairIndex(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!visible || pairCount <= 1) return;
    intervalRef.current = setInterval(() => {
      setPairIndex(prev => (prev + 1) % pairCount);
    }, CYCLE_MS);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [activeCatId, visible, pairCount]);

  const handleCatEnter = (catId: string) => {
    setActiveCatId(catId);
  };

  return (
    <div
      className={cn(
        'absolute top-full left-0 right-0 z-50 transition-[opacity,transform] duration-200 ease-out origin-top',
        visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none',
      )}
    >
      <div
        className="relative bg-black shadow-[0_16px_48px_rgba(0,0,0,0.8)]"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Top accent line */}
        <div
          className="pointer-events-none absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.15) 70%, transparent 100%)' }}
        />
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -top-20 -left-20 w-[400px] h-[300px] rounded-full bg-white/[0.03] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 w-[300px] h-[200px] rounded-full bg-white/[0.03] blur-3xl" />

        <div className="max-w-[1240px] mx-auto flex" style={{ minHeight: 380 }}>

          {/* Panel 1 — Categories */}
          <div
            className="w-[220px] shrink-0 py-9 px-7 bg-gradient-to-b from-white/[0.06] to-transparent"
            style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}
          >
            <PanelLabel>Insights</PanelLabel>
            <ul className="space-y-0.5">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onMouseEnter={() => handleCatEnter(cat.id)}
                    onClick={() => navigate('/' + cat.id)}
                    className={cn(
                      'w-full text-left flex items-center justify-between gap-3 px-3 py-3 transition-all duration-150',
                      activeCatId === cat.id ? 'text-white' : 'text-[#a0a0a8] hover:text-white',
                    )}
                    style={
                      activeCatId === cat.id
                        ? { borderLeft: '2px solid rgba(255,255,255,0.9)', paddingLeft: 10, background: 'rgba(255,255,255,0.04)' }
                        : { borderLeft: '2px solid transparent', paddingLeft: 10 }
                    }
                  >
                    <span className="text-[16px] font-medium">{cat.label}</span>
                    <ChevronRight
                      size={14}
                      className={cn(
                        'shrink-0 transition-opacity duration-150',
                        activeCatId === cat.id ? 'opacity-40' : 'opacity-0',
                      )}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Panel 2 — Recent items */}
          <div
            className="w-[320px] shrink-0 py-9 px-7"
            style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}
          >
            <PanelLabel>Recent {activeCat.label}</PanelLabel>
            {activeCat.items.length > 0 ? (
              <ul className="space-y-0.5">
                {activeCat.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className="flex items-start justify-between gap-4 px-3 py-3 text-[#a0a0a8] hover:text-white transition-colors duration-150"
                      style={{ borderLeft: '2px solid transparent' }}
                    >
                      <span className="text-[15px] leading-snug line-clamp-2">{item.label}</span>
                      <span className="text-[11px] text-white/25 shrink-0 mt-0.5 font-medium">{item.date}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="space-y-2 px-3">
                {[70, 55, 65].map((w, i) => (
                  <div key={i} className="h-3 bg-white/[0.04] rounded-sm animate-pulse" style={{ width: `${w}%` }} />
                ))}
              </div>
            )}
            <div className="mt-5 px-3">
              <Link
                to={`/${activeCat.id}`}
                className="inline-flex items-center gap-2 text-[13px] font-medium text-white/30 hover:text-white transition-colors duration-150"
              >
                View all {activeCat.label}
                <ChevronRight size={12} />
              </Link>
            </div>
          </div>

          {/* Panel 3 — Featured cards */}
          <div className="flex-1 py-9 px-8">
            <div className="flex items-center justify-between mb-5">
              <p className="text-[11px] uppercase tracking-[0.14em] font-semibold text-white/25">Featured</p>
              {pairCount > 1 && (
                <div className="flex gap-1.5 items-center">
                  {Array.from({ length: pairCount }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPairIndex(i)}
                      className={cn(
                        'h-1 rounded-full transition-all duration-300',
                        pairIndex === i ? 'w-5 bg-white/50' : 'w-1.5 bg-white/20 hover:bg-white/35',
                      )}
                    />
                  ))}
                </div>
              )}
            </div>
            {visibleCards.length > 0 ? (
              <div key={`${activeCatId}-${pairIndex}`} className="grid grid-cols-2 gap-4 h-[calc(100%-36px)] animate-fade-in">
                {visibleCards.map((card, i) => (
                  <StoryCard key={i} card={card} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 h-[calc(100%-36px)]">
                {[0, 1].map(i => (
                  <div key={i} className="bg-white/[0.03] animate-pulse rounded-xl" style={{ minHeight: 240 }} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── Nav Link with underline hover ────────────────────────────────────────────

function NavLink({
  children,
  isActive,
  onClick,
  as: Tag = 'button',
  to,
}: {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  as?: 'button' | typeof Link;
  to?: string;
}) {
  const cls = cn(
    'relative flex items-center gap-1.5 px-4 py-2 text-[16px] transition-colors duration-150 select-none',
    'after:absolute after:bottom-0 after:left-4 after:right-4 after:h-[2px] after:transition-all after:duration-150',
    isActive
      ? 'text-white after:bg-white after:opacity-100'
      : 'text-[#a0a0a8] hover:text-white after:bg-white after:opacity-0 hover:after:opacity-100',
  );

  if (Tag === Link && to) {
    return <Link to={to} className={cls} onClick={onClick}>{children}</Link>;
  }
  return <button className={cls} onClick={onClick}>{children}</button>;
}

// ─── Navbar ────────────────────────────────────────────────────────────────────

type MenuKey = 'services' | 'insights' | null;

export function Navbar() {
  const { serviceCards } = useNavbarData();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuKey>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    startTransition(() => {
      setOpenMenu(null);
      setMobileOpen(false);
    });
  }, [location]);

  const open = (key: MenuKey) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(key);
  };

  const close = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 100);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-black shadow-[0_1px_0_rgba(255,255,255,0.06)]'
          : 'bg-black',
      )}
    >
      {/* Bottom accent line */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'rgba(255,255,255,0.08)' }}
      />
      {/* ── Main bar ── */}
      <div className="max-w-[1240px] mx-auto px-10 flex items-center justify-between h-[76px]">

        {/* Logo */}
        <Link to="/" className="shrink-0" onClick={() => setOpenMenu(null)}>
          <img src={ASSETS.logo} alt="NEX4" className="h-9 w-auto object-contain" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center">
          <div onMouseEnter={() => open('services')} onMouseLeave={close}>
            <NavLink isActive={openMenu === 'services'}>
              Services <ChevronDown size={14} className={cn('text-white/40 transition-transform duration-200', openMenu === 'services' && 'rotate-180')} />
            </NavLink>
          </div>

          <div onMouseEnter={() => open('insights')} onMouseLeave={close}>
            <NavLink isActive={openMenu === 'insights'}>
              Insights <ChevronDown size={14} className={cn('text-white/40 transition-transform duration-200', openMenu === 'insights' && 'rotate-180')} />
            </NavLink>
          </div>

          <NavLink as={Link} to="/careers">Careers</NavLink>

          <NavLink as={Link} to="/contact-us">Contact Us</NavLink>
        </nav>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 text-[#a0a0a8] hover:text-white transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── Mega menu hover zones ── */}
      <div
        onMouseEnter={() => open('services')}
        onMouseLeave={close}
        className="absolute top-[76px] left-0 right-0"
      >
        <ServicesMegaMenu visible={openMenu === 'services'} serviceCards={serviceCards} />
      </div>
      <div
        onMouseEnter={() => open('insights')}
        onMouseLeave={close}
        className="absolute top-[76px] left-0 right-0"
      >
        <InsightsMegaMenu visible={openMenu === 'insights'} />
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div
          className="lg:hidden bg-[#0d0e14] max-h-[80vh] overflow-y-auto"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          {/* Services */}
          <button
            className="w-full flex items-center justify-between px-8 py-4 text-[16px] text-[#a0a0a8]"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
            onClick={() => setMobileSection(mobileSection === 'services' ? null : 'services')}
          >
            Services
            <ChevronDown size={14} className={cn('transition-transform', mobileSection === 'services' && 'rotate-180')} />
          </button>
          {mobileSection === 'services' && (
            <div style={{ background: 'rgba(255,255,255,0.02)' }}>
              {SERVICES_SECTIONS.map((section) => (
                <div key={section.id} className="py-3">
                  <p className="px-10 text-[11px] uppercase tracking-[0.12em] text-white/25 font-semibold mb-1">
                    {section.label}
                  </p>
                  {section.links.map((link) => (
                    <Link
                      key={link.id}
                      to={link.href}
                      className="flex items-center gap-3 px-10 py-2.5 text-[16px] text-[#a0a0a8] hover:text-white transition-colors"
                    >
                      <span className="w-1 h-1 rounded-full bg-white/20 shrink-0" />
                      {link.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Insights */}
          <button
            className="w-full flex items-center justify-between px-8 py-4 text-[16px] text-[#a0a0a8]"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
            onClick={() => setMobileSection(mobileSection === 'insights' ? null : 'insights')}
          >
            Insights
            <ChevronDown size={14} className={cn('transition-transform', mobileSection === 'insights' && 'rotate-180')} />
          </button>
          {mobileSection === 'insights' && (
            <div style={{ background: 'rgba(255,255,255,0.02)' }}>
              {INSIGHTS_SKELETON.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/${cat.id}`}
                  className="flex items-center gap-3 px-10 py-2.5 text-[16px] text-[#a0a0a8] hover:text-white transition-colors"
                >
                  <span className="w-1 h-1 rounded-full bg-white/20 shrink-0" />
                  {cat.label}
                </Link>
              ))}
            </div>
          )}

          <Link
            to="/careers"
            className="flex px-8 py-4 text-[16px] text-[#a0a0a8] hover:text-white transition-colors"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
          >
            Careers
          </Link>
          <Link
            to="/contact-us"
            className="flex px-8 py-4 text-[16px] text-[#a0a0a8] hover:text-white transition-colors"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
          >
            Contact Us
          </Link>
        </div>
      )}
    </header>
  );
}
