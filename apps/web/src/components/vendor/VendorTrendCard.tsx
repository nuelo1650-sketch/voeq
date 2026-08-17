'use client';

import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ThreadCard } from '@/components/brand/Thread';

interface DailyPoint {
  date: string;
  views: number;
  clicks: number;
  conversations: number;
}

interface TrendCardProps {
  daily: DailyPoint[];
  stats: {
    totalViews: number;
    totalClicks: number;
    conversationsStarted: number;
    totalReviews: number;
  };
}

const SERIES = [
  { key: 'views', color: '#0F3D2E', label: 'Views' },
  { key: 'clicks', color: '#B08D57', label: 'WhatsApp' },
  { key: 'conversations', color: '#3B82F6', label: 'Chats' },
] as const;

export function VendorTrendCard({ daily, stats }: TrendCardProps) {
  const [window, setWindow] = useState<7 | 30>(7);
  const data = useMemo(() => (window === 7 ? daily.slice(-7) : daily), [daily, window]);

  return (
    <ThreadCard className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">Performance trend</h2>
        <div className="inline-flex rounded-full border border-cream-300 p-0.5 dark:border-forest-700 dark:border-cream-100">
          {([7, 30] as const).map((w) => (
            <button
              key={w}
              onClick={() => setWindow(w)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                window === w
                  ? 'bg-forest-700 text-cream-100'
                  : 'text-forest-700 dark:text-cream-100'
              }`}
            >
              {w}d
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
            <defs>
              {SERIES.map((s) => (
                <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={s.color} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>
            <XAxis dataKey="date" hide />
            <YAxis allowDecimals={false} width={32} tick={{ fontSize: 10 }} />
            <Tooltip
              labelFormatter={(l) => String(l).slice(5)}
              formatter={(v: number, name: string) => [v, SERIES.find((s) => s.key === name)?.label ?? name]}
            />
            {SERIES.map((s) => (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                stroke={s.color}
                strokeWidth={2}
                fill={`url(#grad-${s.key})`}
                isAnimationActive={false}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Total label="Views" value={stats.totalViews} />
        <Total label="WhatsApp" value={stats.totalClicks} />
        <Total label="Chats" value={stats.conversationsStarted} />
        <Total label="Reviews" value={stats.totalReviews} />
      </div>
    </ThreadCard>
  );
}

function Total({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-cream-100/70 px-3 py-2 dark:bg-forest-900/50 dark:bg-forest-800">
      <p className="text-xs uppercase tracking-wide text-forest-700/60 dark:text-cream-100/60">{label}</p>
      <p className="mt-0.5 font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">{value}</p>
    </div>
  );
}
