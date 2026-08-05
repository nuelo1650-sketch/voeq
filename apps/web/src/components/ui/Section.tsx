import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  children: ReactNode;
  className?: string;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  as?: 'section' | 'div' | 'article' | 'aside';
  id?: string;
}

const spacingMap = {
  sm: 'py-12 sm:py-16',
  md: 'py-16 sm:py-20',
  lg: 'py-20 sm:py-28',
  xl: 'py-24 sm:py-32',
};

export function Section({ children, className, spacing = 'md', as: Tag = 'section', id }: SectionProps) {
  return <Tag id={id} className={cn(spacingMap[spacing], className)}>{children}</Tag>;
}
