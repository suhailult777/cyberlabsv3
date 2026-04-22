import { describe, it, expect, beforeEach } from 'vitest';
import { POST as plansPost, GET as plansGet } from '@/app/api/plans/route';
import { plansStore } from '@/lib/data/store';

function createRequest(body: unknown): Request {
  return new Request('http://localhost:3000/api/plans', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/plans', () => {
  beforeEach(() => {
    // Clear plans beyond seed data for isolation
    while (plansStore.length > 3) plansStore.pop();
  });

  it('returns 400 for invalid data', async () => {
    const req = createRequest({ labId: '', hours: 0 });
    const res = await plansPost(req);
    expect(res.status).toBe(400);
  });

  it('returns 404 for unknown lab', async () => {
    const req = createRequest({ labId: 'unknown-lab', hours: 2 });
    const res = await plansPost(req);
    expect(res.status).toBe(404);
  });

  it('creates a plan and persists it', async () => {
    const initialCount = plansStore.length;
    const req = createRequest({ labId: 'penetration-testing', hours: 4 });
    const res = await plansPost(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.plan.labName).toBe('Penetration Testing Lab');
    expect(data.plan.totalAmount).toBe(600);
    expect(data.plan.status).toBe('pending');
    expect(plansStore.length).toBe(initialCount + 1);
  });

  it('calculates correct expiry based on hours', async () => {
    const req = createRequest({ labId: 'network-security', hours: 2 });
    const res = await plansPost(req);
    const data = await res.json();
    const createdAt = new Date(data.plan.createdAt).getTime();
    const expiresAt = new Date(data.plan.expiresAt).getTime();
    const diffHours = (expiresAt - createdAt) / (1000 * 60 * 60);
    expect(diffHours).toBe(2);
  });
});

describe('GET /api/plans', () => {
  it('returns all plans including seed data', async () => {
    const res = await plansGet();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data.plans)).toBe(true);
    expect(data.plans.length).toBeGreaterThanOrEqual(3);
  });
});
