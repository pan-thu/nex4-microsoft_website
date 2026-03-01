import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ChevronRight, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  cards: [StoryCard, StoryCard];
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
  cards: [StoryCard, StoryCard];
}

const IMG = {
  c1: '/images/card-bg-1.png',
  c2: '/images/card-bg-2.png',
  c3: '/images/card-bg-3.png',
  c4: '/images/card-bg-4.png',
  i1: '/images/card-bg-insights-1.png',
  i2: '/images/card-bg-insights-2.png',
};

const SERVICES_SECTIONS: Section[] = [
  {
    id: 'digital-workplace',
    label: 'Digital Workplace',
    links: [
      {
        id: 'wp-productivity',
        label: 'Workplace Productivity',
        href: '/services/workplace-productivity',
        cards: [
          { tag: 'Productivity', title: 'Unlock peak performance with Microsoft 365', body: 'Integrated M365 tools eliminate friction and drive measurable gains across every team.', href: '#', image: IMG.c1 },
          { tag: 'Case Study', title: 'From email overload to unified collaboration', body: 'How a 500-person firm cut meeting time by 40% after migrating to Teams and SharePoint.', href: '#', image: IMG.c2 },
        ],
      },
      {
        id: 'wp-security',
        label: 'Workplace Security',
        href: '/services/workplace-security',
        cards: [
          { tag: 'Security', title: 'Zero Trust for the modern workforce', body: 'Verify every identity, device, and access request — regardless of location.', href: '#', image: IMG.c2 },
          { tag: 'Guide', title: 'Securing your hybrid workforce in 2025', body: 'Protect endpoints, data, and identities across your distributed organisation.', href: '#', image: IMG.c3 },
        ],
      },
      {
        id: 'wp-ai',
        label: 'Workplace AI',
        href: '/services/workplace-ai',
        cards: [
          { tag: 'AI', title: 'How Copilot accelerates a better workplace', body: 'AI and data intelligence help your business adapt, innovate, and lead.', href: '#', image: IMG.c3 },
          { tag: 'Insight', title: 'AI — the key to high-performance operations', body: 'AI integration redefines productivity and elevates business performance at scale.', href: '#', image: IMG.c4 },
        ],
      },
      {
        id: 'wp-automation',
        label: 'Workplace Automation',
        href: '/services/workplace-automation',
        cards: [
          { tag: 'Automation', title: 'Automate repetitive work with Power Automate', body: 'Build intelligent workflows that connect your apps, data, and people.', href: '#', image: IMG.c4 },
          { tag: 'Case Study', title: 'From manual to automated: a real transformation', body: 'A regional bank cut processing time by 70% using Power Platform in under 3 months.', href: '#', image: IMG.c1 },
        ],
      },
      {
        id: 'wp-backup',
        label: 'Workplace Backup',
        href: '/services/workplace-backup',
        cards: [
          { tag: 'Resilience', title: 'Why backup is non-negotiable for continuity', body: 'Ransomware and outages are inevitable. Your recovery strategy should be too.', href: '#', image: IMG.c1 },
          { tag: 'Best Practice', title: 'Cloud backup best practices for M365', body: 'Protect emails, Teams chats, and SharePoint with a layered, compliant backup strategy.', href: '#', image: IMG.c3 },
        ],
      },
    ],
  },
  {
    id: 'cloud',
    label: 'Cloud',
    links: [
      {
        id: 'cloud-migration',
        label: 'Cloud Migration',
        href: '/services/cloud-migration',
        cards: [
          { tag: 'Cloud', title: 'Your journey to Azure starts here', body: "Whether you're lifting-and-shifting or re-architecting, we guide every stage.", href: '#', image: IMG.c3 },
          { tag: 'Lessons Learned', title: 'Cloud migration: what the data tells us', body: 'Key insights from 100+ migrations — what accelerates success and what teams miss.', href: '#', image: IMG.c4 },
        ],
      },
    ],
  },
];

