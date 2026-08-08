'use client';

import { useState, useCallback, type ReactNode } from 'react';
import { createContext, useContext } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, XIcon, AlertIcon, InfoIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration = 3000) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, message, duration }]);
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={cn(
                'flex min-w-[280px] max-w-md items-center gap-3 rounded-lg border p-3 shadow-lg',
                toast.type === 'success' && 'border-green-200 bg-green-50 text-green-900 dark:border-green-900 dark:bg-green-950/30 dark:text-green-100',
                toast.type === 'error' && 'border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950/30 dark:text-red-100',
                toast.type === 'info' && 'border-forest-200 bg-cream-50 text-forest-900 dark:border-forest-700 dark:bg-forest-800 dark:text-cream-100',
              )}
            >
              {toast.type === 'success' && <CheckIcon className="h-5 w-5 flex-shrink-0" />}
              {toast.type === 'error' && <AlertIcon className="h-5 w-5 flex-shrink-0" />}
              {toast.type === 'info' && <InfoIcon className="h-5 w-5 flex-shrink-0" />}
              <p className="flex-1 text-sm">{toast.message}</p>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="flex-shrink-0 opacity-60 hover:opacity-100"
                aria-label="Dismiss"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
