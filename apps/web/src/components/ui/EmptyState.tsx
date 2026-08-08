import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

interface EmptyStateProps {
  illustration?: ReactNode;
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ illustration, icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-6 py-16 text-center', className)}>
      {(illustration || icon) && <div className="mb-6">{illustration ?? icon}</div>}
      <h3 className="font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-sm text-forest-700/70 dark:text-cream-100/70">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} className="mt-6">
          {action.label}
        </Button>
      )}
    </div>
  );
}
