import { cn } from '@/lib/utils';
import { CheckIcon } from '@/components/icons';

interface Step {
  number: number;
  label: string;
  completed: boolean;
  current: boolean;
}

interface StepIndicatorProps {
  steps: Step[];
  className?: string;
}

export function StepIndicator({ steps, className }: StepIndicatorProps) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition',
                step.completed && 'bg-forest-700 text-cream-100',
                step.current && !step.completed && 'bg-gold-500 text-forest-900 ring-4 ring-gold-500/20',
                !step.current && !step.completed && 'bg-cream-200 text-forest-700/40 dark:bg-forest-700 dark:text-cream-100/40',
              )}
            >
              {step.completed ? <CheckIcon className="h-5 w-5" /> : step.number}
            </div>
            <span
              className={cn(
                'mt-2 text-xs font-medium text-center max-w-[80px]',
                (step.current || step.completed) ? 'text-forest-900 dark:text-cream-100' : 'text-forest-700/40 dark:text-cream-100/40',
              )}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                'h-0.5 flex-1 mx-2',
                step.completed ? 'bg-forest-700' : 'bg-cream-200 dark:bg-forest-700',
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
