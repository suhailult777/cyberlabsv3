'use client';

import Image from 'next/image';
import { Lab } from '@/types';
import { formatCurrency } from '@/lib/utils/format';
import { Cpu, HardDrive, MemoryStick, Zap } from 'lucide-react';

interface LabCardProps {
  lab: Lab;
  isSelected?: boolean;
  onSelect?: (lab: Lab) => void;
}

export function LabCard({ lab, isSelected, onSelect }: LabCardProps) {
  const difficultyConfig = {
    beginner: { color: '#00e676', label: 'BEGINNER' },
    intermediate: { color: '#ffb000', label: 'INTERMEDIATE' },
    advanced: { color: '#ff4757', label: 'ADVANCED' },
  }[lab.difficulty];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect?.(lab);
    }
  };

  return (
    <div
      onClick={() => onSelect?.(lab)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`${lab.name} - ${lab.difficulty} - ${formatCurrency(lab.hourlyPrice)} per hour${isSelected ? ' - Selected' : ''}`}
      aria-pressed={isSelected}
      className={`group relative rounded-lg border transition-all duration-300 cursor-pointer overflow-hidden bg-[#0e0e14] ${
        isSelected
          ? 'border-[#00e676] glow-accent-strong'
          : 'border-[#1a1a2e] hover:border-[#2a2a45] hover:shadow-[0_0_30px_rgba(0,230,118,0.08)]'
      }`}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300"
        style={{
          background: isSelected ? '#00e676' : 'transparent',
          boxShadow: isSelected ? '0 0 12px #00e676' : 'none',
        }}
      />

      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src={lab.imageUrl}
          alt={lab.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e14] via-[#0e0e14]/40 to-transparent" />
        
        {/* Status badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span
            className="text-[10px] font-bold px-2 py-1 rounded-sm font-[family-name:var(--font-mono)] tracking-wider"
            style={{
              background: `${difficultyConfig.color}15`,
              color: difficultyConfig.color,
              border: `1px solid ${difficultyConfig.color}30`,
            }}
          >
            {difficultyConfig.label}
          </span>
        </div>

        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-3 right-3">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#00e676] font-[family-name:var(--font-mono)] bg-[#00e67615] border border-[#00e67630] px-2 py-1 rounded-sm">
              <Zap className="w-3 h-3" />
              ACTIVE
            </div>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-[#e8e8ec] font-[family-name:var(--font-mono)] leading-tight">
            {lab.name}
          </h3>
          <span className="text-xs text-[#5a5a6a] font-[family-name:var(--font-mono)] uppercase tracking-wider">
            {lab.category}
          </span>
        </div>

        <p className="text-sm text-[#8a8a9a] leading-relaxed mb-4 line-clamp-2">
          {lab.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {lab.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-1 rounded-sm bg-[#14141f] text-[#8a8a9a] border border-[#1a1a2e] font-[family-name:var(--font-mono)]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 mb-4 text-[11px] text-[#5a5a6a] font-[family-name:var(--font-mono)]">
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" />
            {lab.specs.cpu}
          </span>
          <span className="flex items-center gap-1.5">
            <MemoryStick className="w-3.5 h-3.5" />
            {lab.specs.ram}
          </span>
          <span className="flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5" />
            {lab.specs.storage}
          </span>
        </div>

        {/* Price bar */}
        <div className="flex items-center justify-between pt-3 border-t border-[#1a1a2e]">
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-bold text-[#00e676] font-[family-name:var(--font-mono)]">
              {formatCurrency(lab.hourlyPrice)}
            </span>
            <span className="text-xs text-[#5a5a6a] font-[family-name:var(--font-mono)]">/hr</span>
          </div>
          {isSelected ? (
            <span className="text-[10px] font-bold text-[#00e676] font-[family-name:var(--font-mono)] tracking-wider">
              SELECTED
            </span>
          ) : (
            <span className="text-[10px] text-[#5a5a6a] font-[family-name:var(--font-mono)] tracking-wider group-hover:text-[#8a8a9a] transition-colors">
              CLICK TO SELECT
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
