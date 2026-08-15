'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SearchIcon, CheckIcon, CloseIcon } from '@/components/icons';
import { setDefaultCampus } from '@/lib/auth-client';
import { api } from '@/lib/api';
import { useMemo } from 'react';

interface Institution {
  id: string;
  name: string;
  type: string;
  campuses: Array<{ id: string; name: string; isPrimary: boolean }>;
}

interface CampusSwitcherProps {
  currentCampusId: string;
  onClose: () => void;
  onSelect: () => void;
}

export function CampusSwitcher({ currentCampusId, onClose, onSelect }: CampusSwitcherProps) {
  const [query, setQuery] = useState('');
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<{ institutions: Institution[] }>('/api/institutions')
      .then((data) => {
        setInstitutions(data.institutions);
        const current = data.institutions.find((i) => i.campuses.some((c) => c.id === currentCampusId));
        if (current) setSelectedInstitution(current);
      })
      .catch(() => setError('Failed to load institutions'));
  }, [currentCampusId]);

  const filtered = useMemo?.(() => {
    if (!query) return institutions.slice(0, 20);
    const q = query.toLowerCase();
    return institutions.filter((i) => i.name.toLowerCase().includes(q)).slice(0, 20);
  }, [query, institutions]);

  const handleSelectCampus = async (campusId: string) => {
    setLoading(true);
    setError(null);
    try {
      await setDefaultCampus(campusId);
      onSelect();
    } catch {
      setError('Failed to switch campus');
      setLoading(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} title="Switch campus">
      <div className="p-6 space-y-4">
        {!selectedInstitution && (
          <>
            <Input
              type="text"
              placeholder="Search your institution..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              leftIcon={<SearchIcon className="h-4 w-4" />}
              rightIcon={query ? <button onClick={() => setQuery('')}><CloseIcon className="h-4 w-4" /></button> : undefined}
              autoFocus
            />
            <div className="max-h-64 overflow-y-auto rounded-lg border border-cream-200 dark:border-forest-700 dark:border-cream-100">
              {(filtered ?? institutions.slice(0, 20)).map((inst: Institution) => (
                <button
                  key={inst.id}
                  type="button"
                  onClick={() => setSelectedInstitution(inst)}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-cream-100 dark:hover:bg-forest-700 dark:bg-forest-900"
                >
                  {inst.name}
                </button>
              ))}
              {(filtered ?? institutions).length === 0 && (
                <p className="px-4 py-6 text-center text-sm text-forest-700/60 dark:text-cream-100/60">
                  No institutions found
                </p>
              )}
            </div>
          </>
        )}

        {selectedInstitution && (
          <div className="space-y-3">
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
                  onClick={() => handleSelectCampus(campus.id)}
                  disabled={loading}
                  className="flex w-full items-center justify-between rounded-lg border-2 border-cream-200 px-4 py-3 text-left text-sm transition hover:border-forest-700/30 disabled:opacity-50 dark:border-forest-700 dark:border-cream-100/30 dark:border-cream-100"
                >
                  <span>
                    {campus.name}
                    {campus.isPrimary && <span className="ml-2 text-xs text-gold-600">Main</span>}
                  </span>
                  {campus.id === currentCampusId && <CheckIcon className="h-4 w-4 text-gold-600" />}
                </button>
              ))}
            </div>
            <Button variant="ghost" onClick={() => setSelectedInstitution(null)}>
              Back
            </Button>
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </Modal>
  );
}
