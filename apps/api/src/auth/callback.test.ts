import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';

// Simula a troca do código (sem rede) e a allowlist (e-mail não autorizado).
vi.mock('./google', () => ({
  exchangeCodeForEmail: vi.fn(async () => ({ email: 'intruso@example.com', emailVerified: true })),
  buildAuthUrl: vi.fn(() => 'https://accounts.google.com/o/oauth2/auth'),
}));
vi.mock('../allowlist/allowlist.service', () => ({
  getRole: vi.fn(async () => null), // fora da allowlist
}));

const { createApp } = await import('../app');

describe('GET /api/auth/google/callback', () => {
  const app = createApp();

  it('bloqueia (403) usuário fora da allowlist', async () => {
    const res = await request(app)
      .get('/api/auth/google/callback?code=abc&state=xyz')
      .set('Cookie', 'vita_oauth_state=xyz');
    expect(res.status).toBe(403);
  });

  it('rejeita (403) quando o state não confere', async () => {
    const res = await request(app)
      .get('/api/auth/google/callback?code=abc&state=xyz')
      .set('Cookie', 'vita_oauth_state=diferente');
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('invalid_state');
  });
});