const INSIGHTS_CATEGORIES: InsightCategory[] = [
  {
    id: 'blog',
    label: 'Blog',
    items: [
      { label: 'How AI Creates a Better Workplace', date: 'Mar 2025', href: '/blog/how-ai-create-better-workplace' },
      { label: 'Modern Architecture & Interior Design', date: 'Feb 2025', href: '/blog/modern-architecture-and-interior' },
      { label: 'Design a Perfect Home Office', date: 'Jan 2025', href: '/blog/design-a-perfect-home' },
    ],
    cards: [
      { tag: 'Blog', title: 'How AI Creates a Better Workplace', body: 'Discover how AI-driven tools are reshaping collaboration, decision-making, and productivity.', href: '/blog/how-ai-create-better-workplace', image: IMG.i1 },
      { tag: 'Blog', title: 'Modern Workspace Architecture', body: 'The intersection of physical space and digital infrastructure in enterprise environments.', href: '/blog/modern-architecture-and-interior', image: IMG.i2 },
    ],
  },
  {
    id: 'case-studies',
    label: 'Case Studies',
    items: [
      { label: 'Inspiring Design Trends This Fall', date: 'Mar 2025', href: '/case-studies/inspiring-design-trends-this-fall' },
      { label: 'Tips for Planning a Project', date: 'Jul 2024', href: '/case-studies/tips-for-planning-a-project' },
      { label: 'Enhanced Business Critical App Security', date: 'May 2024', href: '#' },
    ],
    cards: [
      { tag: 'Case Study', title: 'Enhanced Business App Security on AWS', body: 'How we secured a business-critical application on public cloud with zero downtime.', href: '#', image: IMG.i2 },
      { tag: 'Case Study', title: 'Inspiring Design Trends This Fall', body: 'Exploring the latest workplace and technology design trends shaping enterprise environments.', href: '/case-studies/inspiring-design-trends-this-fall', image: IMG.i1 },
    ],
  },
  {
    id: 'events',
    label: 'Events',
    items: [
      { label: 'Microsoft Cloud Summit 2025', date: 'Apr 2025', href: '/events' },
      { label: 'Digital Workplace Forum', date: 'May 2025', href: '/events' },
      { label: 'AI in Business Webinar', date: 'Jun 2025', href: '/events' },
    ],
    cards: [
      { tag: 'Upcoming', title: 'Microsoft Cloud Summit 2025', body: 'Join us for a full-day summit exploring the future of cloud infrastructure and AI.', href: '/events', image: IMG.i1 },
      { tag: 'Webinar', title: 'AI in Business: Practical Applications', body: 'A live session with NEX4 and Microsoft experts on deploying AI in enterprise settings.', href: '/events', image: IMG.i2 },
    ],
  },
  {
    id: 'news',
    label: 'News',
    items: [
      { label: 'NEX4 Achieves Microsoft Gold Partner Status', date: 'Mar 2025', href: '/news' },
      { label: 'New Office Opening in Singapore', date: 'Feb 2025', href: '/news' },
      { label: 'NEX4 Listed in Gartner Report', date: 'Jan 2025', href: '/news' },
    ],
    cards: [
      { tag: 'Announcement', title: 'NEX4 Achieves Microsoft Gold Partner', body: 'We are proud to announce our Gold Partner designation across Cloud and Modern Workplace.', href: '/news', image: IMG.i2 },
      { tag: 'Expansion', title: 'NEX4 Opens New Regional Office', body: 'Expanding our presence to better serve enterprise clients across Southeast Asia.', href: '/news', image: IMG.i1 },
    ],
  },
];

// ─── Story Card ────────────────────────────────────────────────────────────────

