import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import { SESSION_COOKIE_NAME, issueSessionToken } from '../auth/session';

describe('Rotas /api/allowlist (admin-only)', () => {
  const app = createApp();

  it('retorna 401 sem sessão', async () => {
    const res = await request(app).get('/api/allowlist');
    expect(res.status).toBe(401);
  });

  it('retorna 403 para usuário comum (não admin)', async () => {
    const token = await issueSessionToken({ sub: 'member@example.com', role: 'member' });
    const res = await request(app)
      .get('/api/allowlist')
      .set('Cookie', `${SESSION_COOKIE_NAME}=${token}`);
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('forbidden');
  });
});
