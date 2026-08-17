'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { CheckIcon } from '@/components/icons';
import { api } from '@/lib/api';
import { getMyVendor, upsertVendor } from '@/lib/vendor-client';
import { DraftBanner } from './DraftBanner';
import { useStepSave } from '@/lib/useStepSave';
import { AuthError } from '@/components/auth/AuthError';

const schema = z.object({
  whatsappNumber: z.string().regex(/^\+234[789]\d{9}$/, 'Use Nigerian format: +234 followed by 10 digits starting with 7, 8, or 9'),
  publicPhone: z.string().regex(/^\+234[789]\d{9}$/).optional().or(z.literal('')),
  institutionId: z.string().min(1, 'Required'),
  campusId: z.string().optional(),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  instagramHandle: z.string().optional().or(z.literal('')),
  tiktokHandle: z.string().optional().or(z.literal('')),
  twitterHandle: z.string().optional().or(z.literal('')),
  facebookPage: z.string().url().optional().or(z.literal('')),
  linkedinProfile: z.string().url().optional().or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

interface Institution {
  id: string;
  name: string;
  campuses: Array<{ id: string; name: string; isPrimary: boolean }>;
}

const SOCIAL_FIELDS: Array<{ key: keyof FormData; label: string; placeholder: string; url?: boolean }> = [
  { key: 'websiteUrl', label: 'Website (optional)', placeholder: 'https://yourbusiness.com', url: true },
  { key: 'instagramHandle', label: 'Instagram (optional)', placeholder: '@handle' },
  { key: 'tiktokHandle', label: 'TikTok (optional)', placeholder: '@handle' },
  { key: 'twitterHandle', label: 'Twitter / X (optional)', placeholder: '@handle' },
  { key: 'facebookPage', label: 'Facebook page (optional)', placeholder: 'https://facebook.com/yourpage', url: true },
  { key: 'linkedinProfile', label: 'LinkedIn (optional)', placeholder: 'https://linkedin.com/in/you', url: true },
];

export function ContactLocationForm() {
  const router = useRouter();
  const [institutionSearchOpen, setInstitutionSearchOpen] = useState(false);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [query, setQuery] = useState('');
  const [initialData, setInitialData] = useState<Partial<FormData>>({});
  const [socialsOpen, setSocialsOpen] = useState(false);
  const { status, error, save } = useStepSave();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  });

  useEffect(() => {
    Promise.all([
      api<{ user: { whatsappNumber?: string; publicPhone?: string } }>('/api/users/me'),
      api<{ institutions: Institution[] }>('/api/institutions'),
      getMyVendor().catch(() => null),
    ]).then(([userData, instData, vendorResult]) => {
      const vendor = vendorResult && 'vendor' in vendorResult ? vendorResult.vendor : null;
      const values: Partial<FormData> = {
        whatsappNumber: userData.user.whatsappNumber ?? vendor?.whatsappNumber ?? '',
        publicPhone: userData.user.publicPhone ?? vendor?.publicPhone ?? '',
        institutionId: vendor?.institution?.id ?? '',
        campusId: vendor?.campus?.id ?? '',
        websiteUrl: vendor?.websiteUrl ?? '',
        instagramHandle: vendor?.instagramHandle ?? '',
        tiktokHandle: vendor?.tiktokHandle ?? '',
        twitterHandle: vendor?.twitterHandle ?? '',
        facebookPage: vendor?.facebookPage ?? '',
        linkedinProfile: vendor?.linkedinProfile ?? '',
      };
      setInitialData(values);
      (Object.keys(values) as Array<keyof FormData>).forEach((key) => {
        setValue(key, values[key] ?? '', { shouldValidate: false });
      });
      setInstitutions(instData.institutions);

      // Fix 3: auto-select primary campus if institution set but no campus chosen.
      if (values.institutionId && !values.campusId) {
        const pre = instData.institutions.find((i) => i.id === values.institutionId);
        const primary = pre?.campuses.find((c) => c.isPrimary) ?? pre?.campuses[0];
        if (primary) setValue('campusId', primary.id, { shouldValidate: true });
      }
    });
  }, []);

  const filteredInstitutions = query
    ? institutions.filter((i) => i.name.toLowerCase().includes(query.toLowerCase())).slice(0, 20)
    : institutions.slice(0, 20);

  const handleSelectInstitution = (inst: Institution | null) => {
    if (inst) {
      setValue('institutionId', inst.id, { shouldValidate: true });
      const primary = inst.campuses.find((c) => c.isPrimary) ?? inst.campuses[0];
      if (primary) setValue('campusId', primary.id, { shouldValidate: true });
    }
    setInstitutionSearchOpen(false);
    setQuery('');
  };

  const currentInstitution = institutions.find((i) => i.id === watch('institutionId'));

  const onSubmit = (data: FormData) =>
    save(async () => {
      if (currentInstitution && currentInstitution.campuses.length > 0 && !data.campusId) {
        throw new Error('Please select a campus.');
      }
      await upsertVendor({
        whatsappNumber: data.whatsappNumber,
        publicPhone: data.publicPhone || undefined,
        institutionId: data.institutionId,
        campusId: data.campusId || undefined,
        websiteUrl: data.websiteUrl || undefined,
        instagramHandle: data.instagramHandle || undefined,
        tiktokHandle: data.tiktokHandle || undefined,
        twitterHandle: data.twitterHandle || undefined,
        facebookPage: data.facebookPage || undefined,
        linkedinProfile: data.linkedinProfile || undefined,
      });
      router.push('/vendor/onboarding/step-3');
    });

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <fieldset className="space-y-4 rounded-2xl border border-cream-200 p-4 dark:border-forest-700 dark:border-cream-100/30">
      <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-forest-700/70 dark:text-cream-100/70">{title}</legend>
      {children}
    </fieldset>
  );

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Section title="Reachability">
          <Input
            label="WhatsApp number"
            type="tel"
            inputMode="tel"
            placeholder="+234****5678"
            helperText="Students will contact you here. Use country code."
            error={errors.whatsappNumber?.message}
            {...register('whatsappNumber')}
          />
          <Input
            label="Public phone (optional)"
            type="tel"
            inputMode="tel"
            placeholder="+234****5678"
            error={errors.publicPhone?.message}
            {...register('publicPhone')}
          />
        </Section>

        <Section title="Location">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-forest-700 dark:text-cream-100">Institution</label>
            <button
              type="button"
              onClick={() => setInstitutionSearchOpen(true)}
              className="w-full rounded-lg border border-cream-300 bg-cream-50 px-4 py-3 text-left text-base text-forest-900 focus:outline-none focus:ring-2 focus:ring-gold-500 dark:border-forest-700 dark:bg-forest-800 dark:text-cream-100 dark:border-cream-100"
            >
              {currentInstitution ? currentInstitution.name : 'Select your institution'}
            </button>
            {errors.institutionId && <p className="text-sm text-red-600">Required</p>}
          </div>

          {currentInstitution && currentInstitution.campuses.length > 0 && (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-forest-700 dark:text-cream-100">Campus</label>
              <div className="space-y-2">
                {currentInstitution.campuses.map((campus) => (
                  <button
                    key={campus.id}
                    type="button"
                    onClick={() => setValue('campusId', campus.id, { shouldValidate: true })}
                    className={`flex w-full items-center justify-between rounded-lg border-2 px-4 py-3 text-left text-sm transition ${
                      watch('campusId') === campus.id
                        ? 'border-forest-700 bg-cream-100 dark:border-gold-500 dark:bg-forest-900'
                        : 'border-cream-200 hover:border-forest-700/30 dark:border-forest-700 dark:border-cream-100/30'
                    }`}
                  >
                    <span>
                      {campus.name}
                      {campus.isPrimary && <span className="ml-2 text-xs text-gold-600">Main</span>}
                    </span>
                    {watch('campusId') === campus.id && <CheckIcon className="h-4 w-4 text-gold-600" />}
                  </button>
                ))}
              </div>
              {errors.campusId && <p className="text-sm text-red-600">Required</p>}
            </div>
          )}
        </Section>

        <div>
          <button
            type="button"
            onClick={() => setSocialsOpen((o) => !o)}
            className="text-sm font-medium text-forest-700 underline underline-offset-2 transition hover:text-gold-600 dark:text-cream-100 dark:hover:text-gold-400"
          >
            {socialsOpen ? 'Hide social links' : '+ Add social links (optional)'}
          </button>
          {socialsOpen && (
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {SOCIAL_FIELDS.map((f) => (
                <Input
                  key={f.key}
                  label={f.label}
                  placeholder={f.placeholder}
                  error={errors[f.key]?.message}
                  {...register(f.key)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="ghost" onClick={() => router.push('/vendor/onboarding/step-1')}>
            Back
          </Button>
          <Button type="submit" isLoading={status === 'saving'}>Continue</Button>
        </div>
        <AuthError>{error}</AuthError>
      </form>

      <Modal isOpen={institutionSearchOpen} onClose={() => setInstitutionSearchOpen(false)} title="Select institution">
        <div className="space-y-4 p-6">
          <input
            type="search"
            placeholder="Search institutions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-cream-300 bg-cream-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-500 dark:border-forest-700 dark:bg-forest-800 dark:border-cream-100"
            autoFocus
          />
          <div className="max-h-64 overflow-y-auto rounded-lg border border-cream-200 dark:border-forest-700 dark:border-cream-100">
            {filteredInstitutions.length > 0 ? (
              filteredInstitutions.map((inst) => (
                <button
                  key={inst.id}
                  type="button"
                  onClick={() => handleSelectInstitution(inst)}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-cream-100 dark:hover:bg-forest-700 dark:bg-forest-900"
                >
                  {inst.name}
                </button>
              ))
            ) : (
              <p className="px-4 py-6 text-center text-sm text-forest-700/60 dark:text-cream-100/60">
                No institutions match &ldquo;{query}&rdquo;.
              </p>
            )}
          </div>
          <p className="text-center text-xs text-forest-700/60 dark:text-cream-100/60">
            Can&apos;t find your institution?{' '}
            <a
              href="mailto:support@voeq.ng?subject=Institution%20request&body=I%20would%20like%20to%20add%20my%20institution%20to%20Voeq.%20Name%3A%20"
              className="font-semibold text-forest-900 underline underline-offset-2 dark:text-cream-100"
            >
              Request to add it
            </a>
          </p>
        </div>
      </Modal>

      <DraftBanner<FormData> step="step-2" watch={watch} enabled={status !== 'saving'} />
    </>
  );
}
