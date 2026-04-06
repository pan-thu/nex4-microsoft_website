import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { BackgroundBlobs } from '@/components/common/BackgroundBlobs';
import { OurLocations } from '@/components/home/OurLocations';
import { cn } from '@/lib/utils';

// ── Options ───────────────────────────────────────────────────────────────────

const INQUIRY_TYPES = [
  'General Inquiry',
  'Cloud Solutions',
  'Cybersecurity',
  'Modern Workplace',
  'AI & Automation',
  'Partnership',
  'Careers',
  'Other',
];

const POSITIONS = [
  'C-Suite / Executive',
  'VP / Director',
  'Manager',
  'Engineer / Developer',
  'Consultant',
  'Individual Contributor',
  'Other',
];

const COUNTRIES = [
  'Thailand',
  'Myanmar',
  'Cambodia',
  'Japan',
  'Singapore',
  'Other',
];

const HOW_HEARD = [
  'Search Engine',
  'LinkedIn',
  'Microsoft Event',
  'Referral',
  'Conference / Webinar',
  'Other',
];

// ── Form state ────────────────────────────────────────────────────────────────

type FormData = {
  inquiry_type: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  country: string;
  city: string;
  message: string;
  how_heard: string;
  consent: boolean;
  subscribed: boolean;
};

const EMPTY: FormData = {
  inquiry_type: '',
  first_name:   '',
  last_name:    '',
  email:        '',
  phone:        '',
  company:      '',
  position:     '',
  country:      '',
  city:         '',
  message:      '',
  how_heard:    '',
  consent:      false,
  subscribed:   false,
};

type Errors = Partial<Record<keyof FormData, string>>;

// ── Field components ──────────────────────────────────────────────────────────

function UnderlineInput({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div className="flex flex-col">
      <input
        type={type}
        value={value}
        placeholder={placeholder ?? ' '}
        onChange={e => onChange(e.target.value)}
        className={cn(
          'bg-transparent text-white text-[16px] py-3 outline-none border-b transition-colors duration-200 placeholder:text-white/15',
          error ? 'border-red-500/60' : 'border-white/15 focus:border-white/50',
        )}
      />
      <span className={cn(
        'text-[10px] font-bold uppercase tracking-[0.14em] mt-2 transition-colors',
        error ? 'text-red-400/80' : 'text-white/30',
      )}>
        {label}{required && '*'}
      </span>
      {error && <span className="text-[10px] text-red-400/70 mt-0.5">{error}</span>}
    </div>
  );
}

function UnderlineSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div className="flex flex-col relative">
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className={cn(
            'w-full bg-transparent text-[16px] py-3 outline-none border-b transition-colors duration-200 appearance-none cursor-pointer pr-6',
            value ? 'text-white' : 'text-white/15',
            error ? 'border-red-500/60' : 'border-white/15 focus:border-white/50',
          )}
        >
          <option value="" disabled className="bg-[#0e0e0e] text-white/40">
            {placeholder ?? 'Select…'}
          </option>
          {options.map(o => (
            <option key={o} value={o} className="bg-[#0e0e0e] text-white">{o}</option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
        />
      </div>
      <span className={cn(
        'text-[10px] font-bold uppercase tracking-[0.14em] mt-2 transition-colors',
        error ? 'text-red-400/80' : 'text-white/30',
      )}>
        {label}{required && '*'}
      </span>
      {error && <span className="text-[10px] text-red-400/70 mt-0.5">{error}</span>}
    </div>
  );
}

function UnderlineTextarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col relative">
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={4}
        placeholder=" "
        className="bg-transparent text-white text-[16px] py-3 outline-none border-b border-white/15 focus:border-white/50 transition-colors duration-200 resize-none placeholder:text-white/15"
      />
      <ChevronDown size={14} className="absolute right-0 bottom-[38px] text-white/25 pointer-events-none" />
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] mt-2 text-white/30">
        {label}
      </span>
    </div>
  );
}

