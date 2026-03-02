import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Globe2 } from 'lucide-react';

interface Location {
  country: string;
  city: string;
  coords: string;
  image: string;
  alt: string;
}

const LOCATIONS: Location[] = [
  {
    country: 'Myanmar',
    city: 'Yangon',
    coords: '16.8661° N, 96.1951° E',
    image: 'https://images.unsplash.com/photo-1570521462033-3015e76e7432?w=600&q=80&fit=crop',
    alt: 'Yangon, Myanmar',
  },
  {
    country: 'Thailand',
    city: 'Bangkok',
    coords: '13.7563° N, 100.5018° E',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80&fit=crop',
    alt: 'Bangkok, Thailand',
  },
  {
    country: 'Cambodia',
    city: 'Phnom Penh',
    coords: '11.5564° N, 104.9282° E',
    image: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=600&q=80&fit=crop',
    alt: 'Phnom Penh, Cambodia',
  },
  {
    country: 'Japan',
    city: 'Tokyo',
    coords: '35.6762° N, 139.6503° E',
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
      <div className="relative overflow-hidden mb-4" style={{ aspectRatio: '4/3' }}>
        <img
          src={loc.image}
          alt={loc.alt}
          loading="lazy"
          width={600}
          height={450}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        {/* Gradient overlay on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)' }}
        />
        {/* City name appears on hover */}
        <p className="absolute bottom-3 left-3 text-[11px] font-semibold text-white/90 tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-1 group-hover:translate-y-0">
          {loc.city}
        </p>
      </div>

      <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-white/60 group-hover:text-white transition-colors duration-200 mb-1">
        {loc.country}
      </p>
      <p className="text-[10px] font-mono text-white/20 tracking-wider">
        {loc.coords}
      </p>
    </motion.div>
  );
}

export function OurLocations() {
  const headingRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: '-60px' });

  return (
    <section className="relative bg-black py-24 overflow-hidden border-t border-white/[0.05]">

      {/* Corner gradient — top right */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.05) 0%, transparent 60%)',
        }}
      />

      {/* Corner gradient — bottom left */}
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at bottom left, rgba(255,255,255,0.03) 0%, transparent 65%)',
        }}
      />

      {/* Diagonal grid lines — decorative */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 80px)',
        }}
      />

      {/* Large faint globe icon */}
      <div className="absolute -top-16 -right-16 pointer-events-none opacity-[0.04]">
        <Globe2 size={320} strokeWidth={0.5} className="text-white" />
      </div>

      <div className="relative max-w-[1240px] mx-auto px-10">

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
            className="flex flex-col items-start lg:items-end gap-2"
          >
            <span className="text-[12px] uppercase tracking-[0.18em] font-semibold text-white border-b border-white pb-1">
              APAC
            </span>
            <span className="text-[11px] text-white/25 font-mono">
              {LOCATIONS.length} offices
            </span>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {LOCATIONS.map((loc, i) => (
            <LocationCard key={loc.country} loc={loc} index={i} />
          ))}
        </div>

        <div
          className="mt-20 h-px"
          style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.03) 60%, transparent 100%)' }}
        />
      </div>
    </section>
  );
}
