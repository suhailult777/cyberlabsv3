import { describe, it, expect } from 'vitest';
import { formatCurrency, calculateExpiry, formatDuration } from './format';

describe('formatCurrency', () => {
  it('formats INR correctly', () => {
    expect(formatCurrency(150)).toBe('₹150');
    expect(formatCurrency(1000)).toBe('₹1,000');
    expect(formatCurrency(0)).toBe('₹0');
  });
});

describe('calculateExpiry', () => {
  it('calculates correct expiry', () => {
    const now = Date.now();
    const expiry = calculateExpiry(2);
    const diff = expiry.getTime() - now;
    expect(diff).toBeGreaterThanOrEqual(2 * 60 * 60 * 1000 - 1000);
    expect(diff).toBeLessThanOrEqual(2 * 60 * 60 * 1000 + 1000);
  });
});

describe('formatDuration', () => {
  it('formats hours minutes seconds', () => {
    expect(formatDuration(3661000)).toBe('1h 1m 1s');
  });

  it('formats minutes seconds', () => {
    expect(formatDuration(61000)).toBe('1m 1s');
  });

  it('formats seconds only', () => {
    expect(formatDuration(5000)).toBe('5s');
  });

  it('formats zero', () => {
    expect(formatDuration(0)).toBe('0s');
  });
});
