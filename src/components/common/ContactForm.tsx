import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { contactsApi } from '@/api';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { CONTACT_SUBJECTS } from '@/constants';

const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(8, 'Please enter a valid phone number'),
  subject: z.string().min(1, 'Please select an event type'),
  eventDate: z.string().optional(),
  message: z.string().min(10, 'Please tell us a little more about your event'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface ContactFormProps {
  onSuccess?: () => void;
  defaultSubject?: string;
  defaultMessage?: string;
}

export function ContactForm({ onSuccess, defaultSubject = '', defaultMessage = '' }: ContactFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: defaultSubject,
      eventDate: '',
      message: defaultMessage,
    },
  });

  useEffect(() => {
    if (defaultSubject || defaultMessage) {
      reset((prev) => ({
        ...prev,
        subject: defaultSubject || prev.subject,
        message: defaultMessage || prev.message,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultSubject, defaultMessage]);

  const onSubmit = async (values: ContactFormValues) => {
    try {
      const res = await contactsApi.submit(values);
      toast.success(res.message || 'Opening WhatsApp to send your enquiry…', {
        className: 'toast-premium',
      });
      reset();
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong', {
        className: 'toast-premium',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
        <Input label="Full Name" placeholder="Your name" {...register('name')} error={errors.name?.message} />
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          {...register('email')}
          error={errors.email?.message}
        />
      </div>

      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
        <Input
          label="Phone Number"
          type="tel"
          placeholder="+91 98765 43210"
          {...register('phone')}
          error={errors.phone?.message}
        />
        <Select
          label="Event Type"
          placeholder="Select an event type"
          options={CONTACT_SUBJECTS.map((s) => ({ label: s, value: s }))}
          {...register('subject')}
          error={errors.subject?.message}
        />
      </div>

      <Input
        label="Preferred Event Date (Optional)"
        type="date"
        {...register('eventDate')}
        error={errors.eventDate?.message}
      />

      <Textarea
        label="Tell Us About Your Event"
        placeholder="Share your vision, guest count, budget or any details that will help us plan..."
        {...register('message')}
        error={errors.message?.message}
      />

      <Button type="submit" isLoading={isSubmitting} fullWidth size="lg">
        Send Enquiry
      </Button>
    </form>
  );
}
