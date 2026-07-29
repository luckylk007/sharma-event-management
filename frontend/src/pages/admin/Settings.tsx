import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';
import { settingsApi } from '@/api';
import type { Settings } from '@/types';
import { PageHeader } from '@/components/admin/PageHeader';
import { Tabs } from '@/components/admin/Tabs';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

interface TimelineForm {
  year: string;
  title: string;
  description: string;
}
interface ValueForm {
  title: string;
  description: string;
  icon: string;
}
interface TeamForm {
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin: string;
  instagram: string;
}
interface StatForm {
  label: string;
  value: number;
  suffix: string;
}
interface ProcessForm {
  step: number;
  title: string;
  description: string;
}
interface FaqForm {
  question: string;
  answer: string;
}
interface StringForm {
  value: string;
}

interface SettingsFormValues {
  companyName: string;
  tagline: string;
  logo: string;
  logoDark: string;
  favicon: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: { street: string; city: string; state: string; pincode: string; country: string };
  businessHours: { weekdays: string; saturday: string; sunday: string };
  socialLinks: { facebook: string; instagram: string; youtube: string; twitter: string; linkedin: string };
  mapEmbedUrl: string;
  googleAnalyticsId: string;
  googleSearchConsoleId: string;
  smtp: { host: string; port: number; user: string; pass: string; from: string };
  seoDefaults: { metaTitle: string; metaDescription: string; keywords: string };
  about: {
    story: string;
    mission: string;
    vision: string;
    timeline: TimelineForm[];
    values: ValueForm[];
    team: TeamForm[];
    whyChooseUs: StringForm[];
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    heroImage: string;
    heroCta: string;
    stats: StatForm[];
    process: ProcessForm[];
    faqs: FaqForm[];
  };
  privacyPolicy: string;
  termsConditions: string;
  newsletterEnabled: boolean;
}

const DEFAULT_VALUES: SettingsFormValues = {
  companyName: '',
  tagline: '',
  logo: '',
  logoDark: '',
  favicon: '',
  email: '',
  phone: '',
  whatsapp: '',
  address: { street: '', city: '', state: '', pincode: '', country: '' },
  businessHours: { weekdays: '', saturday: '', sunday: '' },
  socialLinks: { facebook: '', instagram: '', youtube: '', twitter: '', linkedin: '' },
  mapEmbedUrl: '',
  googleAnalyticsId: '',
  googleSearchConsoleId: '',
  smtp: { host: '', port: 587, user: '', pass: '', from: '' },
  seoDefaults: { metaTitle: '', metaDescription: '', keywords: '' },
  about: { story: '', mission: '', vision: '', timeline: [], values: [], team: [], whyChooseUs: [] },
  home: { heroTitle: '', heroSubtitle: '', heroImage: '', heroCta: '', stats: [], process: [], faqs: [] },
  privacyPolicy: '',
  termsConditions: '',
  newsletterEnabled: true,
};

