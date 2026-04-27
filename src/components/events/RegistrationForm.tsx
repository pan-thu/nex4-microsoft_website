import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { EventService } from '@/services/EventService';

const schema = z.object({
  first_name:   z.string().min(1, 'Required'),
  last_name:    z.string().min(1, 'Required'),
  email:        z.string().email('Enter a valid email'),
  company_name: z.string().optional(),
  job_title:    z.string().optional(),
  country:      z.string().min(1, 'Required'),
});
type FormData = z.infer<typeof schema>;

const FIELDS: {
  name: keyof FormData;
  label: string;
  required: boolean;
  type?: string;
}[] = [
  { name: 'first_name',   label: 'First name',   required: true },
  { name: 'last_name',    label: 'Last name',    required: true },
  { name: 'email',        label: 'Email address', required: true, type: 'email' },
  { name: 'company_name', label: 'Company name', required: false },
  { name: 'job_title',    label: 'Job title',    required: false },
  { name: 'country',      label: 'Country',      required: true },
];

interface Props {
  eventId: string;
  eventTitle: string;
}

export function RegistrationForm({ eventId }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setServerError(null);
    try {
      await EventService.createRegistration({ event_id: eventId, ...data });
      setSubmitted(true);
    } catch {
      setServerError('Something went wrong. Please try again.');
    }
  }

  if (submitted) {
    return (
      <div className="bg-[#0e0e0e] border border-white/[0.08] rounded-xl p-8 text-center">
        <div className="w-12 h-12 border border-white/20 flex items-center justify-center mx-auto mb-5">
          <span className="text-white text-xl">✓</span>
        </div>
        <h3 className="text-white font-semibold text-lg mb-2">You&apos;re registered.</h3>
        <p className="text-white/35 text-[13px] leading-relaxed">
          We&apos;ll send confirmation and session details to your email.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#0e0e0e] border border-white/[0.08] rounded-xl p-7 lg:p-8">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-white/[0.06]">
        <p className="text-[9px] uppercase tracking-[0.2em] text-white/25 font-semibold mb-2">
          Registration
        </p>
        <h3 className="text-white font-semibold text-[22px] leading-snug">
          Reserve your spot.
        </h3>
        <p className="text-white/30 text-[13px] mt-1">Fill in your details below.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
        {FIELDS.map(f => (
          <div key={f.name} className="group">
            <label className="block text-[10px] uppercase tracking-[0.15em] text-white/30 font-medium mb-2">
              {f.label}{f.required && <span className="text-white/20 ml-0.5">*</span>}
            </label>
            <input
              {...register(f.name)}
              type={f.type ?? 'text'}
              autoComplete={f.name === 'email' ? 'email' : 'off'}
              className={cn(
                'w-full bg-transparent border-0 border-b pb-2 text-white text-[14px] outline-none transition-colors duration-200 placeholder:text-white/15',
                errors[f.name]
                  ? 'border-red-400/50 focus:border-red-400'
                  : 'border-white/10 focus:border-white/40',
              )}
            />
            {errors[f.name] && (
              <p className="mt-1.5 text-[11px] text-red-400/70">{errors[f.name]?.message}</p>
            )}
          </div>
        ))}

        {serverError && (
          <p className="text-[12px] text-red-400/70">{serverError}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full bg-white text-black text-[13px] font-semibold py-3.5 rounded-lg hover:bg-white/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Registering…' : 'Register'}
        </button>

        <p className="text-[11px] text-white/15 text-center leading-relaxed">
          By registering you agree to our{' '}
          <a href="#" className="text-white/25 hover:text-white/40 underline underline-offset-2 transition-colors">
            privacy policy
          </a>
          .
        </p>
      </form>
    </div>
  );
}
