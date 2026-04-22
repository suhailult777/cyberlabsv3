import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Navbar } from './Navbar';
import { useAppStore } from '@/lib/store/auth-store';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
}));

// Mock next/link
vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe('Navbar', () => {
  beforeEach(() => {
    useAppStore.setState({
      user: null,
      isAuthenticated: false,
      hasHydrated: false,
    });
  });

  it('shows skeleton when not hydrated', () => {
    render(<Navbar />);
    expect(screen.getByText('Cyberlabs')).toBeInTheDocument();
    // Should show skeleton (animated pulse div)
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('shows LOGIN button when hydrated and not authenticated', () => {
    useAppStore.getState().setHasHydrated(true);
    render(<Navbar />);
    expect(screen.getByText('LOGIN')).toBeInTheDocument();
  });

  it('shows user name and EXIT when authenticated', () => {
    useAppStore.getState().setHasHydrated(true);
    useAppStore.getState().login({
      id: 'user-1',
      name: 'Suhail',
      email: 'suhail@gmail.com',
    });
    render(<Navbar />);
    expect(screen.getByText('Suhail')).toBeInTheDocument();
    expect(screen.getByText('EXIT')).toBeInTheDocument();
  });

  it('shows email prefix when name is not available', () => {
    useAppStore.getState().setHasHydrated(true);
    useAppStore.getState().login({
      id: 'user-1',
      name: '',
      email: 'test@example.com',
    });
    render(<Navbar />);
    expect(screen.getByText('test')).toBeInTheDocument();
  });
});
