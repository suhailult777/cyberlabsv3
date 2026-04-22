import { describe, it, expect, beforeEach } from 'vitest';
import {
  paymentsStore,
  environmentsStore,
  findPlanById,
  findEnvironmentById,
  findEnvironmentByPlanId,
  updatePlanStatus,
  updateEnvironmentStatus,
} from './store';

describe('in-memory data store', () => {
  beforeEach(() => {
    // Clear dynamic stores (keep seed plans for realism)
    paymentsStore.length = 0;
    environmentsStore.length = 0;
  });

  describe('findPlanById', () => {
    it('finds a plan by id', () => {
      const plan = findPlanById('plan-demo-1');
      expect(plan).toBeDefined();
      expect(plan?.labName).toBe('Penetration Testing Lab');
    });

    it('returns undefined for unknown id', () => {
      const plan = findPlanById('nonexistent');
      expect(plan).toBeUndefined();
    });
  });

  describe('findEnvironmentById', () => {
    it('returns undefined when no environments exist', () => {
      const env = findEnvironmentById('env-123');
      expect(env).toBeUndefined();
    });
  });

  describe('findEnvironmentByPlanId', () => {
    it('returns undefined when no matching environment', () => {
      const env = findEnvironmentByPlanId('plan-demo-1');
      expect(env).toBeUndefined();
    });
  });

  describe('updatePlanStatus', () => {
    it('updates plan status', () => {
      const plan = updatePlanStatus('plan-demo-1', 'paid');
      expect(plan?.status).toBe('paid');
      // Reset
      updatePlanStatus('plan-demo-1', 'provisioned');
    });

    it('returns undefined for unknown plan', () => {
      const plan = updatePlanStatus('nonexistent', 'paid');
      expect(plan).toBeUndefined();
    });
  });

  describe('updateEnvironmentStatus', () => {
    it('updates environment status', () => {
      environmentsStore.push({
        id: 'env-test',
        planId: 'plan-demo-1',
        accessUrl: '/lab/env-test',
        username: 'student',
        password: 'pass123',
        status: 'running',
        startedAt: new Date().toISOString(),
        expiresAt: new Date().toISOString(),
      });

      const env = updateEnvironmentStatus('env-test', 'stopped');
      expect(env?.status).toBe('stopped');
    });
  });

  describe('paymentsStore', () => {
    it('starts empty', () => {
      expect(paymentsStore).toHaveLength(0);
    });

    it('accepts new payments', () => {
      paymentsStore.push({
        id: 'pay-1',
        planId: 'plan-demo-1',
        amount: 600,
        status: 'success',
        paidAt: new Date().toISOString(),
      });
      expect(paymentsStore).toHaveLength(1);
    });
  });
});
