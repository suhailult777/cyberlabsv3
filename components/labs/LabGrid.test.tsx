import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LabGrid } from './LabGrid';
import { Lab } from '@/types';

const mockLabs: Lab[] = [
  {
    id: 'lab-1',
    name: 'Lab One',
    description: 'First lab',
    category: 'cybersecurity',
    difficulty: 'beginner',
    hourlyPrice: 100,
    imageUrl: 'https://example.com/1.jpg',
    tags: ['tag1'],
    specs: { ram: '4GB', cpu: '2 vCPU', storage: '20GB' },
  },
  {
    id: 'lab-2',
    name: 'Lab Two',
    description: 'Second lab',
    category: 'networking',
    difficulty: 'advanced',
    hourlyPrice: 200,
    imageUrl: 'https://example.com/2.jpg',
    tags: ['tag2'],
    specs: { ram: '16GB', cpu: '8 vCPU', storage: '100GB' },
  },
];

describe('LabGrid', () => {
  it('renders all labs', () => {
    render(<LabGrid labs={mockLabs} onSelect={() => {}} />);
    expect(screen.getByText('Lab One')).toBeInTheDocument();
    expect(screen.getByText('Lab Two')).toBeInTheDocument();
  });

  it('marks selected lab', () => {
    render(<LabGrid labs={mockLabs} selectedId="lab-1" onSelect={() => {}} />);
    // Lab One should be selected (has ACTIVE badge)
    expect(screen.getAllByText('ACTIVE').length).toBe(1);
  });
});
