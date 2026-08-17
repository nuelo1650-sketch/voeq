import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Consistent inline error treatment for auth forms. Sits field-adjacent or
 * form-level (never a toast). Uses the same red/cream tokens as StepError so
 * auth + onboarding read as one system.
 */
export function AuthError({ children, className }: { children: ReactNode; className?: string }) {
  if (!children) return null;
  return (
    <p
      role="alert"
      className={cn(
        'text-sm text-red-600 dark:text-red-300',
        className,
      )}
    >
      {children}
    </p>
  );
}
