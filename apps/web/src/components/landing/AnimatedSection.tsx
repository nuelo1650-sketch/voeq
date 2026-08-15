'use client';

import { motion } from 'framer-motion';

export function AnimatedSection({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  // Animate on mount (not whileInView): short above-the-fold pages like
  // onboarding steps never trigger an intersection change, leaving content
  // stuck at opacity:0. Mount animation is reliable and visually identical.
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
