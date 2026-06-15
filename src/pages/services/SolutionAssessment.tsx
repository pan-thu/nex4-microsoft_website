import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  ChevronRight, ChevronDown,
  Monitor, ShieldCheck, TrendingUp, Users, ArrowRight, Cloud,
  BarChart3, Lock,
} from 'lucide-react';
import { BackgroundBlobs } from '@/components/common/BackgroundBlobs';
import { supabase } from '@/lib/supabase';
import { ASSETS } from '@/lib/assets';
import { cn } from '@/lib/utils';

// ── Constants ─────────────────────────────────────────────────────────────────

const TOC_ITEMS = [
  { label: 'Solution Assessment',    id: 'solution-assessment'    },
  { label: 'Assessment Process',     id: 'assessment-process'     },
  { label: 'Digital Transformation', id: 'digital-transformation' },
] as const;

const SCROLL_OFFSET = 96;

const INSIGHTS = [
  { icon: Monitor,    label: 'Technical Insight',           body: 'Delivers a deep understanding of the current state of the IT environment.' },
  { icon: ShieldCheck, label: 'Security Insight',           body: 'High level Security insight based on real data from customer\'s estate.' },
  { icon: TrendingUp, label: 'Financial Insight',           body: 'Understand total cost of ownership and/or business value.' },
  { icon: Users,      label: 'Presales & Capacity Support', body: 'Prepare Data to understand customer needs.' },
  { icon: ArrowRight, label: 'Next Steps',                  body: 'Clear guidance for customers on next steps based on Assessment results.' },
  { icon: Cloud,      label: 'Migration',                   body: 'Connect the customer to the right resources who will then help customers in actual migration projects.' },
];

const PROCESS_STEPS = [
  {
    title: 'Kick-off / Pre-Deployment Call',
    bullets: [
      'Overview Assessment value and process',
      'Provide detail on the tooling to be used, and pre-requisites for successful deployment',
      'Schedule deployment',
    ],
  },
  {
    title: 'Deployment Call',
    bullets: [
      'Validate completion of pre-requisites',
      'Walk through tool deployment',
      'Define next steps in data collection and report generation',
    ],
  },
  {
    title: 'Report Generation & Data Analysis',
    bullets: [
      'Generate report(s) from the deployed tool (Technical Consultant will provide guidance)',
      'Review and Analysis to create final report',
    ],
  },
  {
    title: 'Recommendation & Analysis Discussion',
    bullets: [
      'Review findings and next-step recommendations',
    ],
  },
];

const SCENARIOS = [
  { icon: Cloud,      label: 'Planning a cloud migration'    },
  { icon: Lock,       label: 'Increasing security protocols' },
  { icon: BarChart3,  label: 'Validating a business case'    },
];

const OUTCOMES = [
  'Understand vulnerabilities to cyber-attacks & risk of business loss',
  'Receive insights on how to align data compliance policies to industry standards',
  'Gain a tailored plan to help integrate identity management into key business operations',
];

const MIGRATION_STEPS = [
  { n: '01', title: 'Discovery',        body: 'Scan of deployed hardware and software across entire estate including all infrastructure and server instances.' },
  { n: '02', title: 'Data collection',  body: 'Collect inventory of all applicable operating systems, infrastructure, endpoints, hardware, software, versions deployed and end-user identity management.' },
  { n: '03', title: 'Data analysis',    body: 'Optimize investments with our analysis of an organization\'s data and infrastructure.' },
  { n: '04', title: 'Action',           body: 'Implement a strategic plan created for an organization\'s cloud journey.' },
];

// ── Form constants ────────────────────────────────────────────────────────────

