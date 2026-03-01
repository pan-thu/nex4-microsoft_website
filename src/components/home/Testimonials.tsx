import { useState, useRef, useCallback } from 'react';
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
    quote: "The email migration process was seamless, with zero downtime and no data loss. NEX4's expertise ensured a smooth transition to Microsoft 365, and we've experienced a significant reduction in email-related issues.",
    name: 'Anonymous',
    title: 'IT Manager',
  },
];

// Defined at module scope so Framer Motion never sees a new reference.
const testimonialVariants = {
  enter: (d: number) => ({ x: d > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.45, ease: 'easeOut' as const } },
  exit: (d: number) => ({ x: d > 0 ? -40 : 40, opacity: 0, transition: { duration: 0.25 } }),
};

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const go = useCallback((next: number, direction: number) => {
    setDir(direction);
    setIndex(next);
  }, []);

  const goPrev = useCallback(
    () => go((index - 1 + TESTIMONIALS.length) % TESTIMONIALS.length, -1),
    [index, go],
  );

  const goNext = useCallback(
    () => go((index + 1) % TESTIMONIALS.length, 1),
    [index, go],
  );

  return (
    <section className="bg-black py-24 border-t border-white/[0.05]">
      <div className="max-w-[1240px] mx-auto px-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-16">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/30 font-semibold mb-3">
              Testimonials
            </p>
            <h2 className="text-[38px] lg:text-[46px] font-semibold text-white">
              What they think of us
            </h2>
          </div>

          <div className="max-w-[760px]">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={index}
                custom={dir}
                variants={testimonialVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
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

          <div className="flex items-center gap-6 mt-12">
            <button
              onClick={goPrev}
              className="flex items-center gap-2 text-[13px] text-white/40 hover:text-white transition-colors duration-200"
              aria-label="Previous testimonial"
            >
              <ArrowLeft size={16} />
              Prev
            </button>
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.name}
                  onClick={() => go(i, i > index ? 1 : -1)}
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
              onClick={goNext}
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
