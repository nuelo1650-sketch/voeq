import { Fraunces } from 'next/font/google';

export const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  preload: true,
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  axes: ['SOFT', 'WONK', 'opsz'],
});

export const fontSansClassName = 'font-sans';
export const fontSerifClassName = 'font-serif';
export const fontMonoClassName = 'font-mono';

export const fontVariables = {
  sans: '--font-geist-sans',
  serif: '--font-fraunces',
  mono: '--font-geist-mono',
} as const;