function FormCheckbox({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-start gap-4 cursor-pointer group">
      <span
        onClick={() => onChange(!checked)}
        className={cn(
          'shrink-0 w-5 h-5 border mt-0.5 transition-all duration-150 flex items-center justify-center',
          checked ? 'border-white bg-white' : 'border-white/25 group-hover:border-white/50',
        )}
      >
        {checked && (
          <svg viewBox="0 0 10 8" fill="none" className="w-2.5 h-2.5">
            <path d="M1 4l2.5 2.5L9 1" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className="text-[13px] text-white/45 leading-relaxed">{children}</span>
    </label>
  );
}

// ── Section accordion ─────────────────────────────────────────────────────────

function FormSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-white/[0.08]">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center justify-between w-full py-5 text-left group"
      >
        <span className="text-[15px] text-white/50 group-hover:text-white/75 transition-colors">{title}</span>
        <ChevronDown
          size={16}
          className={cn(
            'text-white/30 transition-transform duration-300',
            open ? 'rotate-180' : 'rotate-0',
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-16">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Success state ─────────────────────────────────────────────────────────────

function SuccessMessage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-24 text-center border-t border-white/[0.08]"
    >
      <p className="text-[10px] uppercase tracking-[0.22em] text-white/30 font-semibold mb-6">Message received</p>
      <h3 className="text-[32px] lg:text-[40px] font-light text-white mb-4 leading-tight">
        Thank you for reaching out.
      </h3>
      <p className="text-[15px] text-white/45 max-w-[400px] mx-auto leading-relaxed">
        One of our team members will be in touch with you shortly.
      </p>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function ContactUs() {
  const [form, setForm]       = useState<FormData>(EMPTY);
  const [errors, setErrors]   = useState<Errors>({});
  const [open, setOpen]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function set<K extends keyof FormData>(key: K, val: FormData[K]) {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(e => { const n = { ...e }; delete n[key]; return n; });
  }

  function validate(): boolean {
    const e: Errors = {};
    if (!form.inquiry_type) e.inquiry_type = 'Required';
    if (!form.first_name.trim()) e.first_name = 'Required';
    if (!form.last_name.trim())  e.last_name  = 'Required';
    if (!form.email.trim())      e.email      = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.country)           e.country    = 'Required';
    if (!form.consent)           e.consent    = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setServerError(null);
    try {
      const { error } = await supabase.from('contact_submissions').insert({
        inquiry_type: form.inquiry_type,
        first_name:   form.first_name,
        last_name:    form.last_name,
        email:        form.email,
        phone:        form.phone   || null,
        company:      form.company || null,
        position:     form.position || null,
        country:      form.country || null,
        city:         form.city    || null,
        message:      form.message || null,
        how_heard:    form.how_heard || null,
        subscribed:   form.subscribed,
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
    <div className="pt-[76px] bg-[#060606] relative min-h-screen">
      <BackgroundBlobs />

      <div className="relative" style={{ zIndex: 1 }}>
        <div className="max-w-[960px] mx-auto px-10 py-20 lg:py-28">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-16">
            <Link to="/" className="text-[11px] text-white/30 hover:text-white/55 transition-colors">Home</Link>
            <ChevronRight size={11} className="text-white/20" />
            <span className="text-[11px] text-white/45">Contact Us</span>
          </nav>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <h1 className="text-[64px] lg:text-[96px] font-light text-white leading-[0.95] tracking-[-0.02em]">
              Ask Us<br />Anything
            </h1>
          </motion.div>

          {/* Form */}
          {submitted ? (
            <SuccessMessage />
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <FormSection
                title="General Information Request"
                open={open}
                onToggle={() => setOpen(o => !o)}
              >
                {/* Inquiry type */}
                <div className="mb-10">
                  <UnderlineSelect
                    label="Select the Reason for Your Inquiry"
                    value={form.inquiry_type}
                    onChange={v => set('inquiry_type', v)}
                    options={INQUIRY_TYPES}
                    placeholder="Choose one…"
                    required
                    error={errors.inquiry_type}
                  />
                </div>

                {/* Name row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 mb-8">
                  <UnderlineInput
                    label="First Name"
                    value={form.first_name}
                    onChange={v => set('first_name', v)}
                    required
                    error={errors.first_name}
                  />
                  <UnderlineInput
                    label="Last Name"
                    value={form.last_name}
                    onChange={v => set('last_name', v)}
                    required
                    error={errors.last_name}
                  />
                </div>

                {/* Email + Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 mb-8">
                  <UnderlineInput
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={v => set('email', v)}
                    required
                    error={errors.email}
                  />
                  <UnderlineInput
                    label="Phone"
                    type="tel"
                    value={form.phone}
                    onChange={v => set('phone', v)}
                  />
                </div>

                {/* Company + Position */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 mb-8">
                  <UnderlineInput
                    label="Company"
                    value={form.company}
                    onChange={v => set('company', v)}
                  />
                  <UnderlineSelect
                    label="Position"
                    value={form.position}
                    onChange={v => set('position', v)}
                    options={POSITIONS}
                    placeholder="Select…"
                  />
                </div>

                {/* Country + City */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 mb-10">
                  <UnderlineSelect
                    label="Country"
                    value={form.country}
                    onChange={v => set('country', v)}
                    options={COUNTRIES}
                    placeholder="Select…"
                    required
                    error={errors.country}
                  />
                  <UnderlineInput
                    label="City"
                    value={form.city}
                    onChange={v => set('city', v)}
                  />
                </div>

                {/* Message */}
                <div className="mb-10">
                  <UnderlineTextarea
                    label="Your inquiry or comments"
                    value={form.message}
                    onChange={v => set('message', v)}
                  />
                </div>

                {/* How heard */}
                <div className="mb-12">
                  <UnderlineSelect
                    label="How did you hear about NEX4?"
                    value={form.how_heard}
                    onChange={v => set('how_heard', v)}
                    options={HOW_HEARD}
                    placeholder="Select…"
                    required={false}
                  />
                </div>

                {/* Checkboxes */}
                <div className="flex flex-col gap-5 mb-10">
                  <div>
                    <FormCheckbox
                      checked={form.consent}
                      onChange={v => set('consent', v)}
                    >
                      I consent to NEX4 ICT Solutions processing my personal information in accordance with our{' '}
                      <span className="underline text-white/60">Privacy Policy</span>
                      , and understand that processing may take place outside of my home jurisdiction.{' '}
                      <span className="text-white/30">*</span>
                    </FormCheckbox>
                    {errors.consent && (
                      <p className="text-[10px] text-red-400/70 mt-1.5 ml-9">You must accept to continue.</p>
                    )}
                  </div>

                  <FormCheckbox
                    checked={form.subscribed}
                    onChange={v => set('subscribed', v)}
                  >
                    I'd like to receive updates from NEX4 about cloud solutions, events, and Microsoft news by email.
                  </FormCheckbox>
                </div>

                {/* Footer row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-3 border border-white/35 rounded-full px-10 py-4 text-[12px] font-bold uppercase tracking-[0.22em] text-white hover:bg-white hover:text-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Sending…' : 'Submit'}
                  </button>
                  <p className="text-[11px] text-white/25">* Indicates required fields</p>
                </div>

                {serverError && (
                  <p className="mt-4 text-[12px] text-red-400/70">{serverError}</p>
                )}
              </FormSection>
            </form>
          )}
        </div>
      </div>

      <OurLocations />
    </div>
  );
}
