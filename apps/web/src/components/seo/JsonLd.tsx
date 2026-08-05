import { type ReactNode } from 'react';

interface JsonLdProps {
  data: object;
  children?: ReactNode;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
