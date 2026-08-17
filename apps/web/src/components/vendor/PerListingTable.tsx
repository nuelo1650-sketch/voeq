'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpDown } from 'lucide-react';
import { ThreadCard } from '@/components/brand/Thread';

interface ListingRow {
  id: string;
  title: string;
  slug: string;
  viewCount: number;
  whatsappClickCount: number;
  photos: Array<{ url: string }>;
}

type SortKey = 'views' | 'clicks' | 'ctr';

export function PerListingTable({ listings }: { listings: ListingRow[] }) {
  const [sort, setSort] = useState<SortKey>('views');
  const [asc, setAsc] = useState(false);

  const rows = useMemo(() => {
    const withCtr = listings.map((l) => ({
      ...l,
      ctr: l.viewCount > 0 ? Number(((l.whatsappClickCount / l.viewCount) * 100).toFixed(1)) : 0,
    }));
    const sorted = [...withCtr].sort((a, b) => {
      const av = sort === 'views' ? a.viewCount : sort === 'clicks' ? a.whatsappClickCount : a.ctr;
      const bv = sort === 'views' ? b.viewCount : sort === 'clicks' ? b.whatsappClickCount : b.ctr;
      return asc ? av - bv : bv - av;
    });
    return sorted;
  }, [listings, sort, asc]);

  const toggle = (k: SortKey) => {
    if (sort === k) setAsc((a) => !a);
    else {
      setSort(k);
      setAsc(false);
    }
  };

  if (listings.length === 0) {
    return (
      <ThreadCard className="p-5">
        <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">Per-listing performance</h2>
        <p className="mt-4 text-sm text-forest-700/70 dark:text-cream-100/70">No listings yet. Publish one to see views and inquiries.</p>
      </ThreadCard>
    );
  }

  return (
    <ThreadCard className="p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">Per-listing performance</h2>
        <Link href="/vendor/listings" className="text-xs font-medium text-forest-700 hover:underline dark:text-cream-100">View all</Link>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-forest-700/60 dark:text-cream-100/60">
              <th className="pb-2 font-medium">Listing</th>
              <SortHeader label="Views" active={sort === 'views'} asc={asc} onClick={() => toggle('views')} />
              <SortHeader label="WhatsApp" active={sort === 'clicks'} asc={asc} onClick={() => toggle('clicks')} />
              <SortHeader label="CTR" active={sort === 'ctr'} asc={asc} onClick={() => toggle('ctr')} />
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-200 dark:divide-forest-700">
            {rows.map((l) => (
              <tr key={l.id} className="hover:bg-cream-100/40 dark:hover:bg-forest-700/30">
                <td className="py-2.5 pr-3">
                  <Link href={`/vendor/listings/${l.id}/edit`} className="flex items-center gap-2 font-medium text-forest-900 dark:text-cream-100">
                    {l.photos[0]?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={l.photos[0].url} alt="" className="h-8 w-8 rounded-md object-cover" />
                    ) : (
                      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-cream-100 text-xs dark:bg-forest-900/60">·</span>
                    )}
                    <span className="truncate">{l.title}</span>
                  </Link>
                </td>
                <td className="py-2.5 pr-3 tabular-nums">{l.viewCount}</td>
                <td className="py-2.5 pr-3 tabular-nums">{l.whatsappClickCount}</td>
                <td className="py-2.5 tabular-nums">{l.ctr}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ThreadCard>
  );
}

function SortHeader({ label, active, asc, onClick }: { label: string; active: boolean; asc: boolean; onClick: () => void }) {
  return (
    <th className="pb-2 font-medium">
      <button onClick={onClick} className={`inline-flex items-center gap-1 ${active ? 'text-forest-900 dark:text-cream-100' : ''}`}>
        {label}
        <ArrowUpDown className="h-3 w-3" />
        {active ? <span className="text-[10px]">{asc ? '↑' : '↓'}</span> : null}
      </button>
    </th>
  );
}
