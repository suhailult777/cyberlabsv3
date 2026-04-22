'use client';

import { Lab } from '@/types';
import { LabCard } from './LabCard';

interface LabGridProps {
  labs: Lab[];
  selectedId?: string;
  onSelect: (lab: Lab) => void;
}

export function LabGrid({ labs, selectedId, onSelect }: LabGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
      {labs.map((lab) => (
        <LabCard
          key={lab.id}
          lab={lab}
          isSelected={lab.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
