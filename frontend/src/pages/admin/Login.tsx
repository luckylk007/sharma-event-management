import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { SEO } from '@/components/seo/SEO';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  if (!isLoading && isAuthenticated) {
    const redirectTo = (location.state as { from?: string } | null)?.from || '/admin/dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  const onSubmit = async (values: LoginValues) => {
    setServerError(null);
    try {
      await login(values);
      toast.success('Welcome back!', { className: 'toast-premium' });
      navigate('/admin/dashboard', { replace: true });
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Invalid credentials');
    }
  };

  return (
    <>
      <SEO title="Admin Login" description="Sign in to the Sharma Events admin panel" noIndex />
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-ink)] px-6">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center">
            <p className="font-display text-3xl text-[var(--color-cream)]">
              Sharma <span className="text-[var(--color-gold)]">Events</span>
            </p>
            <p className="eyebrow mt-3">Admin Panel</p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 border border-[var(--color-line)] bg-[var(--color-charcoal)] p-8 sm:p-10"
          >
            <Input
              label="Email Address"
              type="email"
              placeholder="you@sharmaevents.com"
              {...register('email')}
              error={errors.email?.message}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              error={errors.password?.message}
            />
            {serverError && <p className="text-sm text-red-400">{serverError}</p>}
            <Button type="submit" isLoading={isSubmitting} fullWidth size="lg">
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
