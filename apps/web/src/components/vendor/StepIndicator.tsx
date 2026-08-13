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
                'relative z-10 flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300',
                step.completed && 'bg-forest-700 text-cream-100',
                step.current &&
                  !step.completed &&
                  'bg-gold-500 text-forest-900 ring-4 ring-gold-500/25 shadow-[0_0_0_6px_rgba(201,162,75,0.08)]',
                !step.current &&
                  !step.completed &&
                  'bg-cream-100 text-forest-700/40 ring-1 ring-cream-300 dark:bg-forest-800 dark:text-cream-100/40 dark:ring-forest-700',
              )}
            >
              {step.completed ? <CheckIcon className="h-5 w-5" /> : step.number}
            </div>
            <span
              className={cn(
                'mt-2 text-xs font-medium text-center max-w-[80px]',
                step.current || step.completed
                  ? 'text-forest-900 dark:text-cream-100'
                  : 'text-forest-700/40 dark:text-cream-100/40',
              )}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className="relative mx-2 h-0.5 flex-1 self-start mt-5 overflow-hidden rounded-full bg-cream-200 dark:bg-forest-700">
              <div
                className={cn(
                  'absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-forest-700 to-gold-500 transition-all duration-500',
                  step.completed ? 'w-full' : 'w-0',
                )}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
