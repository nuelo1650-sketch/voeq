'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { CampusSelectModal } from '@/components/modals/CampusSelectModal';
import { CategoryPill } from '@/components/marketplace/CategoryPill';
import { Button } from '@/components/ui/Button';
import { ArrowRightIcon, CheckIcon, HeartIcon, SearchIcon, ChatIcon, StarIcon } from '@/components/icons';
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
        body: JSON.stringify({ homeSeenAt: new Date().toISOString() }),
      });
      router.push('/buyer-dashboard');
      router.refresh();
    } catch {
      setFinishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-900 to-forest-800 text-cream-100">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-10">
        {/* Progress */}
        <div className="mb-10 flex items-center gap-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-1 flex-col gap-2">
              <div
                className={`h-1.5 rounded-full transition ${
                  i <= step ? 'bg-gold-500' : 'bg-cream-100/20'
                }`}
              />
              <span className="text-[10px] uppercase tracking-wide text-cream-100/50">{label}</span>
            </div>
          ))}
        </div>

        {step === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="relative mb-6 h-16 w-16">
              <Image src="/Name.png" alt="Voeq" width={64} height={64} className="object-contain" />
            </div>
            <h1 className="font-serif text-4xl font-semibold">
              Welcome{firstName ? `, ${firstName}` : ''} 👋
            </h1>
            <p className="mt-3 max-w-md text-cream-100/70">
              You&apos;re in. Let&apos;s get your Voeq set up in a few quick steps so you can find
              verified campus vendors near you.
            </p>
            <Button variant="gold" size="lg" className="mt-8" onClick={() => setStep(1)}>
              Let&apos;s go <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-1 flex-col">
            <h2 className="font-serif text-3xl font-semibold">First, your campus</h2>
            <p className="mt-2 text-cream-100/70">
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
          <div className="flex flex-1 flex-col">
            <h2 className="font-serif text-3xl font-semibold">What are you into?</h2>
            <p className="mt-2 text-cream-100/70">
              Pick a few so we can tailor your feed. You can skip this.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <CategoryPill slug="" name="All" iconName="OtherIcon" active={false} href={undefined} onClick={() => {}} />
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
          <div className="flex flex-1 flex-col">
            <h2 className="font-serif text-3xl font-semibold">Here&apos;s your toolkit</h2>
            <p className="mt-2 text-cream-100/70">A quick tour of what you can do on Voeq.</p>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <TourCard icon={<SearchIcon className="h-5 w-5" />} title="Browse" desc="Discover vendors by category on your campus." href="/browse" />
              <TourCard icon={<HeartIcon className="h-5 w-5" />} title="Wishlist" desc="Save vendors you love for later." href="/wishlist" />
              <TourCard icon={<CheckIcon className="h-5 w-5" />} title="Following" desc="Follow vendors for new listings." href="/following" />
              <TourCard icon={<ChatIcon className="h-5 w-5" />} title="Messages" desc="Chat with vendors (coming soon)." href="/messages" muted />
              <TourCard icon={<StarIcon className="h-5 w-5" />} title="Profile" desc="Manage your account & campus." href="/profile" />
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
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-500/20">
              <CheckIcon className="h-8 w-8 text-gold-500" />
            </div>
            <h2 className="mt-6 font-serif text-3xl font-semibold">You&apos;re all set 🎉</h2>
            <p className="mt-2 text-cream-100/70">Welcome to Voeq. Let&apos;s find you something good.</p>
            <Button variant="gold" size="lg" className="mt-8" isLoading={finishing} onClick={finish}>
              Enter Voeq
            </Button>
          </div>
        )}
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
    <a
      href={href}
      className={`flex items-start gap-3 rounded-2xl border border-cream-100/15 bg-cream-100/5 p-4 transition hover:border-gold-500/40 ${
        muted ? 'opacity-60' : ''
      }`}
    >
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-gold-500">
        {icon}
      </span>
      <span>
        <span className="block font-medium">{title}</span>
        <span className="block text-sm text-cream-100/60">{desc}</span>
      </span>
    </a>
  );
}
