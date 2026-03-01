import { Link } from 'react-router-dom';
import { FaFacebookF, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';

const SERVICES_TREE = [
  {
    label: 'Digital Workplace',
    href: '/services/digital-workplace',
    children: [
      { label: 'Workplace Productivity', href: '/services/workplace-productivity' },
      { label: 'Workplace Security', href: '/services/workplace-security' },
      { label: 'Workplace AI', href: '/services/workplace-ai' },
      { label: 'Workplace Automation', href: '/services/workplace-automation' },
      { label: 'Workplace Backup', href: '/services/workplace-backup' },
    ],
  },
  {
    label: 'Cloud',
    href: '/services/cloud',
    children: [
      { label: 'Cloud Migration', href: '/services/cloud-migration' },
    ],
  },
];

const INSIGHTS_TREE = [
  { label: 'Blog', href: '/blog', children: [] },
  { label: 'Case Studies', href: '/case-studies', children: [] },
  { label: 'Events', href: '/events', children: [] },
  { label: 'News', href: '/news', children: [] },
];

const SOCIAL = [
  { icon: FaFacebookF, href: 'https://facebook.com', label: 'Facebook' },
  { icon: FaLinkedinIn, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: FaXTwitter, href: 'https://x.com', label: 'X (Twitter)' },
];

function FooterLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] uppercase tracking-[0.14em] font-semibold text-white/25 mb-5">
      {children}
    </p>
  );
}

function TreeSection({ items }: { items: typeof SERVICES_TREE }) {
  return (
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item.label}>
          {/* Parent link */}
          <Link
            to={item.href}
            className="flex items-center gap-2 py-1.5 text-[14px] font-medium text-white/70 hover:text-white transition-colors duration-150"
          >
            {item.label}
          </Link>
          {/* Children */}
          {item.children.length > 0 && (
            <ul className="ml-3 mt-0.5 mb-2 space-y-0.5"
              style={{ borderLeft: '1px solid rgba(255,255,255,0.07)', paddingLeft: 12 }}
            >
              {item.children.map((child) => (
                <li key={child.label}>
                  <Link
                    to={child.href}
                    className="flex items-center gap-2 py-1 text-[13px] text-white/35 hover:text-white/80 transition-colors duration-150"
                  >
                    <span className="w-1 h-1 rounded-full bg-white/20 shrink-0" />
                    {child.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

export function Footer() {
  return (
    <footer className="relative bg-black text-white overflow-hidden">

      {/* ── Top accent line ── */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.9) 35%, rgba(255,255,255,0.9) 65%, transparent 100%)' }}
      />

      {/* ── Ambient glows ── */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[200px] rounded-full bg-white/[0.03] blur-3xl" />
      <div className="pointer-events-none absolute top-10 -left-20 w-[350px] h-[250px] rounded-full bg-white/[0.03] blur-3xl" />
      <div className="pointer-events-none absolute top-10 -right-20 w-[300px] h-[200px] rounded-full bg-white/[0.03] blur-3xl" />

      {/* ── Main body ── */}
      <div className="relative max-w-[1240px] mx-auto px-10 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand */}
          <div>
            <img src="/images/logo.png" alt="NEX4" className="h-8 w-auto object-contain mb-6" />
            <p
              className="text-[15px] font-semibold text-white mb-4 leading-snug"
              style={{ borderLeft: '2px solid rgba(255,255,255,0.9)', paddingLeft: 12 }}
            >
              Transformation.<br />Passion. Results.
            </p>
            <p className="text-[13px] text-white/40 leading-relaxed">
              We are passionate about supporting our clients with the most significant changes of our time and ensure that transformation projects are successful in the long term.
            </p>
          </div>

          {/* Services tree */}
          <div>
            <FooterLabel>Services</FooterLabel>
            <TreeSection items={SERVICES_TREE} />
          </div>

          {/* Insights tree */}
          <div>
            <FooterLabel>Insights</FooterLabel>
            <TreeSection items={INSIGHTS_TREE} />
          </div>

          {/* Stay in contact */}
          <div>
            <FooterLabel>Stay in Contact</FooterLabel>
            <p className="text-[13px] text-white/40 leading-relaxed mb-6">
              Follow us for updates, insights, and more. Reach out — we'd love to hear from you.
            </p>
            <Link
              to="/contact-us"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-white/90 text-black text-[13px] font-medium transition-colors duration-150"
            >
              Contact Us
            </Link>
          </div>

        </div>
      </div>

      {/* ── Divider ── */}
      <div
        className="max-w-[1240px] mx-auto px-10"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      />

      {/* ── Copyright bar ── */}
      <div className="relative max-w-[1240px] mx-auto px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[12px] text-white/25">
          © {new Date().getFullYear()} NEX4 ICT Solutions. All Rights Reserved.
        </p>
        <div className="flex items-center gap-2">
          {SOCIAL.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="w-8 h-8 flex items-center justify-center border border-white/[0.08] text-white/35 hover:text-white hover:border-white/20 transition-all duration-150"
            >
              <Icon size={13} />
            </a>
          ))}
        </div>
      </div>

    </footer>
  );
}
