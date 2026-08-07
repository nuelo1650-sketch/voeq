'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CampusSelectModal } from '@/components/modals/CampusSelectModal';

export default function SelectCampusPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <CampusSelectModal
      isOpen={isOpen}
      onSelected={() => {
        setIsOpen(false);
        router.push('/home');
      }}
    />
  );
}
