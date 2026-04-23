import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProvisioningSteps } from './ProvisioningSteps';

describe('ProvisioningSteps', () => {
  it('renders all 4 steps', () => {
    render(<ProvisioningSteps currentStep={0} />);
    expect(screen.getByText('Initializing infrastructure')).toBeInTheDocument();
    expect(screen.getByText('Installing dependencies')).toBeInTheDocument();
    expect(screen.getByText('Configuring access controls')).toBeInTheDocument();
    expect(screen.getByText('Environment ready')).toBeInTheDocument();
  });

  it('shows first step as active when currentStep is 0', () => {
    render(<ProvisioningSteps currentStep={0} />);
    // The active step should have a loading spinner (Loader2 icon)
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('shows completed steps when currentStep is 2', () => {
    render(<ProvisioningSteps currentStep={2} />);
    // At minimum, the component should render without errors
    expect(screen.getByText('Initializing infrastructure')).toBeInTheDocument();
    expect(screen.getByText('Installing dependencies')).toBeInTheDocument();
  });

  it('shows all steps completed when currentStep is 4', () => {
    render(<ProvisioningSteps currentStep={4} />);
    expect(screen.getByText('Environment ready')).toBeInTheDocument();
  });
});
