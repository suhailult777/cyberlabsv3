import { describe, it, expect } from 'vitest';
import { POST as provisionPost } from '@/app/api/provision/route';
import { plansStore, environmentsStore } from '@/lib/data/store';

function createRequest(body: unknown): Request {
  return new Request('http://localhost:3000/api/provision', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/provision', () => {
  it('returns 400 for invalid data', async () => {
    const req = createRequest({ planId: '' });
    const res = await provisionPost(req);
    expect(res.status).toBe(400);
  });

  it('returns 404 for unknown plan', async () => {
    const req = createRequest({ planId: 'nonexistent-plan' });
    const res = await provisionPost(req);
    expect(res.status).toBe(404);
  });

  it('creates environment with correct expiry from plan hours', async () => {
    // Add a 2-hour plan
    const plan = {
      id: 'plan-test-provision',
      userId: 'user-1',
      labId: 'network-security',
      labName: 'Network Security Lab',
      hours: 2,
      hourlyPrice: 100,
      totalAmount: 200,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      expiresAt: new Date().toISOString(),
    };
    plansStore.push(plan);

    const req = createRequest({ planId: plan.id });
    const res = await provisionPost(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.environment.status).toBe('running');
    expect(data.environment.planId).toBe(plan.id);

    // Verify expiry is based on plan hours (2 hours)
    const startedAt = new Date(data.environment.startedAt).getTime();
    const expiresAt = new Date(data.environment.expiresAt).getTime();
    const diffHours = (expiresAt - startedAt) / (1000 * 60 * 60);
    expect(diffHours).toBe(2);

    // Verify environment was persisted
    expect(environmentsStore.some((e) => e.id === data.environment.id)).toBe(true);

    // Verify plan status was updated
    expect(plan.status).toBe('provisioned');

    // Cleanup
    const envIndex = environmentsStore.findIndex((e) => e.id === data.environment.id);
    if (envIndex > -1) environmentsStore.splice(envIndex, 1);
    const planIndex = plansStore.findIndex((p) => p.id === plan.id);
    if (planIndex > -1) plansStore.splice(planIndex, 1);
  });
});
