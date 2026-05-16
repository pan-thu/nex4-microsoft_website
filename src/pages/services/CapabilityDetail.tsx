import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { SERVICES } from '@/data/services';
import { BackgroundBlobs } from '@/components/common/BackgroundBlobs';
import { toSlug } from '@/lib/utils';

const SERVICE_PATHS: Record<string, string> = {
  'workforce-productivity':    '/services/ai-workforce-experience/workforce-productivity',
  'workforce-security':        '/services/ai-workforce-security/workforce-security',
  'workforce-ai':              '/services/ai-workforce-experience/workforce-ai',
  'workforce-automation':      '/services/ai-workforce-process/workforce-automation',
  'workforce-backup-recovery': '/services/ai-workforce-experience/workforce-backup-recovery',
  'cloud-migration':           '/services/ai-workforce-data-cloud/cloud-migration',
};

export function CapabilityDetail() {
  const { serviceSlug, capabilitySlug } = useParams<{ serviceSlug: string; capabilitySlug: string }>();

  const service = serviceSlug ? SERVICES[serviceSlug] : undefined;
  const capIndex = service?.capabilities.findIndex(c => toSlug(c.title) === capabilitySlug) ?? -1;
  const cap = capIndex >= 0 ? service!.capabilities[capIndex] : undefined;

  const servicePath = serviceSlug ? (SERVICE_PATHS[serviceSlug] ?? '/') : '/';

  if (!service || !cap) {
    return (
      <div className="min-h-screen bg-[#060606] text-white pt-[76px] flex flex-col items-center justify-center gap-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">404</p>
        <h2 className="text-2xl font-semibold text-white">Capability not found.</h2>
        <Link to="/" className="flex items-center gap-2 text-[13px] text-white/35 hover:text-white transition-colors mt-2">
          <ArrowLeft size={14} /> Back to Home
        </Link>
      </div>
    );
  }

  const otherCaps = service.capabilities
    .map((c, i) => ({ ...c, origIndex: i, slug: toSlug(c.title) }))
    .filter((_, i) => i !== capIndex);

  return (
    <div className="min-h-screen bg-[#060606] text-white relative">
      <BackgroundBlobs />

      {/* ── Hero banner ────────────────────────────────────────────────── */}
      <div className="relative pt-[76px] h-80 lg:h-[420px] overflow-hidden">
        <img
          src={service.heroImage}
          alt={cap.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-[#060606]/65 to-[#060606]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060606]/60 to-transparent" />

        <div className="absolute top-6 left-0 right-0 max-w-[1240px] mx-auto px-10">
          <Link
            to={servicePath}
            className="inline-flex items-center gap-2 text-[11px] text-white/35 hover:text-white/70 transition-colors uppercase tracking-[0.15em] font-medium"
          >
            <ArrowLeft size={12} /> {service.name}
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 max-w-[1240px] mx-auto px-10 pb-8">
          <div className="flex gap-2 mb-4">
            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40 border border-white/15 rounded-full px-2.5 py-0.5">
              Capabilities
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40 border border-white/10 rounded-full px-2.5 py-0.5">
              {service.category}
            </span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-[28px] lg:text-[40px] font-semibold text-white max-w-3xl leading-tight"
          >
            {cap.title}
          </motion.h1>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <div className="max-w-[1240px] mx-auto px-10 py-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="max-w-[720px]"
        >
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/28 mb-8">
            {String(capIndex + 1).padStart(2, '0')} / {String(service.capabilities.length).padStart(2, '0')}
          </p>

          <p className="text-[18px] text-white/55 leading-[1.85] mb-10 border-l-2 border-white/10 pl-5">
            {cap.body}
          </p>

          <div className="pt-8 border-t border-white/[0.06]">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-semibold mb-4">Technologies</p>
            <div className="flex flex-wrap gap-2">
              {service.technologies.map(tech => (
                <span
                  key={tech}
                  className="text-[12px] text-white/40 border border-white/10 rounded-full px-3 py-1 hover:border-white/22 hover:text-white/65 transition-all duration-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── More Capabilities ─────────────────────────────────────────── */}
      {otherCaps.length > 0 && (
        <section className="border-t border-white/[0.06]">
          <div className="max-w-[1240px] mx-auto px-10 py-14">
            <h2 className="text-[13px] uppercase tracking-[0.2em] text-white/50 font-semibold mb-8">
              More in {service.name}
            </h2>
            <ul className="flex flex-col divide-y divide-white/[0.06]">
              {otherCaps.map((c) => (
                <li key={c.title}>
                  <Link
                    to={`/services/capabilities/${service.slug}/${c.slug}`}
                    className="group flex items-center justify-between gap-4 py-4 text-white/45 hover:text-white transition-colors duration-150"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-mono text-white/20 shrink-0 w-6">
                        {String(c.origIndex + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[15px] font-medium">{c.title}</span>
                    </div>
                    <ChevronRight size={14} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="border-t border-white/[0.06]">
        <div className="max-w-[1240px] mx-auto px-10 py-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-semibold mb-2">Get Started</p>
            <h3 className="text-[24px] lg:text-[30px] font-light text-white leading-snug max-w-[520px]">
              Ready to discuss {cap.title}?
            </h3>
          </div>
          <Link
            to="/contact-us"
            className="shrink-0 inline-flex items-center gap-2 px-7 py-3.5 bg-white text-black text-[14px] font-medium rounded-full hover:bg-white/90 hover:scale-[1.04] transition-all duration-150"
          >
            Talk to Our Team <ChevronRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
