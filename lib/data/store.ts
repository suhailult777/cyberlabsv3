import { Plan, Payment, LabEnvironment } from '@/types';

/**
 * In-memory data stores for the mock prototype.
 * All data resets when the dev server restarts.
 */

// Demo plans (seed data)
export const plansStore: Plan[] = [
  {
    id: 'plan-demo-1',
    userId: 'user-1',
    labId: 'penetration-testing',
    labName: 'Penetration Testing Lab',
    hours: 4,
    hourlyPrice: 150,
    totalAmount: 600,
    status: 'provisioned',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    expiresAt: new Date(Date.now() + 3600000).toISOString(),
  },
  {
    id: 'plan-demo-2',
    userId: 'user-1',
    labId: 'cloud-security',
    labName: 'Cloud Security Lab',
    hours: 2,
    hourlyPrice: 200,
    totalAmount: 400,
    status: 'paid',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    expiresAt: new Date(Date.now() + 7200000).toISOString(),
  },
  {
    id: 'plan-demo-3',
    userId: 'user-1',
    labId: 'devsecops',
    labName: 'DevSecOps Pipeline',
    hours: 6,
    hourlyPrice: 180,
    totalAmount: 1080,
    status: 'pending',
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    expiresAt: new Date(Date.now() + 21600000).toISOString(),
  },
];

export const paymentsStore: Payment[] = [];

export const environmentsStore: LabEnvironment[] = [];

/**
 * Helper to find a plan by ID
 */
export function findPlanById(id: string): Plan | undefined {
  return plansStore.find((p) => p.id === id);
}

/**
 * Helper to find a payment by ID
 */
export function findPaymentById(id: string): Payment | undefined {
  return paymentsStore.find((p) => p.id === id);
}

/**
 * Helper to find an environment by ID
 */
export function findEnvironmentById(id: string): LabEnvironment | undefined {
  return environmentsStore.find((e) => e.id === id);
}

/**
 * Helper to find an environment by plan ID
 */
export function findEnvironmentByPlanId(planId: string): LabEnvironment | undefined {
  return environmentsStore.find((e) => e.planId === planId);
}

/**
 * Update plan status
 */
export function updatePlanStatus(id: string, status: Plan['status']): Plan | undefined {
  const plan = findPlanById(id);
  if (plan) {
    plan.status = status;
  }
  return plan;
}

/**
 * Update environment status
 */
export function updateEnvironmentStatus(id: string, status: LabEnvironment['status']): LabEnvironment | undefined {
  const env = findEnvironmentById(id);
  if (env) {
    env.status = status;
  }
  return env;
}
