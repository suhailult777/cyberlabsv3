import { describe, it, expect, vi } from 'vitest';
import { apiClient } from './api';

describe('apiClient', () => {
  it('returns JSON on success', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: '1' }),
      })
    ) as unknown as typeof fetch;

    const data = await apiClient('/api/test');
    expect(data).toEqual({ id: '1' });
  });

  it('throws on HTTP error with message', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ error: 'Bad Request' }),
      })
    ) as unknown as typeof fetch;

    await expect(apiClient('/api/test')).rejects.toThrow('Bad Request');
  });

  it('throws on HTTP error with status fallback', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('fail')),
      })
    ) as unknown as typeof fetch;

    await expect(apiClient('/api/test')).rejects.toThrow('HTTP 500');
  });
});
