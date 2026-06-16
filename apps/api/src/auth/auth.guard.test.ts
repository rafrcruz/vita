import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { SignJWT } from 'jose';
import { createApp } from '../app';
import { env } from '../config/env';
import { SESSION_COOKIE_NAME } from './session';

const secret = new TextEncoder().encode(env.JWT_SECRET);

async function expiredToken(): Promise<string> {
  const past = Math.floor(Date.now() / 1000) - 60;
  return new SignJWT({ role: 'member' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject('user@example.com')
    .setIssuedAt(past - 60)
    .setExpirationTime(past)
    .sign(secret);
}

describe('requireAuth (gate de sessão)', () => {
  const app = createApp();

  it('retorna 401 ao acessar rota protegida sem sessão', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('unauthenticated');
  });

  it('retorna 401 com sessão expirada', async () => {
    const token = await expiredToken();
    const res = await request(app)
      .get('/api/auth/me')
      .set('Cookie', `${SESSION_COOKIE_NAME}=${token}`);
    expect(res.status).toBe(401);
  });
});
