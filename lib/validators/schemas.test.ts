import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema, planSchema } from './schemas';

describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    const result = loginSchema.safeParse({ email: 'suhail@gmail.com', password: 'astr0000' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: 'password' });
    expect(result.success).toBe(false);
  });

  it('rejects empty password', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: '' });
    expect(result.success).toBe(false);
  });
});

describe('registerSchema', () => {
  it('accepts valid registration', () => {
    const result = registerSchema.safeParse({
      name: 'Suhail',
      email: 'suhail@gmail.com',
      password: 'password123',
      confirmPassword: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects short name', () => {
    const result = registerSchema.safeParse({
      name: 'A',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('rejects mismatched passwords', () => {
    const result = registerSchema.safeParse({
      name: 'Suhail',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'different',
    });
    expect(result.success).toBe(false);
  });

  it('rejects short password', () => {
    const result = registerSchema.safeParse({
      name: 'Suhail',
      email: 'test@example.com',
      password: '123',
      confirmPassword: '123',
    });
    expect(result.success).toBe(false);
  });
});

describe('planSchema', () => {
  it('accepts valid plan', () => {
    const result = planSchema.safeParse({ labId: 'penetration-testing', hours: 4 });
    expect(result.success).toBe(true);
  });

  it('rejects empty labId', () => {
    const result = planSchema.safeParse({ labId: '', hours: 4 });
    expect(result.success).toBe(false);
  });

  it('rejects zero hours', () => {
    const result = planSchema.safeParse({ labId: 'lab-1', hours: 0 });
    expect(result.success).toBe(false);
  });

  it('rejects more than 48 hours', () => {
    const result = planSchema.safeParse({ labId: 'lab-1', hours: 49 });
    expect(result.success).toBe(false);
  });
});
