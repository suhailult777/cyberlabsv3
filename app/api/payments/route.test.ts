import { describe, it, expect, beforeEach } from 'vitest';
import { POST as initiatePost } from '@/app/api/payments/initiate/route';
import { POST as verifyPost } from '@/app/api/payments/verify/route';
import { paymentsStore } from '@/lib/data/store';

function createRequest(body: unknown): Request {
  return new Request('http://localhost:3000/api/payments/initiate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function createVerifyRequest(body: unknown): Request {
  return new Request('http://localhost:3000/api/payments/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/payments/initiate', () => {
  it('returns mock mode when no Easebuzz keys configured', async () => {
    const req = createRequest({ planId: 'plan-1', amount: 500 });
    const res = await initiatePost(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.mock).toBe(true);
    expect(data.txnId).toBeDefined();
    expect(data.planId).toBe('plan-1');
  });

  it('returns 400 for invalid data', async () => {
    const req = createRequest({ planId: '' });
    const res = await initiatePost(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 for malformed JSON', async () => {
    const req = new Request('http://localhost:3000/api/payments/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not json',
    });
    const res = await initiatePost(req);
    expect(res.status).toBe(400);
  });
});

describe('POST /api/payments/verify', () => {
  beforeEach(() => {
    paymentsStore.length = 0;
  });

  it('returns mock success when no Easebuzz keys configured', async () => {
    const req = createVerifyRequest({ txnId: 'txn-123' });
    const res = await verifyPost(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe('success');
    expect(data.message).toContain('mock');
  });

  it('persists payment on mock verification', async () => {
    const initialCount = paymentsStore.length;
    const req = createVerifyRequest({
      txnId: 'txn-123',
      planId: 'plan-1',
      amount: '500',
    });
    await verifyPost(req);
    expect(paymentsStore.length).toBe(initialCount + 1);
    expect(paymentsStore[paymentsStore.length - 1].status).toBe('success');
  });

  it('returns 400 for missing txnId', async () => {
    const req = createVerifyRequest({});
    const res = await verifyPost(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 for malformed JSON', async () => {
    const req = new Request('http://localhost:3000/api/payments/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not json',
    });
    const res = await verifyPost(req);
    expect(res.status).toBe(400);
  });
});
