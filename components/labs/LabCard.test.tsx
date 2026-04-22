import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LabCard } from './LabCard';
import { Lab } from '@/types';

const mockLab: Lab = {
  id: 'test-lab',
  name: 'Test Lab',
  description: 'A test lab for testing',
  category: 'cybersecurity',
  difficulty: 'intermediate',
  hourlyPrice: 150,
  imageUrl: 'https://example.com/image.jpg',
  tags: ['Kali', 'Nmap'],
  specs: { ram: '8GB', cpu: '4 vCPU', storage: '50GB SSD' },
};

describe('LabCard', () => {
  it('renders lab information', () => {
    render(<LabCard lab={mockLab} />);
    expect(screen.getByText('Test Lab')).toBeInTheDocument();
    expect(screen.getByText('A test lab for testing')).toBeInTheDocument();
    expect(screen.getByText('INTERMEDIATE')).toBeInTheDocument();
  });

  it('shows selected state when isSelected is true', () => {
    render(<LabCard lab={mockLab} isSelected={true} />);
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
  });

  it('shows click to select when not selected', () => {
    render(<LabCard lab={mockLab} isSelected={false} />);
    expect(screen.getByText('CLICK TO SELECT')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    const onSelect = vi.fn();
    render(<LabCard lab={mockLab} onSelect={onSelect} />);
    fireEvent.click(screen.getByText('Test Lab').closest('div')?.parentElement?.parentElement as HTMLElement);
    expect(onSelect).toHaveBeenCalledWith(mockLab);
  });

  it('renders specs correctly', () => {
    render(<LabCard lab={mockLab} />);
    expect(screen.getByText('4 vCPU')).toBeInTheDocument();
    expect(screen.getByText('8GB')).toBeInTheDocument();
    expect(screen.getByText('50GB SSD')).toBeInTheDocument();
  });

  it('renders tags', () => {
    render(<LabCard lab={mockLab} />);
    expect(screen.getByText('Kali')).toBeInTheDocument();
    expect(screen.getByText('Nmap')).toBeInTheDocument();
  });

  it('formats price correctly', () => {
    render(<LabCard lab={mockLab} />);
    expect(screen.getByText('₹150')).toBeInTheDocument();
  });
});
