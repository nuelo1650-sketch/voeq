'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { CampusSelectModal } from '@/components/modals/CampusSelectModal';
import { CategoryPill } from '@/components/marketplace/CategoryPill';
import { Button } from '@/components/ui/Button';
import { ArrowRightIcon, CheckIcon, HeartIcon, SearchIcon, ChatIcon, StarIcon, SparklesIcon } from '@/components/icons';
import Image from 'next/image';

interface WizardCategory {
  id: string;
  name: string;
  slug: string;
  iconName: string;
}

const STEPS = ['Welcome', 'Campus', 'Interests', 'Tour', 'Done'] as const;

export function HomeWizard({ firstName, categories }: { firstName: string; categories: WizardCategory[] }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [campusPicked, setCampusPicked] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);
  const [finishing, setFinishing] = useState(false);

  const topCategories = categories.slice(0, 12);

  const toggleInterest = (slug: string) =>
    setInterests((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));

  const finish = async () => {
    setFinishing(true);
    try {
      await api('/api/users/me', {
        method: 'PATCH',
        body: JSON.stringify({ homeSeenAt: new Date().toISOString(), interests }),
      });
      router.push('/buyer-dashboard');
      router.refresh();
    } catch {
      setFinishing(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-forest-900 via-forest-800 to-forest-950 px-4 py-10">
      <div className="grid w-full max-w-4xl gap-8 md:grid-cols-[200px_1fr]">
        {/* Side progress rail */}
        <aside className="hidden md:flex md:flex-col md:gap-1">
          {STEPS.map((label, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <div key={label} className="flex items-center gap-3">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition ${
                    done
                      ? 'border-gold-500 bg-gold-500 text-forest-900'
                      : active
                        ? 'border-gold-500 text-gold-500'
                        : 'border-cream-100/25 text-cream-100/40'
                  }`}
                >
                  {done ? <CheckIcon className="h-4 w-4" /> : i + 1}
                </span>
                <span
                  className={`text-sm font-medium transition ${
                    active ? 'text-cream-100' : done ? 'text-cream-100/70' : 'text-cream-100/40'
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </aside>

        {/* Card */}
        <div className="rounded-3xl border border-cream-100/10 bg-cream-50/95 p-6 shadow-2xl backdrop-blur dark:bg-forest-900/70 sm:p-10">
          {/* Mobile progress */}
          <div className="mb-6 flex items-center gap-1.5 md:hidden">
            {STEPS.map((label, i) => (
              <div
                key={label}
                className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-gold-500' : 'bg-forest-700'}`}
              />
            ))}
          </div>

          {step === 0 && (
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6 h-16 w-16">
                <Image src="/Name.png" alt="Voeq" width={64} height={64} className="object-contain" />
              </div>
              <h1 className="font-serif text-4xl font-semibold text-forest-900 dark:text-cream-100">
                Welcome{firstName ? `, ${firstName}` : ''} 👋
              </h1>
              <p className="mt-3 max-w-md text-forest-700/70 dark:text-cream-100/70">
                You&apos;re in. Let&apos;s get your Voeq set up in a few quick steps so you can find
                verified campus vendors near you.
              </p>
              <Button variant="gold" size="lg" className="mt-8" onClick={() => setStep(1)}>
                Let&apos;s go <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col">
              <h2 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100">First, your campus</h2>
              <p className="mt-2 text-forest-700/70 dark:text-cream-100/70">
                We&apos;ll show you vendors and listings from your school. You can change this anytime.
              </p>
              <div className="mt-8 flex flex-1 items-center justify-center">
                <CampusSelectModal
                  isOpen
                  onSelected={() => {
                    setCampusPicked(true);
                    setStep(2);
                  }}
                />
              </div>
              {campusPicked && (
                <div className="mt-4 flex justify-end">
                  <Button variant="gold" onClick={() => setStep(2)}>
                    Continue <ArrowRightIcon className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col">
              <h2 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100">What are you into?</h2>
              <p className="mt-2 text-forest-700/70 dark:text-cream-100/70">
                Pick a few so we can tailor your feed. You can skip this.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <CategoryPill
                  slug=""
                  name="All"
                  iconName="Grid3x3"
                  active={interests.length === topCategories.length && topCategories.length > 0}
                  href={undefined}
                  onClick={() => {
                    if (interests.length === topCategories.length) {
                      setInterests([]);
                    } else {
                      setInterests(topCategories.map((c) => c.slug));
                    }
                  }}
                />
                {topCategories.map((cat) => (
                  <CategoryPill
                    key={cat.id}
                    slug={cat.slug}
                    name={cat.name}
                    iconName={cat.iconName}
                    active={interests.includes(cat.slug)}
                    href={undefined}
                    onClick={() => toggleInterest(cat.slug)}
                  />
                ))}
              </div>
              <div className="mt-auto flex justify-between pt-8">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button variant="gold" onClick={() => setStep(3)}>
                  Continue <ArrowRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col">
              <h2 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100">Here&apos;s your toolkit</h2>
              <p className="mt-2 text-forest-700/70 dark:text-cream-100/70">A quick tour of what you can do on Voeq.</p>
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <TourCard icon={<SearchIcon className="h-5 w-5" />} title="Browse" desc="Discover vendors by category on your campus." href="/browse" />
                <TourCard icon={<HeartIcon className="h-5 w-5" />} title="Wishlist" desc="Save vendors you love for later." href="/wishlist" />
                <TourCard icon={<CheckIcon className="h-5 w-5" />} title="Following" desc="Follow vendors for new listings." href="/following" />
                <TourCard icon={<ChatIcon className="h-5 w-5" />} title="Messages" desc="Chat with vendors (coming soon)." href="/messages" muted />
                <TourCard icon={<StarIcon className="h-5 w-5" />} title="Profile" desc="Manage your account & campus." href="/profile" />
                <TourCard icon={<SparklesIcon className="h-5 w-5" />} title="Discover" desc="Personalised picks from your interests." href="/home" />
              </div>
              <div className="mt-auto flex justify-between pt-8">
                <Button variant="ghost" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button variant="gold" onClick={() => setStep(4)}>
                  Finish <CheckIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-500/20">
                <CheckIcon className="h-8 w-8 text-gold-500" />
              </div>
              <h2 className="mt-6 font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100">You&apos;re all set 🎉</h2>
              <p className="mt-2 text-forest-700/70 dark:text-cream-100/70">Welcome to Voeq. Let&apos;s find you something good.</p>
              <Button variant="gold" size="lg" className="mt-8" isLoading={finishing} onClick={finish}>
                Enter Voeq
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TourCard({
  icon,
  title,
  desc,
  href,
  muted,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  href: string;
  muted?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-start gap-3 rounded-2xl border p-4 transition ${
        muted
          ? 'border-cream-300/60 opacity-60 dark:border-forest-700'
          : 'border-cream-300 hover:border-gold-500/50 hover:shadow-md dark:border-forest-700'
      }`}
    >
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-gold-600 dark:text-gold-400">
        {icon}
      </span>
      <span>
        <span className="block font-medium text-forest-900 dark:text-cream-100">{title}</span>
        <span className="block text-sm text-forest-700/60 dark:text-cream-100/60">{desc}</span>
      </span>
    </Link>
  );
}
