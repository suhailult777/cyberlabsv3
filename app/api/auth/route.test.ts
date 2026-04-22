import { describe, it, expect } from 'vitest';
import { POST as loginPost } from '@/app/api/auth/login/route';
import { POST as registerPost } from '@/app/api/auth/register/route';

function createRequest(body: unknown): Request {
  return new Request('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/auth/login', () => {
  it('returns 401 for invalid credentials', async () => {
    const req = createRequest({ email: 'wrong@email.com', password: 'wrong' });
    const res = await loginPost(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe('Invalid credentials');
  });

  it('returns 400 for invalid email format', async () => {
    const req = createRequest({ email: 'not-an-email', password: 'password' });
    const res = await loginPost(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 for empty password', async () => {
    const req = createRequest({ email: 'test@test.com', password: '' });
    const res = await loginPost(req);
    expect(res.status).toBe(400);
  });

  it('returns user and token for valid credentials', async () => {
    const req = createRequest({ email: 'suhail@gmail.com', password: 'astr0000' });
    const res = await loginPost(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.user.email).toBe('suhail@gmail.com');
    expect(data.user.isAdmin).toBe(true);
    expect(data.token).toBeDefined();
  });
});

describe('POST /api/auth/register', () => {
  it('returns 400 for short name', async () => {
    const req = createRequest({ name: 'A', email: 'test@test.com', password: 'password123', confirmPassword: 'password123' });
    const res = await registerPost(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 for mismatched passwords', async () => {
    const req = createRequest({ name: 'Test', email: 'test@test.com', password: 'password123', confirmPassword: 'different' });
    const res = await registerPost(req);
    expect(res.status).toBe(400);
  });

  it('returns user and token for valid registration', async () => {
    const req = createRequest({ name: 'Test User', email: 'test@test.com', password: 'password123', confirmPassword: 'password123' });
    const res = await registerPost(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.user.email).toBe('test@test.com');
    expect(data.user.isAdmin).toBe(false);
    expect(data.token).toBeDefined();
  });
});
