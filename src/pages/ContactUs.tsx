import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { BackgroundBlobs } from '@/components/common/BackgroundBlobs';
import { OurLocations } from '@/components/home/OurLocations';
import { cn } from '@/lib/utils';

// ── Options ───────────────────────────────────────────────────────────────────

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

// ── Form state ────────────────────────────────────────────────────────────────

type FormData = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  country: string;
  city: string;
  message: string;
  consent: boolean;
};

const EMPTY: FormData = {
  first_name: '',
  last_name:  '',
  email:      '',
  phone:      '',
  company:    '',
  position:   '',
  country:    '',
  city:       '',
  message:    '',
  consent:    false,
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
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function set<K extends keyof FormData>(key: K, val: FormData[K]) {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(e => { const n = { ...e }; delete n[key]; return n; });
  }

  function validate(): boolean {
    const e: Errors = {};
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
        inquiry_type: null,
        first_name:   form.first_name,
        last_name:    form.last_name,
        email:        form.email,
        phone:        form.phone    || null,
        company:      form.company  || null,
        position:     form.position || null,
        country:      form.country  || null,
        city:         form.city     || null,
        message:      form.message  || null,
        how_heard:    null,
        subscribed:   false,
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
            <h1 className="text-[46px] lg:text-[62px] font-semibold leading-tight text-white">
              Let's <span className="gradient-text">connect.</span><br />
              <span className="font-light">We'd love to <span className="gradient-text">hear from you.</span></span>
            </h1>
          </motion.div>

          {/* Form */}
          {submitted ? (
            <SuccessMessage />
          ) : (
            <form onSubmit={handleSubmit} noValidate className="border-t border-white/[0.08] pt-12">
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
              <div className="mb-12">
                <UnderlineTextarea
                  label="Your inquiry or comments"
                  value={form.message}
                  onChange={v => set('message', v)}
                />
              </div>

              {/* Consent */}
              <div className="mb-10">
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
            </form>
          )}
        </div>
      </div>

      <OurLocations />
    </div>
  );
}
