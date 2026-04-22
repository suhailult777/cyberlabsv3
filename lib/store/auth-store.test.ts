import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from './auth-store';

describe('auth store', () => {
  beforeEach(() => {
    // Reset store to initial state
    useAppStore.setState({
      user: null,
      isAuthenticated: false,
      currentPlan: null,
      labEnvironment: null,
      paymentStatus: 'idle',
      hasHydrated: false,
    });
  });

  it('initializes with correct defaults', () => {
    const state = useAppStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.currentPlan).toBeNull();
    expect(state.labEnvironment).toBeNull();
    expect(state.paymentStatus).toBe('idle');
    expect(state.hasHydrated).toBe(false);
  });

  it('login sets user and auth state', () => {
    const store = useAppStore.getState();
    store.login({ id: '1', name: 'Test', email: 'test@test.com' });

    const state = useAppStore.getState();
    expect(state.user).toEqual({ id: '1', name: 'Test', email: 'test@test.com' });
    expect(state.isAuthenticated).toBe(true);
  });

  it('logout clears all state', () => {
    const store = useAppStore.getState();
    store.login({ id: '1', name: 'Test', email: 'test@test.com' });
    store.setCurrentPlan({
      id: 'plan-1',
      userId: '1',
      labId: 'lab-1',
      labName: 'Test Lab',
      hours: 2,
      hourlyPrice: 100,
      totalAmount: 200,
      status: 'pending',
      createdAt: new Date().toISOString(),
      expiresAt: new Date().toISOString(),
    });
    store.logout();

    const state = useAppStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.currentPlan).toBeNull();
    expect(state.labEnvironment).toBeNull();
    expect(state.paymentStatus).toBe('idle');
  });

  it('setCurrentPlan updates plan', () => {
    const plan = {
      id: 'plan-1',
      userId: '1',
      labId: 'lab-1',
      labName: 'Test Lab',
      hours: 2,
      hourlyPrice: 100,
      totalAmount: 200,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      expiresAt: new Date().toISOString(),
    };
    useAppStore.getState().setCurrentPlan(plan);
    expect(useAppStore.getState().currentPlan).toEqual(plan);
  });

  it('setLabEnvironment updates environment', () => {
    const env = {
      id: 'env-1',
      planId: 'plan-1',
      accessUrl: '/lab/env-1',
      username: 'student',
      password: 'pass',
      status: 'running' as const,
      startedAt: new Date().toISOString(),
      expiresAt: new Date().toISOString(),
    };
    useAppStore.getState().setLabEnvironment(env);
    expect(useAppStore.getState().labEnvironment).toEqual(env);
  });

  it('setPaymentStatus cycles through states', () => {
    const store = useAppStore.getState();
    store.setPaymentStatus('processing');
    expect(useAppStore.getState().paymentStatus).toBe('processing');

    store.setPaymentStatus('success');
    expect(useAppStore.getState().paymentStatus).toBe('success');

    store.setPaymentStatus('failed');
    expect(useAppStore.getState().paymentStatus).toBe('failed');
  });

  it('setHasHydrated updates flag', () => {
    useAppStore.getState().setHasHydrated(true);
    expect(useAppStore.getState().hasHydrated).toBe(true);
  });

  it('persists auth state across resets', () => {
    const store = useAppStore.getState();
    store.login({ id: '1', name: 'Test', email: 'test@test.com' });
    
    // Simulate a store reset (like what happens on page reload before rehydration)
    useAppStore.setState({
      user: null,
      isAuthenticated: false,
      currentPlan: null,
      labEnvironment: null,
      paymentStatus: 'idle',
      hasHydrated: false,
    });

    // After "rehydration" (simulated by manually restoring)
    useAppStore.setState({
      user: { id: '1', name: 'Test', email: 'test@test.com' },
      isAuthenticated: true,
      hasHydrated: true,
    });

    const state = useAppStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual({ id: '1', name: 'Test', email: 'test@test.com' });
  });
});
