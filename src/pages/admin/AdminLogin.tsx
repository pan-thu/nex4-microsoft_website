import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Auth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { ASSETS } from '@/lib/assets';

const schema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Required'),
});
type FormData = z.infer<typeof schema>;

export function AdminLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setError(null);
    try {
      await Auth.signIn(data.email, data.password);
      navigate('/admin/events');
    } catch {
      setError('Invalid email or password.');
    }
  }

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-10 py-5 border-b border-white/[0.06]">
        <Link to="/">
          <img src={ASSETS.logo} alt="NEX4" className="h-8 w-auto object-contain" />
        </Link>
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-semibold">
          Admin Portal
        </span>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <p className="text-[9px] uppercase tracking-[0.22em] text-white/25 font-semibold mb-3">
              NEX4 Admin
            </p>
            <h1 className="text-[28px] font-semibold text-white">Sign in.</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-7">
            {/* Email */}
            <div>
              <label className="block text-[10px] uppercase tracking-[0.15em] text-white/30 font-medium mb-2">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                className={cn(
                  'w-full bg-transparent border-0 border-b pb-2 text-white text-[14px] outline-none transition-colors duration-200 placeholder:text-white/15',
                  errors.email ? 'border-red-400/50' : 'border-white/10 focus:border-white/40',
                )}
              />
              {errors.email && <p className="mt-1.5 text-[11px] text-red-400/70">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] uppercase tracking-[0.15em] text-white/30 font-medium mb-2">
                Password
              </label>
              <input
                {...register('password')}
                type="password"
                autoComplete="current-password"
                className={cn(
                  'w-full bg-transparent border-0 border-b pb-2 text-white text-[14px] outline-none transition-colors duration-200',
                  errors.password ? 'border-red-400/50' : 'border-white/10 focus:border-white/40',
                )}
              />
              {errors.password && <p className="mt-1.5 text-[11px] text-red-400/70">{errors.password.message}</p>}
            </div>

            {error && (
              <p className="text-[12px] text-red-400/70 -mt-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full bg-white text-black text-[13px] font-semibold py-3.5 hover:bg-white/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