const DEPARTMENTS       = ['IT', 'Finance', 'HR', 'Operations', 'Marketing', 'Sales', 'Legal', 'Executive', 'Other'];
const COUNTRIES         = ['Thailand', 'Myanmar', 'Cambodia', 'Japan', 'Singapore', 'Malaysia', 'Vietnam', 'Indonesia', 'Philippines', 'Other'];
const NOMINATION_TYPES  = ['Self-nominated', 'Partner-nominated', 'Microsoft-nominated'];
const USER_COUNTS       = ['1–50', '51–250', '251–1,000', '1,001–5,000', '5,000+'];
const SERVER_COUNTS     = ['0', '1–10', '11–50', '51–200', '200+'];
const HOW_SOON_OPTIONS  = ['0–3 months', '3–6 months', '6–12 months', '12+ months'];
const AREAS_OF_INTEREST = [
  'Microsoft 365 (Secure AI Productivity)',
  'Copilot & Agents',
  'Security',
  'Cloud Migration',
  'Modernize Applications',
];

// ── Form types ────────────────────────────────────────────────────────────────

type FormData = {
  name: string; job_title: string; company_name: string; department: string;
  corporate_email: string; ms_consent: boolean; company_website: string;
  country: string; nomination_type: string; num_users: string; num_servers: string;
  areas_of_interest: string[]; how_soon: string; background: string;
};

const EMPTY: FormData = {
  name: '', job_title: '', company_name: '', department: '',
  corporate_email: '', ms_consent: false, company_website: '',
  country: '', nomination_type: '', num_users: '', num_servers: '',
  areas_of_interest: [], how_soon: '', background: '',
};

type Errors = Partial<Record<keyof FormData, string>>;

// ── Field primitives ──────────────────────────────────────────────────────────

function Field({ label, value, onChange, type = 'text', required, error }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; required?: boolean; error?: string;
}) {
  return (
    <div className="flex flex-col">
      <input
        type={type}
        value={value}
        placeholder=" "
        onChange={e => onChange(e.target.value)}
        className={cn(
          'bg-transparent text-white text-[15px] py-3 outline-none border-b transition-colors duration-200 placeholder:text-white/15',
          error ? 'border-red-500/60' : 'border-white/15 focus:border-white/50',
        )}
      />
      <span className={cn('text-[10px] font-bold uppercase tracking-[0.14em] mt-2', error ? 'text-red-400/80' : 'text-white/30')}>
        {label}{required && ' *'}
      </span>
      {error && <span className="text-[10px] text-red-400/70 mt-0.5">{error}</span>}
    </div>
  );
}

function SelectField({ label, value, onChange, options, required, error }: {
  label: string; value: string; onChange: (v: string) => void;
  options: string[]; required?: boolean; error?: string;
}) {
  return (
    <div className="flex flex-col">
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className={cn(
            'w-full bg-transparent text-[15px] py-3 outline-none border-b transition-colors duration-200 appearance-none cursor-pointer pr-6',
            value ? 'text-white' : 'text-white/20',
            error ? 'border-red-500/60' : 'border-white/15 focus:border-white/50',
          )}
        >
          <option value="" disabled className="bg-[#0e0e0e] text-white/40">Select…</option>
          {options.map(o => <option key={o} value={o} className="bg-[#0e0e0e] text-white">{o}</option>)}
        </select>
        <ChevronDown size={13} className="absolute right-0 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
      </div>
      <span className={cn('text-[10px] font-bold uppercase tracking-[0.14em] mt-2', error ? 'text-red-400/80' : 'text-white/30')}>
        {label}{required && ' *'}
      </span>
      {error && <span className="text-[10px] text-red-400/70 mt-0.5">{error}</span>}
    </div>
  );
}

