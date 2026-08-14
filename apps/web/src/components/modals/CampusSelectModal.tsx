'use client';

import { useState, useEffect, useMemo } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { setDefaultCampus } from '@/lib/auth-client';
import { api } from '@/lib/api';

interface Institution {
  id: string;
  name: string;
  type: string;
  campuses: Array<{ id: string; name: string; isPrimary: boolean }>;
}

interface CampusSelectModalProps {
  isOpen: boolean;
  onSelected: () => void;
}

export function CampusSelectModal({ isOpen, onSelected }: CampusSelectModalProps) {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [query, setQuery] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [selectedCampusId, setSelectedCampusId] = useState<string | null>(null);
  const [otherName, setOtherName] = useState('');
  const [showOther, setShowOther] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setQuery('');
    setSelectedInstitution(null);
    setSelectedCampusId(null);
    setOtherName('');
    setShowOther(false);
    setError(null);
    api<{ institutions: Institution[] }>('/api/institutions')
      .then((data) => setInstitutions(data.institutions))
      .catch(() => setError('Failed to load institutions'));
  }, [isOpen]);

  const filtered = useMemo(() => {
    if (!query) return institutions.slice(0, 20);
    const q = query.toLowerCase();
    return institutions
      .filter((i) => i.name.toLowerCase().includes(q) || i.type.toLowerCase().includes(q))
      .slice(0, 20);
  }, [query, institutions]);

  const handleSelectInstitution = (inst: Institution) => {
    setSelectedInstitution(inst);
    setShowOther(false);
    const primary = inst.campuses.find((c) => c.isPrimary) ?? inst.campuses[0];
    setSelectedCampusId(primary?.id ?? null);
  };

  const handleSelectOther = () => {
    setSelectedInstitution(null);
    setShowOther(true);
    setSelectedCampusId(null);
  };

  const handleSubmitOther = async () => {
    if (otherName.trim().length < 2) {
      setError('Please enter your institution name');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await api('/api/institutions/request', {
        method: 'POST',
        body: JSON.stringify({ name: otherName.trim(), email: undefined }),
      });
      onSelected();
    } catch {
      // Still let the user continue even if the request fails to save —
      // the important thing is they can proceed without a campus.
      onSelected();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCampusId) {
      setError('Please select a campus');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    // Retry on transient failures (e.g. cold-start 503s) instead of leaving the
    // user stuck in an infinite "select campus" loop.
    let lastErr: unknown = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await setDefaultCampus(selectedCampusId);
        onSelected();
        return;
      } catch (err) {
        lastErr = err;
        await new Promise((r) => setTimeout(r, 400 * attempt));
      }
    }
    setError('Failed to save your campus. Please try again.');
    setIsSubmitting(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => undefined} hideCloseButton closeOnBackdrop={false} closeOnEscape={false}>
      <div className="p-6">
        <h2 className="font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">
          Where are you on campus?
        </h2>
        <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">
          We&apos;ll show you vendors and listings from your campus. You can change this anytime.
        </p>

        {!selectedInstitution && !showOther && (
          <div className="mt-4 space-y-3">
            <Input
              type="text"
              placeholder="Search your institution..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="max-h-64 overflow-y-auto rounded-lg border border-cream-200 dark:border-forest-700">
              {filtered.map((inst) => (
                <button
                  key={inst.id}
                  type="button"
                  onClick={() => handleSelectInstitution(inst)}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-cream-100 dark:hover:bg-forest-700"
                >
                  {inst.name}
                </button>
              ))}
              <button
                type="button"
                onClick={handleSelectOther}
                className="w-full border-t border-cream-200 px-4 py-3 text-left text-sm font-medium text-forest-700 hover:bg-cream-100 dark:border-forest-700 dark:text-gold-500 dark:hover:bg-forest-700"
              >
                My institution isn&apos;t listed
              </button>
            </div>
          </div>
        )}

        {selectedInstitution && (
          <div className="mt-4 space-y-3">
            <div className="rounded-lg bg-cream-100 p-3 dark:bg-forest-900">
              <p className="text-sm font-medium text-forest-900 dark:text-cream-100">
                {selectedInstitution.name}
              </p>
            </div>
            <div className="space-y-2">
              {selectedInstitution.campuses.map((campus) => (
                <button
                  key={campus.id}
                  type="button"
                  onClick={() => setSelectedCampusId(campus.id)}
                  className={`w-full rounded-lg border-2 px-4 py-3 text-left text-sm transition ${
                    selectedCampusId === campus.id
                      ? 'border-forest-700 bg-cream-100 dark:border-gold-500 dark:bg-forest-900'
                      : 'border-cream-200 hover:border-forest-700/30 dark:border-forest-700'
                  }`}
                >
                  {campus.name}
                  {campus.isPrimary && (
                    <span className="ml-2 text-xs text-gold-600">Main campus</span>
                  )}
                </button>
              ))}
            </div>
            <Button variant="ghost" onClick={() => setSelectedInstitution(null)}>
              Back
            </Button>
          </div>
        )}

        {showOther && (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-forest-700/70 dark:text-cream-100/70">
              Tell us your institution and we&apos;ll add it.
            </p>
            <Input
              type="text"
              placeholder="Institution name"
              value={otherName}
              onChange={(e) => setOtherName(e.target.value)}
            />
            <p className="text-xs text-forest-700/60">
              We&apos;ll review and add it within 24 hours. For now, you can continue without selecting.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowOther(false)}>
                Back
              </Button>
              <Button onClick={handleSubmitOther} isLoading={isSubmitting} disabled={otherName.trim().length < 2}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        {selectedInstitution && (
          <div className="mt-6 flex justify-end">
            <Button onClick={handleSubmit} isLoading={isSubmitting} disabled={!selectedCampusId}>
              Continue
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
