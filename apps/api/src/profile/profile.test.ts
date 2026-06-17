import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { eq } from 'drizzle-orm';
import { db } from '../db/client';
import { userProfiles } from '../db/schema';
import { createApp } from '../app';
import { SESSION_COOKIE_NAME, issueSessionToken } from '../auth/session';
import { profileInputSchema } from '@vita/shared';

const isDbAvailable =
  !!process.env.DATABASE_URL &&
  !process.env.DATABASE_URL.includes('localhost') &&
  !process.env.DATABASE_URL.includes('127.0.0.1');

describe('profileInputSchema (validação)', () => {
  it('aceita objeto vazio (todos os campos opcionais)', () => {
    expect(profileInputSchema.safeParse({}).success).toBe(true);
  });

  it('aceita dados válidos', () => {
    const result = profileInputSchema.safeParse({
      fullName: 'Maria Silva',
      birthDate: '1990-05-12',
      heightCm: 168,
    });
    expect(result.success).toBe(true);
  });

  it('rejeita data de nascimento no futuro', () => {
    const future = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    expect(profileInputSchema.safeParse({ birthDate: future }).success).toBe(false);
  });

  it('rejeita ano de nascimento anterior a 1900', () => {
    expect(profileInputSchema.safeParse({ birthDate: '1899-01-01' }).success).toBe(false);
  });

  it('rejeita altura fora da faixa 50-250', () => {
    expect(profileInputSchema.safeParse({ heightCm: 10 }).success).toBe(false);
    expect(profileInputSchema.safeParse({ heightCm: 300 }).success).toBe(false);
  });

  it('rejeita nome com mais de 120 caracteres', () => {
    expect(profileInputSchema.safeParse({ fullName: 'a'.repeat(121) }).success).toBe(false);
  });
});

describe.skipIf(!isDbAvailable)('Rotas /api/profile', () => {
  const app = createApp();
  const testEmail = 'profile-test@example.com';
  let token: string;

  beforeEach(async () => {
    token = await issueSessionToken({ sub: testEmail, role: 'member' });
  });

  afterEach(async () => {
    await db.delete(userProfiles).where(eq(userProfiles.userEmail, testEmail));
  });

  it('retorna 401 sem autenticação', async () => {
    const res = await request(app).get('/api/profile');
    expect(res.status).toBe(401);
  });

  it('retorna null quando o perfil ainda não existe', async () => {
    const res = await request(app)
      .get('/api/profile')
      .set('Cookie', `${SESSION_COOKIE_NAME}=${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toBeNull();
  });

  it('cria o perfil via upsert e retorna 200', async () => {
    const res = await request(app)
      .put('/api/profile')
      .set('Cookie', `${SESSION_COOKIE_NAME}=${token}`)
      .send({ fullName: 'Maria Silva', birthDate: '1990-05-12', heightCm: 168 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body.fullName).toBe('Maria Silva');
    expect(res.body.birthDate).toBe('1990-05-12');
    expect(res.body.heightCm).toBe(168);
  });

  it('atualiza (upsert idempotente) o perfil existente', async () => {
    await request(app)
      .put('/api/profile')
      .set('Cookie', `${SESSION_COOKIE_NAME}=${token}`)
      .send({ fullName: 'Maria Silva', heightCm: 168 });

    const res = await request(app)
      .put('/api/profile')
      .set('Cookie', `${SESSION_COOKIE_NAME}=${token}`)
      .send({ fullName: 'Maria S. Souza', heightCm: 170 });

    expect(res.status).toBe(200);
    expect(res.body.fullName).toBe('Maria S. Souza');
    expect(res.body.heightCm).toBe(170);

    // Garante que continua existindo apenas um perfil para o usuário.
    const rows = await db.select().from(userProfiles).where(eq(userProfiles.userEmail, testEmail));
    expect(rows.length).toBe(1);
  });

  it('retorna 400 para data de nascimento no futuro', async () => {
    const future = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const res = await request(app)
      .put('/api/profile')
      .set('Cookie', `${SESSION_COOKIE_NAME}=${token}`)
      .send({ birthDate: future });
    expect(res.status).toBe(400);
  });

  it('retorna 400 para altura fora da faixa', async () => {
    const res = await request(app)
      .put('/api/profile')
      .set('Cookie', `${SESSION_COOKIE_NAME}=${token}`)
      .send({ heightCm: 300 });
    expect(res.status).toBe(400);
  });
});