function Checkbox({ checked, onChange, children }: {
  checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <span
        onClick={() => onChange(!checked)}
        className={cn(
          'shrink-0 w-4 h-4 rounded border mt-0.5 transition-all duration-150 flex items-center justify-center',
          checked ? 'border-white bg-white' : 'border-white/25 group-hover:border-white/45',
        )}
      >
        {checked && (
          <svg viewBox="0 0 10 8" fill="none" className="w-2 h-2">
            <path d="M1 4l2.5 2.5L9 1" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className="text-[14px] text-white/45 leading-relaxed">{children}</span>
    </label>
  );
}

// ── TOC (3 items only — form is its own full-width section) ───────────────────

function SideTableOfContents() {
  const [active, setActive] = useState<string>('solution-assessment');

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: '-15% 0px -75% 0px' },
    );
    TOC_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET, behavior: 'smooth' });
  };

  return (
    <aside className="hidden lg:block w-[260px] shrink-0">
      <div className="sticky top-[76px] flex flex-col pt-14 pb-10 pl-10 pr-4">
        <nav className="flex flex-col gap-2">
          {TOC_ITEMS.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={cn(
                'text-left px-3 py-2 text-[13px] font-medium transition-all duration-150 rounded-full',
                active === id
                  ? 'border border-white/50 text-white'
                  : 'text-white/35 hover:text-white/65 border border-transparent',
              )}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}

// ── Section 1: What is a Solution Assessment ──────────────────────────────────

function SolutionAssessmentSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="solution-assessment" className="py-24 scroll-mt-[96px]">
      <div className="max-w-[1240px] mx-auto px-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/28 font-semibold mb-4">Microsoft Program</p>
          <h2 className="text-[32px] lg:text-[40px] font-semibold text-white leading-tight mb-5">
            What is a <span className="gradient-text">Solution Assessment</span>?
          </h2>
          <p className="text-[19px] text-white/55 leading-relaxed max-w-[680px] mb-14">
            The program helps customers by providing in-depth insights and data-backed action recommendations for digital transformation projects, cloud migrations and optimizing IT investments.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8">
            {INSIGHTS.map((insight, i) => {
              const Icon = insight.icon;
              return (
                <motion.div
                  key={insight.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.1 + i * 0.07 }}
                  className="flex items-start gap-4"
                >
                  <Icon size={17} className="shrink-0 text-white/35 mt-0.5" />
                  <div>
                    <p className="text-[15px] font-semibold text-white mb-1.5">{insight.label}</p>
                    <p className="text-[14px] text-white/42 leading-relaxed">{insight.body}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Section 2: Assessment Process ────────────────────────────────────────────

function AssessmentProcessSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="assessment-process" className="py-24 border-t border-white/[0.05] scroll-mt-[96px]">
      <div className="max-w-[1240px] mx-auto px-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/28 font-semibold mb-4">Process</p>
          <h2 className="text-[32px] lg:text-[40px] font-semibold text-white leading-tight mb-6">
            Assessment <span className="gradient-text">Process</span>
          </h2>

          {/* Key stats */}
          <div className="flex flex-wrap gap-x-8 gap-y-3 mb-8 pb-8 border-b border-white/[0.05]">
            {[
              { value: '1–2', unit: 'weeks',   label: 'Duration' },
              { value: '3–8', unit: 'hours',   label: 'Customer time' },
              { value: '4',   unit: 'meetings', label: 'Structured sessions' },
            ].map(stat => (
              <div key={stat.label} className="flex items-baseline gap-1.5">
                <span className="text-[28px] font-light text-white tabular-nums">{stat.value}</span>
                <span className="text-[13px] text-white/35">{stat.unit}</span>
                <span className="text-[11px] text-white/22 uppercase tracking-[0.1em] ml-1">{stat.label}</span>
              </div>
            ))}
          </div>

          <p className="text-[18px] text-white/50 leading-relaxed max-w-[720px] mb-12">
            Solution Assessments leverage Microsoft tools and ISV tools, to provide a robust foundation of data. The 4 meetings below will be conducted by Microsoft's technical consultant, involving the customer and partner throughout.
          </p>

          {/* Step columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-8 gap-y-10 mb-6">
            {PROCESS_STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
                className="flex flex-col border-t border-white/[0.08] pt-6"
              >
                <p className="text-[11px] font-mono text-white/20 mb-3">
                  {String(i + 1).padStart(2, '0')} / 04
                </p>
                <p className="text-[16px] font-semibold text-white leading-snug mb-5">{step.title}</p>
                <ul className="flex flex-col gap-2.5">
                  {step.bullets.map(b => (
                    <li key={b} className="flex items-start gap-2.5 text-[14px] text-white/42 leading-relaxed">
                      <span className="shrink-0 w-1 h-1 rounded-full bg-white/25 mt-[7px]" />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Progress arrow */}
          <div className="flex items-center">
            <div className="flex-1 h-px bg-white/[0.12]" />
            <div
              className="w-0 h-0"
              style={{
                borderTop: '6px solid transparent',
                borderBottom: '6px solid transparent',
                borderLeft: '10px solid rgba(255,255,255,0.12)',
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Section 3: Digital Transformation ────────────────────────────────────────

function DigitalTransformationSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="digital-transformation" className="py-24 border-t border-white/[0.05] scroll-mt-[96px]">
      <div className="max-w-[1240px] mx-auto px-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/28 font-semibold mb-4">Transformation</p>
          <h2 className="text-[30px] lg:text-[38px] font-semibold text-white leading-tight mb-5">
            <span className="gradient-text">Digital Transformation</span> begins with a Solution Assessment
          </h2>
          <p className="text-[18px] text-white/50 leading-relaxed max-w-[760px] mb-12">
            The Solution Assessment provides you with a total fast analysis of your security posture, including an evaluation of any vulnerabilities, identity, and compliance risks with remediation recommendations and a detailed action plan.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-14">

            {/* Left: scenarios + info box */}
            <div className="flex flex-col gap-8">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/28 mb-5">
                  Top customer scenarios
                </p>
                <div className="flex flex-col gap-4">
                  {SCENARIOS.map(s => {
                    const Icon = s.icon;
                    return (
                      <div key={s.label} className="flex items-center gap-3">
                        <Icon size={14} className="shrink-0 text-white/35" />
                        <span className="text-[15px] text-white/55">{s.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Info */}
              <div className="border-t border-white/[0.06] pt-6">
                <p className="text-[15px] font-semibold text-white/55 mb-2">Want more information?</p>
                <p className="text-[14px] text-white/32 leading-relaxed">
                  Speak with a NEX4 specialist to understand which assessment is right for your organisation.
                </p>
              </div>
            </div>

            {/* Right: outcomes + migration steps */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/28 font-semibold mb-6">
                Outcomes of a Rapid Security Assessment
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {OUTCOMES.map((outcome, i) => (
                  <motion.div
                    key={outcome}
                    initial={{ opacity: 0, y: 12 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                  >
                    <p className="text-[15px] text-white/48 leading-relaxed">{outcome}</p>
                  </motion.div>
                ))}
              </div>

              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/32 mb-6">
                Migrate with confidence with expert help along the way
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {MIGRATION_STEPS.map((s, i) => (
                  <motion.div
                    key={s.title}
                    initial={{ opacity: 0, y: 12 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.35 + i * 0.08 }}
                    className="flex flex-col gap-2"
                  >
                    <p className="text-[11px] font-mono text-white/22">{s.n}</p>
                    <p className="text-[15px] font-semibold text-white">{s.title}</p>
                    <p className="text-[14px] text-white/38 leading-relaxed">{s.body}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Form — full-width dedicated section (outside TOC layout) ──────────────────

function ReadyToDiscussSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [form, setForm]               = useState<FormData>(EMPTY);
  const [errors, setErrors]           = useState<Errors>({});
  const [submitting, setSubmitting]   = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function set<K extends keyof FormData>(key: K, val: FormData[K]) {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(e => { const n = { ...e }; delete n[key]; return n; });
  }

  function toggleArea(area: string) {
    setForm(f => ({
      ...f,
      areas_of_interest: f.areas_of_interest.includes(area)
        ? f.areas_of_interest.filter(a => a !== area)
        : [...f.areas_of_interest, area],
    }));
  }

  function validate(): boolean {
    const e: Errors = {};
    if (!form.name.trim())            e.name            = 'Required';
    if (!form.job_title.trim())       e.job_title       = 'Required';
    if (!form.company_name.trim())    e.company_name    = 'Required';
    if (!form.department)             e.department      = 'Required';
    if (!form.corporate_email.trim()) e.corporate_email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.corporate_email)) e.corporate_email = 'Invalid email';
    if (!form.country)                e.country         = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setServerError(null);
    try {
      const nameParts = form.name.trim().split(/\s+/);
      const message = [
        form.background      ? `Background: ${form.background}`                                   : null,
        form.department      ? `Department: ${form.department}`                                    : null,
        form.company_website ? `Company Website: ${form.company_website}`                          : null,
        form.nomination_type ? `Nomination Type: ${form.nomination_type}`                          : null,
        form.num_users       ? `Number of Users: ${form.num_users}`                                : null,
        form.num_servers     ? `Number of Servers: ${form.num_servers}`                            : null,
        form.areas_of_interest.length ? `Areas of Interest: ${form.areas_of_interest.join(', ')}` : null,
        form.how_soon        ? `How Soon: ${form.how_soon}`                                        : null,
        form.ms_consent      ? 'Microsoft email consent: Yes'                                      : null,
      ].filter(Boolean).join('\n');

      const { error } = await supabase.from('contact_submissions').insert({
        inquiry_type: 'solution-assessment',
        first_name:   nameParts[0],
        last_name:    nameParts.slice(1).join(' ') || '',
        email:        form.corporate_email,
        company:      form.company_name,
        position:     form.job_title,
        country:      form.country,
        message,
        phone: null, city: null, how_heard: null, subscribed: false,
      });
      if (error) throw new Error(error.message);
      setSubmitted(true);
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="ready-to-discuss" className="border-t border-white/[0.05]">
      <div className="max-w-[1240px] mx-auto px-10 py-24">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-16 items-start">
            {/* Left: heading + context */}
            <div className="lg:sticky lg:top-[96px]">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/28 font-semibold mb-4">Get Started</p>
              <h2 className="text-[28px] lg:text-[34px] font-light text-white leading-tight mb-4">
                Ready to discuss{' '}
                <span className="font-semibold gradient-text">M365 Tenant Assessment</span>{' '}
                &amp; Roadmap?
              </h2>
              <p className="text-[15px] text-white/38 leading-relaxed">
                Fill in the form and a NEX4 specialist will be in touch shortly.
              </p>
            </div>

            {/* Right: form */}
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="py-12"
              >
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/30 font-semibold mb-6">Submitted</p>
                <h3 className="text-[26px] font-light text-white mb-3">Thank you for reaching out.</h3>
                <p className="text-[14px] text-white/38 max-w-[360px] leading-relaxed">
                  Our team will review your assessment request and be in touch shortly.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-10">

                {/* Customer information */}
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/28 font-semibold mb-7">
                    Customer information
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-7 mb-7">
                    <Field label="Name"         value={form.name}         onChange={v => set('name', v)}         required error={errors.name} />
                    <Field label="Job Title"    value={form.job_title}    onChange={v => set('job_title', v)}    required error={errors.job_title} />
                    <Field label="Company Name" value={form.company_name} onChange={v => set('company_name', v)} required error={errors.company_name} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-7 mb-7 items-end">
                    <SelectField label="Department"      value={form.department}      onChange={v => set('department', v)}      options={DEPARTMENTS} required error={errors.department} />
                    <Field       label="Corporate Email" value={form.corporate_email} onChange={v => set('corporate_email', v)} type="email" required error={errors.corporate_email} />
                    <div className="pb-1">
                      <Checkbox checked={form.ms_consent} onChange={v => set('ms_consent', v)}>
                        Consent to send an email to Customer from Microsoft.
                      </Checkbox>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-7 mb-7">
                    <Field       label="Company Website"  value={form.company_website} onChange={v => set('company_website', v)} />
                    <SelectField label="Country / Region" value={form.country}         onChange={v => set('country', v)}         options={COUNTRIES} required error={errors.country} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-7">
                    <SelectField label="Nomination Type"   value={form.nomination_type} onChange={v => set('nomination_type', v)} options={NOMINATION_TYPES} />
                    <SelectField label="Number of Users"   value={form.num_users}       onChange={v => set('num_users', v)}       options={USER_COUNTS} />
                    <SelectField label="Number of Servers" value={form.num_servers}     onChange={v => set('num_servers', v)}     options={SERVER_COUNTS} />
                  </div>
                </div>

                {/* Areas of Interest */}
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/28 font-semibold mb-2">Areas of Interest</p>
                  <p className="text-[14px] text-white/28 mb-5">What IT projects do you have in mind? (Check all that apply)</p>
                  <div className="flex flex-col gap-3">
                    {AREAS_OF_INTEREST.map(area => (
                      <label key={area} className="flex items-center gap-3 cursor-pointer group">
                        <span
                          onClick={() => toggleArea(area)}
                          className={cn(
                            'shrink-0 w-4 h-4 rounded border transition-all duration-150 flex items-center justify-center',
                            form.areas_of_interest.includes(area) ? 'border-white bg-white' : 'border-white/25 group-hover:border-white/45',
                          )}
                        >
                          {form.areas_of_interest.includes(area) && (
                            <svg viewBox="0 0 10 8" fill="none" className="w-2 h-2">
                              <path d="M1 4l2.5 2.5L9 1" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                        <span className="text-[14px] text-white/48">{area}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* How soon */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                  <SelectField
                    label="How soon are you looking to implement these changes?"
                    value={form.how_soon}
                    onChange={v => set('how_soon', v)}
                    options={HOW_SOON_OPTIONS}
                  />
                </div>

                {/* Background */}
                <div className="flex flex-col">
                  <textarea
                    value={form.background}
                    onChange={e => set('background', e.target.value)}
                    rows={4}
                    placeholder=" "
                    className="bg-transparent text-white text-[15px] py-3 outline-none border-b border-white/15 focus:border-white/50 transition-colors duration-200 resize-none placeholder:text-white/15"
                  />
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] mt-2 text-white/30">
                    Please provide any background you feel may be relevant and briefly describe your goals for the assessment
                  </span>
                </div>

                {serverError && <p className="text-[13px] text-red-400/80">{serverError}</p>}

                <div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-black text-[14px] font-medium rounded-full hover:bg-white/90 hover:scale-[1.03] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting…' : 'Submit Assessment Request'}
                    {!submitting && <ChevronRight size={14} />}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function SolutionAssessment() {
  return (
    <div className="pt-[76px] bg-[#060606] relative">
      <BackgroundBlobs />

      {/* Hero */}
      <div className="relative h-72 lg:h-[360px] overflow-hidden">
        <img
          src={ASSETS.insightsBg1}
          alt="Microsoft Solution Assessment"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-[#060606]/65 to-[#060606]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060606]/85 to-[#060606]/20" />

        <div className="absolute top-6 left-0 right-0 max-w-[1240px] mx-auto px-10">
          <nav className="flex items-center gap-2">
            <Link to="/" className="text-[11px] text-white/30 hover:text-white/55 transition-colors">Home</Link>
            <ChevronRight size={11} className="text-white/20" />
            <span className="text-[11px] text-white/30">Services</span>
            <ChevronRight size={11} className="text-white/20" />
            <span className="text-[11px] text-white/45">Microsoft Solution Assessment</span>
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 max-w-[1240px] mx-auto px-10 pb-10">
          <div className="flex gap-2 mb-4">
            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40 border border-white/15 rounded-full px-2.5 py-0.5">
              Microsoft Program
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40 border border-white/10 rounded-full px-2.5 py-0.5">
              Assessment
            </span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-[28px] lg:text-[44px] font-semibold text-white max-w-2xl leading-tight"
          >
            Microsoft <span className="gradient-text">Solution Assessment</span>
          </motion.h1>
        </div>
      </div>

      <div className="relative" style={{ zIndex: 1 }}>
        {/* TOC + 3 content sections */}
        <div className="max-w-[1400px] mx-auto flex">
          <SideTableOfContents />
          <main className="flex-1 min-w-0">
            <SolutionAssessmentSection />
            <AssessmentProcessSection />
            <DigitalTransformationSection />
          </main>
        </div>

        {/* Form — full width, outside the TOC layout */}
        <ReadyToDiscussSection />
      </div>
    </div>
  );
}
