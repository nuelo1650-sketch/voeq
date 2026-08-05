'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { upsertVendor } from '@/lib/vendor-client';
import { DraftBanner } from './DraftBanner';
import { Modal } from '@/components/ui/Modal';
import { CheckIcon } from '@/components/icons';

const schema = z.object({
  whatsappNumber: z.string().regex(/^\+?[1-9]\d{6,14}$/, 'Use E.164 format (e.g. +2348012345678)'),
  publicPhone: z.string().regex(/^\+?[1-9]\d{6,14}$/).optional().or(z.literal('')),
  institutionId: z.string().min(1, 'Required'),
  campusId: z.string().min(1, 'Required'),
});

type FormData = z.infer<typeof schema>;

interface Institution {
  id: string;
  name: string;
  campuses: Array<{ id: string; name: string; isPrimary: boolean }>;
}

export function ContactLocationForm() {
  const router = useRouter();
  const [institutionSearchOpen, setInstitutionSearchOpen] = useState(false);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [query, setQuery] = useState('');
  const [initialData, setInitialData] = useState<Partial<FormData>>({});

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  });

  useEffect(() => {
    Promise.all([
      api<{ user: { whatsappNumber?: string; publicPhone?: string } }>('/api/users/me'),
      api<{ institutions: Institution[] }>('/api/institutions'),
    ]).then(([userData, instData]) => {
      setInitialData({
        whatsappNumber: userData.user.whatsappNumber ?? '',
        publicPhone: userData.user.publicPhone ?? '',
      });
      setInstitutions(instData.institutions);
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

  const onSubmit = async (data: FormData) => {
    await upsertVendor({
      whatsappNumber: data.whatsappNumber,
      publicPhone: data.publicPhone || undefined,
      institutionId: data.institutionId,
      campusId: data.campusId,
    });
    router.push('/vendor/onboarding/step-3');
  };

  const currentInstitution = institutions.find((i) => i.id === watch('institutionId'));

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="WhatsApp number"
          type="tel"
          inputMode="tel"
          placeholder="+2348012345678"
          helperText="Students will contact you here. Use country code."
          error={errors.whatsappNumber?.message}
          {...register('whatsappNumber')}
        />
        <Input
          label="Public phone (optional)"
          type="tel"
          inputMode="tel"
          placeholder="+2348012345678"
          error={errors.publicPhone?.message}
          {...register('publicPhone')}
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-forest-700 dark:text-cream-100">Institution</label>
          <button
            type="button"
            onClick={() => setInstitutionSearchOpen(true)}
            className="w-full rounded-lg border border-cream-300 bg-cream-50 px-4 py-3 text-left text-base text-forest-900 focus:outline-none focus:ring-2 focus:ring-gold-500 dark:border-forest-700 dark:bg-forest-800 dark:text-cream-100"
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
                      : 'border-cream-200 hover:border-forest-700/30 dark:border-forest-700'
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

        <div className="flex justify-between">
          <Button type="button" variant="ghost" onClick={() => router.push('/vendor/onboarding/step-1')}>
            Back
          </Button>
          <Button type="submit" isLoading={isSubmitting}>Continue</Button>
        </div>
      </form>

      <Modal isOpen={institutionSearchOpen} onClose={() => setInstitutionSearchOpen(false)} title="Select institution">
        <div className="p-6 space-y-4">
          <input
            type="search"
            placeholder="Search institutions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-cream-300 bg-cream-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold-500 dark:border-forest-700 dark:bg-forest-800"
            autoFocus
          />
          <div className="max-h-64 overflow-y-auto rounded-lg border border-cream-200 dark:border-forest-700">
            {filteredInstitutions.map((inst) => (
              <button
                key={inst.id}
                type="button"
                onClick={() => handleSelectInstitution(inst)}
                className="w-full px-4 py-3 text-left text-sm hover:bg-cream-100 dark:hover:bg-forest-700"
              >
                {inst.name}
              </button>
            ))}
          </div>
        </div>
      </Modal>

      <DraftBanner<FormData> step="step-2" watch={watch} enabled={!isSubmitting} />
    </>
  );
}
