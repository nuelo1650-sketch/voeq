import { cn } from '@/lib/utils';

interface TrustScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const SIZE_MAP = {
  sm: { ring: 'h-8 w-8', text: 'text-xs' },
  md: { ring: 'h-12 w-12', text: 'text-sm' },
  lg: { ring: 'h-16 w-16', text: 'text-lg' },
};

const COLOR_MAP = {
  red: { ring: 'stroke-red-500', text: 'text-red-700 dark:text-red-400', label: 'Low trust' },
  amber: { ring: 'stroke-amber-500', text: 'text-amber-700 dark:text-amber-400', label: 'Building trust' },
  green: { ring: 'stroke-green-600', text: 'text-green-700 dark:text-green-400', label: 'Trusted' },
};

export function TrustScore({ score, size = 'md', showLabel = true, className }: TrustScoreProps) {
  const color = score < 50 ? 'red' : score < 70 ? 'amber' : 'green';
  const colors = COLOR_MAP[color];
  const sizes = SIZE_MAP[size];
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={cn('inline-flex flex-col items-center', className)}>
      <div className="relative">
        <svg className={sizes.ring} viewBox="0 0 40 40">
          <circle cx="20" cy="20" r={radius} fill="none" strokeWidth="3" className="stroke-cream-200 dark:stroke-forest-700" />
          <circle
            cx="20"
            cy="20"
            r={radius}
            fill="none"
            strokeWidth="3"
            className={colors.ring}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 20 20)"
          />
        </svg>
        <div className={cn('absolute inset-0 flex items-center justify-center font-semibold', sizes.text, colors.text)}>
          {score}
        </div>
      </div>
      {showLabel && <p className={cn('mt-1 text-xs', colors.text)}>{colors.label}</p>}
    </div>
  );
}
