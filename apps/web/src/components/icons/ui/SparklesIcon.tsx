import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IconProps } from '@/components/icons/icon-types';

export function SparklesIcon({ className, 'aria-label': ariaLabel }: IconProps) {
  return <Sparkles className={cn(className)} aria-label={ariaLabel} aria-hidden={!ariaLabel} strokeWidth={1.75} />;
}
