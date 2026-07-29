import { useState } from 'react';
import type { FormEvent } from 'react';
import toast from 'react-hot-toast';
import { FiArrowRight } from 'react-icons/fi';
import { newsletterApi } from '@/api';
import { cn } from '@/utils/cn';

interface NewsletterFormProps {
  className?: string;
  dark?: boolean;
}

export function NewsletterForm({ className }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await newsletterApi.subscribe(email.trim());
      toast.success(res.message || 'Successfully subscribed!', { className: 'toast-premium' });
      setEmail('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Subscription failed', {
        className: 'toast-premium',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('flex items-stretch border-b border-[var(--color-line)] focus-within:border-[var(--color-gold)] transition-colors duration-300', className)}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        aria-label="Email address"
        className="w-full min-w-0 bg-transparent py-3 text-sm text-[var(--color-cream)] placeholder:text-[var(--color-muted)]/70 focus:outline-none"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        aria-label="Subscribe"
        className="flex shrink-0 items-center justify-center px-2 text-[var(--color-gold)] transition-transform duration-300 hover:translate-x-1 disabled:opacity-50"
      >
        {isSubmitting ? (
          <span className="h-4 w-4 animate-spin rounded-full border-[1.5px] border-current border-t-transparent" />
        ) : (
          <FiArrowRight size={20} />
        )}
      </button>
    </form>
  );
}