function StoryCard({ card }: { card: StoryCard }) {
  return (
    <Link
      to={card.href}
      className="relative flex flex-col justify-end overflow-hidden group"
      style={{ minHeight: 240 }}
    >
      <img
        src={card.image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
      />
      {/* layered gradient — strong at bottom, fades to transparent */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
      <div className="relative z-10 p-5 pt-12">
        <span className="block text-[10px] uppercase tracking-[0.14em] font-semibold text-white/40 mb-2">
          {card.tag}
        </span>
        <h4 className="text-white text-[13px] font-semibold leading-snug mb-2">{card.title}</h4>
        <p className="text-white/50 text-[12px] leading-relaxed mb-4 line-clamp-2">{card.body}</p>
        <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-white/50 group-hover:text-white transition-colors duration-200">
          Read more
          <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform duration-200" />
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

function ServicesMegaMenu({ visible }: { visible: boolean }) {
  const [activeSectionId, setActiveSectionId] = useState(SERVICES_SECTIONS[0].id);
  const [activeSubId, setActiveSubId] = useState(SERVICES_SECTIONS[0].links[0].id);

  const activeSection = SERVICES_SECTIONS.find((s) => s.id === activeSectionId) ?? SERVICES_SECTIONS[0];
  const activeSub = activeSection.links.find((l) => l.id === activeSubId) ?? activeSection.links[0];

  const handleSectionEnter = (sectionId: string) => {
    const section = SERVICES_SECTIONS.find((s) => s.id === sectionId)!;
    setActiveSectionId(sectionId);
    setActiveSubId(section.links[0].id);
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
                    <span className="text-[15px] font-medium">{section.label}</span>
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
                    onMouseEnter={() => setActiveSubId(link.id)}
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
                    <span className="text-[14px]">{link.label}</span>
                    <ArrowRight
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
            <PanelLabel>Featured</PanelLabel>
            <div className="grid grid-cols-2 gap-4 h-[calc(100%-36px)]">
              {activeSub.cards.map((card, i) => (
                <StoryCard key={`${activeSub.id}-${i}`} card={card} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── Insights Mega Menu ────────────────────────────────────────────────────────

function InsightsMegaMenu({ visible }: { visible: boolean }) {
  const [activeCatId, setActiveCatId] = useState(INSIGHTS_CATEGORIES[0].id);
  const activeCat = INSIGHTS_CATEGORIES.find((c) => c.id === activeCatId) ?? INSIGHTS_CATEGORIES[0];

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
              {INSIGHTS_CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button
                    onMouseEnter={() => setActiveCatId(cat.id)}
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
                    <span className="text-[15px] font-medium">{cat.label}</span>
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
            <ul className="space-y-0.5">
              {activeCat.items.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="flex items-start justify-between gap-4 px-3 py-3 text-[#a0a0a8] hover:text-white transition-colors duration-150"
                    style={{ borderLeft: '2px solid transparent' }}
                  >
                    <span className="text-[14px] leading-snug">{item.label}</span>
                    <span className="text-[11px] text-white/25 shrink-0 mt-0.5 font-medium">{item.date}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 px-3">
              <Link
                to={`/${activeCat.id}`}
                className="inline-flex items-center gap-2 text-[12px] font-medium text-white/30 hover:text-[#22b7cd] transition-colors duration-150"
              >
                View all {activeCat.label}
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* Panel 3 — Featured cards */}
          <div className="flex-1 py-9 px-8">
            <PanelLabel>Featured</PanelLabel>
            <div className="grid grid-cols-2 gap-4 h-[calc(100%-36px)]">
              {activeCat.cards.map((card, i) => (
                <StoryCard key={`${activeCat.id}-${i}`} card={card} />
              ))}
            </div>
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
    'relative flex items-center gap-1.5 px-4 py-2 text-[15px] transition-colors duration-150 select-none',
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
    setOpenMenu(null);
    setMobileOpen(false);
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
          <img src="/images/logo.png" alt="NEX4" className="h-9 w-auto object-contain" />
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

          {/* Divider */}
          <div className="w-px h-5 bg-white/10 mx-3" />

          {/* Contact CTA */}
          <Link
            to="/contact-us"
            className="ml-1 px-5 py-2.5 text-[14px] font-medium text-black bg-white hover:bg-white/90 transition-colors duration-150"
          >
            Contact Us
          </Link>
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
        <ServicesMegaMenu visible={openMenu === 'services'} />
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
            className="w-full flex items-center justify-between px-8 py-4 text-[14px] text-[#a0a0a8]"
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
                      className="flex items-center gap-3 px-10 py-2.5 text-[14px] text-[#a0a0a8] hover:text-white transition-colors"
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
            className="w-full flex items-center justify-between px-8 py-4 text-[14px] text-[#a0a0a8]"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
            onClick={() => setMobileSection(mobileSection === 'insights' ? null : 'insights')}
          >
            Insights
            <ChevronDown size={14} className={cn('transition-transform', mobileSection === 'insights' && 'rotate-180')} />
          </button>
          {mobileSection === 'insights' && (
            <div style={{ background: 'rgba(255,255,255,0.02)' }}>
              {INSIGHTS_CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/${cat.id}`}
                  className="flex items-center gap-3 px-10 py-2.5 text-[14px] text-[#a0a0a8] hover:text-white transition-colors"
                >
                  <span className="w-1 h-1 rounded-full bg-white/20 shrink-0" />
                  {cat.label}
                </Link>
              ))}
            </div>
          )}

          <Link
            to="/careers"
            className="flex px-8 py-4 text-[14px] text-[#a0a0a8] hover:text-white transition-colors"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
          >
            Careers
          </Link>
          <div className="p-6">
            <Link
              to="/contact-us"
              className="flex justify-center px-6 py-3 text-[14px] font-medium text-black bg-white hover:bg-white/90 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