const TABS = [
  { id: 'general', label: 'General' },
  { id: 'social', label: 'Social' },
  { id: 'about', label: 'About' },
  { id: 'home', label: 'Home' },
  { id: 'seo', label: 'SEO' },
  { id: 'smtp', label: 'SMTP' },
  { id: 'legal', label: 'Privacy & Terms' },
];

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(true);

  const { register, control, handleSubmit, watch, setValue, reset, formState: { isSubmitting } } =
    useForm<SettingsFormValues>({ defaultValues: DEFAULT_VALUES });

  const timeline = useFieldArray({ control, name: 'about.timeline' });
  const values = useFieldArray({ control, name: 'about.values' });
  const team = useFieldArray({ control, name: 'about.team' });
  const whyChooseUs = useFieldArray({ control, name: 'about.whyChooseUs' });
  const stats = useFieldArray({ control, name: 'home.stats' });
  const process = useFieldArray({ control, name: 'home.process' });
  const homeFaqs = useFieldArray({ control, name: 'home.faqs' });

  useEffect(() => {
    settingsApi
      .getAdmin()
      .then((res) => {
        const s = res.data as Settings & { smtp?: { host: string; port: number; user: string; from: string } };
        reset({
          companyName: s.companyName || '',
          tagline: s.tagline || '',
          logo: s.logo || '',
          logoDark: s.logoDark || '',
          favicon: s.favicon || '',
          email: s.email || '',
          phone: s.phone || '',
          whatsapp: s.whatsapp || '',
          address: {
            street: s.address?.street || '',
            city: s.address?.city || '',
            state: s.address?.state || '',
            pincode: s.address?.pincode || '',
            country: s.address?.country || '',
          },
          businessHours: {
            weekdays: s.businessHours?.weekdays || '',
            saturday: s.businessHours?.saturday || '',
            sunday: s.businessHours?.sunday || '',
          },
          socialLinks: {
            facebook: s.socialLinks?.facebook || '',
            instagram: s.socialLinks?.instagram || '',
            youtube: s.socialLinks?.youtube || '',
            twitter: s.socialLinks?.twitter || '',
            linkedin: s.socialLinks?.linkedin || '',
          },
          mapEmbedUrl: s.mapEmbedUrl || '',
          googleAnalyticsId: s.googleAnalyticsId || '',
          googleSearchConsoleId: s.googleSearchConsoleId || '',
          smtp: {
            host: s.smtp?.host || '',
            port: s.smtp?.port || 587,
            user: s.smtp?.user || '',
            pass: '',
            from: s.smtp?.from || '',
          },
          seoDefaults: {
            metaTitle: s.seoDefaults?.metaTitle || '',
            metaDescription: s.seoDefaults?.metaDescription || '',
            keywords: s.seoDefaults?.keywords?.join(', ') || '',
          },
          about: {
            story: s.about?.story || '',
            mission: s.about?.mission || '',
            vision: s.about?.vision || '',
            timeline: s.about?.timeline || [],
            values: s.about?.values || [],
            team: (s.about?.team || []).map((t) => ({
              name: t.name,
              role: t.role,
              bio: t.bio,
              image: t.image,
              linkedin: t.social?.linkedin || '',
              instagram: t.social?.instagram || '',
            })),
            whyChooseUs: (s.about?.whyChooseUs || []).map((v) => ({ value: v })),
          },
          home: {
            heroTitle: s.home?.heroTitle || '',
            heroSubtitle: s.home?.heroSubtitle || '',
            heroImage: s.home?.heroImage || '',
            heroCta: s.home?.heroCta || '',
            stats: s.home?.stats || [],
            process: s.home?.process || [],
            faqs: s.home?.faqs || [],
          },
          privacyPolicy: s.privacyPolicy || '',
          termsConditions: s.termsConditions || '',
          newsletterEnabled: s.newsletterEnabled ?? true,
        });
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : 'Failed to load settings');
      })
      .finally(() => setIsLoading(false));
  }, [reset]);

  const onSubmit = async (formValues: SettingsFormValues) => {
    if (!formValues.companyName.trim() || !formValues.email.trim()) {
      toast.error('Company name and email are required');
      setActiveTab('general');
      return;
    }

    const smtpPayload: Settings['smtp'] = {
      host: formValues.smtp.host,
      port: Number(formValues.smtp.port) || 587,
      user: formValues.smtp.user,
      from: formValues.smtp.from,
      ...(formValues.smtp.pass ? { pass: formValues.smtp.pass } : {}),
    };

    const payload: Partial<Settings> = {
      companyName: formValues.companyName,
      tagline: formValues.tagline,
      logo: formValues.logo,
      logoDark: formValues.logoDark,
      favicon: formValues.favicon,
      email: formValues.email,
      phone: formValues.phone,
      whatsapp: formValues.whatsapp,
      address: formValues.address,
      businessHours: formValues.businessHours,
      socialLinks: formValues.socialLinks,
      mapEmbedUrl: formValues.mapEmbedUrl,
      googleAnalyticsId: formValues.googleAnalyticsId,
      googleSearchConsoleId: formValues.googleSearchConsoleId,
      smtp: smtpPayload,
      seoDefaults: {
        metaTitle: formValues.seoDefaults.metaTitle,
        metaDescription: formValues.seoDefaults.metaDescription,
        keywords: formValues.seoDefaults.keywords
          ? formValues.seoDefaults.keywords.split(',').map((k) => k.trim()).filter(Boolean)
          : [],
      },
      about: {
        story: formValues.about.story,
        mission: formValues.about.mission,
        vision: formValues.about.vision,
        timeline: formValues.about.timeline,
        values: formValues.about.values,
        team: formValues.about.team.map((t) => ({
          name: t.name,
          role: t.role,
          bio: t.bio,
          image: t.image,
          social: { linkedin: t.linkedin, instagram: t.instagram },
        })),
        whyChooseUs: formValues.about.whyChooseUs.map((w) => w.value).filter(Boolean),
      },
      home: formValues.home,
      privacyPolicy: formValues.privacyPolicy,
      termsConditions: formValues.termsConditions,
      newsletterEnabled: formValues.newsletterEnabled,
    };

    try {
      await settingsApi.update(payload);
      toast.success('Settings saved successfully');
      setValue('smtp.pass', '');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save settings');
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Configure your website's global content and configuration."
        actions={
          <Button icon={<FiSave />} iconPosition="left" isLoading={isSubmitting} onClick={handleSubmit(onSubmit)}>
            Save Settings
          </Button>
        }
      />

      <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} className="mb-8" />

      <form className="space-y-6">
        {activeTab === 'general' && (
          <div className="space-y-6 border border-[var(--color-line)] bg-[var(--color-charcoal)] p-6 sm:p-8">
            <h2 className="font-display text-xl text-[var(--color-cream)]">Company Details</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input label="Company Name" {...register('companyName')} required />
              <Input label="Tagline" {...register('tagline')} />
              <Input label="Email" type="email" {...register('email')} required />
              <Input label="Phone" {...register('phone')} />
              <Input label="WhatsApp Number" {...register('whatsapp')} />
              <Input label="Newsletter Enabled" type="checkbox" className="hidden" />
            </div>
            <label className="flex items-center gap-3 text-sm text-[var(--color-cream)]">
              <input type="checkbox" {...register('newsletterEnabled')} className="h-4 w-4 accent-[var(--color-gold)]" />
              Newsletter Signup Enabled
            </label>

            <div className="hairline" />
            <h2 className="font-display text-xl text-[var(--color-cream)]">Branding</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <ImageUploadField label="Logo URL" value={watch('logo')} onChange={(url) => setValue('logo', url)} />
              <ImageUploadField
                label="Dark Logo URL"
                value={watch('logoDark')}
                onChange={(url) => setValue('logoDark', url)}
              />
              <Input label="Favicon URL" {...register('favicon')} />
            </div>

            <div className="hairline" />
            <h2 className="font-display text-xl text-[var(--color-cream)]">Address</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input label="Street" {...register('address.street')} />
              <Input label="City" {...register('address.city')} />
              <Input label="State" {...register('address.state')} />
              <Input label="Pincode" {...register('address.pincode')} />
              <Input label="Country" {...register('address.country')} />
              <Textarea label="Map Embed URL" rows={2} {...register('mapEmbedUrl')} />
            </div>

            <div className="hairline" />
            <h2 className="font-display text-xl text-[var(--color-cream)]">Business Hours</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <Input label="Weekdays" {...register('businessHours.weekdays')} />
              <Input label="Saturday" {...register('businessHours.saturday')} />
              <Input label="Sunday" {...register('businessHours.sunday')} />
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-6 border border-[var(--color-line)] bg-[var(--color-charcoal)] p-6 sm:p-8">
            <h2 className="font-display text-xl text-[var(--color-cream)]">Social Links</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input label="Facebook" {...register('socialLinks.facebook')} />
              <Input label="Instagram" {...register('socialLinks.instagram')} />
              <Input label="YouTube" {...register('socialLinks.youtube')} />
              <Input label="Twitter / X" {...register('socialLinks.twitter')} />
              <Input label="LinkedIn" {...register('socialLinks.linkedin')} />
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-8">
            <div className="space-y-6 border border-[var(--color-line)] bg-[var(--color-charcoal)] p-6 sm:p-8">
              <h2 className="font-display text-xl text-[var(--color-cream)]">Story</h2>
              <Textarea label="Our Story" rows={4} {...register('about.story')} />
              <Textarea label="Mission" rows={3} {...register('about.mission')} />
              <Textarea label="Vision" rows={3} {...register('about.vision')} />
            </div>

            <div className="space-y-6 border border-[var(--color-line)] bg-[var(--color-charcoal)] p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl text-[var(--color-cream)]">Timeline</h2>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  icon={<FiPlus />}
                  iconPosition="left"
                  onClick={() => timeline.append({ year: '', title: '', description: '' })}
                >
                  Add Item
                </Button>
              </div>
              {timeline.fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 gap-3 border border-[var(--color-line)] p-4 sm:grid-cols-[100px_1fr_auto]">
                  <Input label="Year" {...register(`about.timeline.${index}.year` as const)} />
                  <Input label="Title" {...register(`about.timeline.${index}.title` as const)} />
                  <button
                    type="button"
                    onClick={() => timeline.remove(index)}
                    className="mt-7 justify-self-end text-[var(--color-muted)] hover:text-red-400 sm:mt-0 sm:self-end sm:pb-2.5"
                    aria-label="Remove"
                  >
                    <FiTrash2 size={16} />
                  </button>
                  <div className="sm:col-span-3">
                    <Textarea label="Description" rows={2} {...register(`about.timeline.${index}.description` as const)} />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6 border border-[var(--color-line)] bg-[var(--color-charcoal)] p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl text-[var(--color-cream)]">Core Values</h2>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  icon={<FiPlus />}
                  iconPosition="left"
                  onClick={() => values.append({ title: '', description: '', icon: '' })}
                >
                  Add Value
                </Button>
              </div>
              {values.fields.map((field, index) => (
                <div key={field.id} className="space-y-3 border border-[var(--color-line)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                      <Input label="Title" {...register(`about.values.${index}.title` as const)} />
                      <Input label="Icon" {...register(`about.values.${index}.icon` as const)} hint="react-icons name" />
                    </div>
                    <button
                      type="button"
                      onClick={() => values.remove(index)}
                      className="mt-7 shrink-0 text-[var(--color-muted)] hover:text-red-400"
                      aria-label="Remove"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                  <Textarea label="Description" rows={2} {...register(`about.values.${index}.description` as const)} />
                </div>
              ))}
            </div>

            <div className="space-y-6 border border-[var(--color-line)] bg-[var(--color-charcoal)] p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl text-[var(--color-cream)]">Team Members</h2>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  icon={<FiPlus />}
                  iconPosition="left"
                  onClick={() =>
                    team.append({ name: '', role: '', bio: '', image: '', linkedin: '', instagram: '' })
                  }
                >
                  Add Member
                </Button>
              </div>
              {team.fields.map((field, index) => (
                <div key={field.id} className="space-y-3 border border-[var(--color-line)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                      <Input label="Name" {...register(`about.team.${index}.name` as const)} />
                      <Input label="Role" {...register(`about.team.${index}.role` as const)} />
                    </div>
                    <button
                      type="button"
                      onClick={() => team.remove(index)}
                      className="mt-7 shrink-0 text-[var(--color-muted)] hover:text-red-400"
                      aria-label="Remove"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                  <Textarea label="Bio" rows={2} {...register(`about.team.${index}.bio` as const)} />
                  <ImageUploadField
                    label="Photo URL"
                    value={watch(`about.team.${index}.image`) || ''}
                    onChange={(url) => setValue(`about.team.${index}.image`, url)}
                  />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Input label="LinkedIn" {...register(`about.team.${index}.linkedin` as const)} />
                    <Input label="Instagram" {...register(`about.team.${index}.instagram` as const)} />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6 border border-[var(--color-line)] bg-[var(--color-charcoal)] p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl text-[var(--color-cream)]">Why Choose Us</h2>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  icon={<FiPlus />}
                  iconPosition="left"
                  onClick={() => whyChooseUs.append({ value: '' })}
                >
                  Add Reason
                </Button>
              </div>
              {whyChooseUs.fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-3">
                  <div className="flex-1">
                    <Input {...register(`about.whyChooseUs.${index}.value` as const)} />
                  </div>
                  <button
                    type="button"
                    onClick={() => whyChooseUs.remove(index)}
                    className="shrink-0 text-[var(--color-muted)] hover:text-red-400"
                    aria-label="Remove"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'home' && (
          <div className="space-y-8">
            <div className="space-y-6 border border-[var(--color-line)] bg-[var(--color-charcoal)] p-6 sm:p-8">
              <h2 className="font-display text-xl text-[var(--color-cream)]">Hero Section</h2>
              <Input label="Hero Title" {...register('home.heroTitle')} />
              <Textarea label="Hero Subtitle" rows={2} {...register('home.heroSubtitle')} />
              <ImageUploadField
                label="Hero Image URL"
                value={watch('home.heroImage')}
                onChange={(url) => setValue('home.heroImage', url)}
              />
              <Input label="Hero CTA Text" {...register('home.heroCta')} />
            </div>

            <div className="space-y-6 border border-[var(--color-line)] bg-[var(--color-charcoal)] p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl text-[var(--color-cream)]">Stats</h2>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  icon={<FiPlus />}
                  iconPosition="left"
                  onClick={() => stats.append({ label: '', value: 0, suffix: '' })}
                >
                  Add Stat
                </Button>
              </div>
              {stats.fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 gap-3 border border-[var(--color-line)] p-4 sm:grid-cols-[1fr_120px_120px_auto]">
                  <Input label="Label" {...register(`home.stats.${index}.label` as const)} />
                  <Input
                    label="Value"
                    type="number"
                    {...register(`home.stats.${index}.value` as const, { valueAsNumber: true })}
                  />
                  <Input label="Suffix" {...register(`home.stats.${index}.suffix` as const)} placeholder="+" />
                  <button
                    type="button"
                    onClick={() => stats.remove(index)}
                    className="justify-self-end text-[var(--color-muted)] hover:text-red-400 sm:self-end sm:pb-2.5"
                    aria-label="Remove"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="space-y-6 border border-[var(--color-line)] bg-[var(--color-charcoal)] p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl text-[var(--color-cream)]">Process Steps</h2>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  icon={<FiPlus />}
                  iconPosition="left"
                  onClick={() =>
                    process.append({ step: process.fields.length + 1, title: '', description: '' })
                  }
                >
                  Add Step
                </Button>
              </div>
              {process.fields.map((field, index) => (
                <div key={field.id} className="space-y-3 border border-[var(--color-line)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-[80px_1fr]">
                      <Input
                        label="Step #"
                        type="number"
                        {...register(`home.process.${index}.step` as const, { valueAsNumber: true })}
                      />
                      <Input label="Title" {...register(`home.process.${index}.title` as const)} />
                    </div>
                    <button
                      type="button"
                      onClick={() => process.remove(index)}
                      className="mt-7 shrink-0 text-[var(--color-muted)] hover:text-red-400"
                      aria-label="Remove"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                  <Textarea label="Description" rows={2} {...register(`home.process.${index}.description` as const)} />
                </div>
              ))}
            </div>

            <div className="space-y-6 border border-[var(--color-line)] bg-[var(--color-charcoal)] p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl text-[var(--color-cream)]">Homepage FAQs</h2>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  icon={<FiPlus />}
                  iconPosition="left"
                  onClick={() => homeFaqs.append({ question: '', answer: '' })}
                >
                  Add FAQ
                </Button>
              </div>
              {homeFaqs.fields.map((field, index) => (
                <div key={field.id} className="space-y-3 border border-[var(--color-line)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <Input label={`Question ${index + 1}`} {...register(`home.faqs.${index}.question` as const)} />
                    <button
                      type="button"
                      onClick={() => homeFaqs.remove(index)}
                      className="mt-7 shrink-0 text-[var(--color-muted)] hover:text-red-400"
                      aria-label="Remove"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                  <Textarea label="Answer" rows={2} {...register(`home.faqs.${index}.answer` as const)} />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-6 border border-[var(--color-line)] bg-[var(--color-charcoal)] p-6 sm:p-8">
            <h2 className="font-display text-xl text-[var(--color-cream)]">Default SEO</h2>
            <Input label="Default Meta Title" {...register('seoDefaults.metaTitle')} />
            <Textarea label="Default Meta Description" rows={3} {...register('seoDefaults.metaDescription')} />
            <Input label="Default Keywords" {...register('seoDefaults.keywords')} hint="Comma-separated" />

            <div className="hairline" />
            <h2 className="font-display text-xl text-[var(--color-cream)]">Analytics</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input label="Google Analytics ID" {...register('googleAnalyticsId')} placeholder="G-XXXXXXXXXX" />
              <Input label="Google Search Console ID" {...register('googleSearchConsoleId')} />
            </div>
          </div>
        )}

        {activeTab === 'smtp' && (
          <div className="space-y-6 border border-[var(--color-line)] bg-[var(--color-charcoal)] p-6 sm:p-8">
            <h2 className="font-display text-xl text-[var(--color-cream)]">SMTP Configuration</h2>
            <p className="text-sm text-[var(--color-muted)]">
              Used for sending transactional emails such as contact form notifications.
            </p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input label="SMTP Host" {...register('smtp.host')} placeholder="smtp.gmail.com" />
              <Input
                label="SMTP Port"
                type="number"
                {...register('smtp.port', { valueAsNumber: true })}
              />
              <Input label="SMTP Username" {...register('smtp.user')} />
              <Input
                label="SMTP Password"
                type="password"
                {...register('smtp.pass')}
                hint="Leave blank to keep the existing password."
              />
              <Input label="From Address" {...register('smtp.from')} placeholder="Sharma Events <noreply@sharmaevents.com>" />
            </div>
          </div>
        )}

        {activeTab === 'legal' && (
          <div className="space-y-6 border border-[var(--color-line)] bg-[var(--color-charcoal)] p-6 sm:p-8">
            <h2 className="font-display text-xl text-[var(--color-cream)]">Privacy Policy</h2>
            <Textarea rows={12} {...register('privacyPolicy')} hint="Supports HTML." />
            <div className="hairline" />
            <h2 className="font-display text-xl text-[var(--color-cream)]">Terms &amp; Conditions</h2>
            <Textarea rows={12} {...register('termsConditions')} hint="Supports HTML." />
          </div>
        )}
      </form>
    </div>
  );
}
