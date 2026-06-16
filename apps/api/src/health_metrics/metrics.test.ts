import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { eq } from 'drizzle-orm';
import { db } from '../db/client';
import { weightLogs, bloodPressureLogs } from '../db/schema';
import { createApp } from '../app';
import { SESSION_COOKIE_NAME, issueSessionToken } from '../auth/session';

// We will implement parseDecimalInput in metrics.service.ts
// For TDD, let's write the test importing it. Since it doesn't exist yet,
// the tests will fail to compile or run, which is the correct TDD red state.

import { parseDecimalInput } from './metrics.service';

describe('metrics.service - parseDecimalInput', () => {
  it('deve converter vírgula em ponto', () => {
    expect(parseDecimalInput('80,4')).toBe(80.4);
    expect(parseDecimalInput('72,0')).toBe(72.0);
  });

  it('deve aceitar ponto diretamente', () => {
    expect(parseDecimalInput('80.4')).toBe(80.4);
    expect(parseDecimalInput('72')).toBe(72.0);
  });

  it('deve remover espaços em branco', () => {
    expect(parseDecimalInput('  80,4  ')).toBe(80.4);
  });

  it('deve retornar null para valores inválidos', () => {
    expect(parseDecimalInput('80,,4')).toBeNull();
    expect(parseDecimalInput('abc')).toBeNull();
    expect(parseDecimalInput('')).toBeNull();
    expect(parseDecimalInput('  ')).toBeNull();
  });
});

describe('Rotas /api/metrics/weight', () => {
  const app = createApp();
  const testEmail = 'metrics-test@example.com';
  let token: string;

  beforeEach(async () => {
    token = await issueSessionToken({ sub: testEmail, role: 'member' });
  });

  afterEach(async () => {
    // Clean up database test records to prevent pollution
    await db.delete(weightLogs).where(eq(weightLogs.userEmail, testEmail));
    await db.delete(bloodPressureLogs).where(eq(bloodPressureLogs.userEmail, testEmail));
  });

  it('retorna 401 sem autenticação', async () => {
    const res = await request(app)
      .post('/api/metrics/weight')
      .send({ weight: 75.5 });
    expect(res.status).toBe(401);
  });

  it('salva o peso com sucesso e retorna 201 com dados válidos', async () => {
    const res = await request(app)
      .post('/api/metrics/weight')
      .set('Cookie', `${SESSION_COOKIE_NAME}=${token}`)
      .send({ weight: 75.5 });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.weight).toBe(75.5);
    expect(res.body).toHaveProperty('loggedAt');
  });

  it('retorna 400 se o peso estiver fora do intervalo 20-350', async () => {
    const resUnder = await request(app)
      .post('/api/metrics/weight')
      .set('Cookie', `${SESSION_COOKIE_NAME}=${token}`)
      .send({ weight: 19.9 });
    expect(resUnder.status).toBe(400);

    const resOver = await request(app)
      .post('/api/metrics/weight')
      .set('Cookie', `${SESSION_COOKIE_NAME}=${token}`)
      .send({ weight: 350.1 });
    expect(resOver.status).toBe(400);
  });
});

describe('Rotas /api/metrics/blood-pressure', () => {
  const app = createApp();
  const testEmail = 'metrics-test@example.com';
  let token: string;

  beforeEach(async () => {
    token = await issueSessionToken({ sub: testEmail, role: 'member' });
  });

  afterEach(async () => {
    await db.delete(bloodPressureLogs).where(eq(bloodPressureLogs.userEmail, testEmail));
  });

  it('retorna 401 sem autenticação', async () => {
    const res = await request(app)
      .post('/api/metrics/blood-pressure')
      .send({ systolic: 120, diastolic: 80 });
    expect(res.status).toBe(401);
  });

  it('salva a pressão arterial com sucesso e retorna 201 com dados válidos', async () => {
    const res = await request(app)
      .post('/api/metrics/blood-pressure')
      .set('Cookie', `${SESSION_COOKIE_NAME}=${token}`)
      .send({ systolic: 120, diastolic: 80 });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.systolic).toBe(120);
    expect(res.body.diastolic).toBe(80);
    expect(res.body).toHaveProperty('loggedAt');
  });

  it('retorna 400 se a pressão sistólica ou diastólica estiver fora do intervalo', async () => {
    const resSysLow = await request(app)
      .post('/api/metrics/blood-pressure')
      .set('Cookie', `${SESSION_COOKIE_NAME}=${token}`)
      .send({ systolic: 39, diastolic: 80 });
    expect(resSysLow.status).toBe(400);

    const resSysHigh = await request(app)
      .post('/api/metrics/blood-pressure')
      .set('Cookie', `${SESSION_COOKIE_NAME}=${token}`)
      .send({ systolic: 301, diastolic: 80 });
    expect(resSysHigh.status).toBe(400);

    const resDiaLow = await request(app)
      .post('/api/metrics/blood-pressure')
      .set('Cookie', `${SESSION_COOKIE_NAME}=${token}`)
      .send({ systolic: 120, diastolic: 29 });
    expect(resDiaLow.status).toBe(400);

    const resDiaHigh = await request(app)
      .post('/api/metrics/blood-pressure')
      .set('Cookie', `${SESSION_COOKIE_NAME}=${token}`)
      .send({ systolic: 120, diastolic: 201 });
    expect(resDiaHigh.status).toBe(400);
  });
});

describe('GET /api/metrics/weight e GET /api/metrics/blood-pressure (histórico e filtros)', () => {
  const app = createApp();
  const testEmail = 'metrics-get-test@example.com';
  let token: string;

  beforeEach(async () => {
    token = await issueSessionToken({ sub: testEmail, role: 'member' });

    // Seed mock data with different timestamps:
    // 1. 10 days ago (outside 7d filter, inside 30d and all)
    // 2. 2 days ago (inside 7d, 30d, and all)
    const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

    await db.insert(weightLogs).values([
      { userEmail: testEmail, weight: 80.0, loggedAt: tenDaysAgo },
      { userEmail: testEmail, weight: 81.0, loggedAt: twoDaysAgo },
    ]);

    await db.insert(bloodPressureLogs).values([
      { userEmail: testEmail, systolic: 130, diastolic: 85, loggedAt: tenDaysAgo },
      { userEmail: testEmail, systolic: 120, diastolic: 80, loggedAt: twoDaysAgo },
    ]);
  });

  afterEach(async () => {
    await db.delete(weightLogs).where(eq(weightLogs.userEmail, testEmail));
    await db.delete(bloodPressureLogs).where(eq(bloodPressureLogs.userEmail, testEmail));
  });

  it('retorna histórico completo em ordem cronológica por padrão', async () => {
    const res = await request(app)
      .get('/api/metrics/weight')
      .set('Cookie', `${SESSION_COOKIE_NAME}=${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    // Chronological order: oldest first (or newest first? The spec says "exposição cronológica",
    // wait, usually graphs show oldest to newest (left to right), and history lists show newest first.
    // Let's check: the query for graph should return oldest to newest so it plots left to right.
    // Let's assert oldest first (or adjust accordingly).
    expect(res.body[0].weight).toBe(80.0);
    expect(res.body[1].weight).toBe(81.0);
  });

  it('filtra peso por 7d', async () => {
    const res = await request(app)
      .get('/api/metrics/weight?timeframe=7d')
      .set('Cookie', `${SESSION_COOKIE_NAME}=${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].weight).toBe(81.0);
  });

  it('filtra pressão por 7d', async () => {
    const res = await request(app)
      .get('/api/metrics/blood-pressure?timeframe=7d')
      .set('Cookie', `${SESSION_COOKIE_NAME}=${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].systolic).toBe(120);
  });
});

describe('PUT e DELETE /api/metrics/weight/:id e /api/metrics/blood-pressure/:id', () => {
  const app = createApp();
  const testEmail = 'metrics-manage-test@example.com';
  let token: string;
  let weightId: string;
  let bpId: string;

  beforeEach(async () => {
    token = await issueSessionToken({ sub: testEmail, role: 'member' });

    // Seed mock data
    const [weightLog] = await db.insert(weightLogs).values({
      userEmail: testEmail,
      weight: 85.0,
    }).returning();
    weightId = weightLog!.id;

    const [bpLog] = await db.insert(bloodPressureLogs).values({
      userEmail: testEmail,
      systolic: 140,
      diastolic: 90,
    }).returning();
    bpId = bpLog!.id;
  });

  afterEach(async () => {
    await db.delete(weightLogs).where(eq(weightLogs.userEmail, testEmail));
    await db.delete(bloodPressureLogs).where(eq(bloodPressureLogs.userEmail, testEmail));
  });

  it('permite atualizar um peso existente', async () => {
    const res = await request(app)
      .put(`/api/metrics/weight/${weightId}`)
      .set('Cookie', `${SESSION_COOKIE_NAME}=${token}`)
      .send({ weight: 84.5 });

    expect(res.status).toBe(200);
    expect(res.body.weight).toBe(84.5);
  });

  it('retorna 404 ao atualizar um peso inexistente ou de outro usuário', async () => {
    const fakeUuid = '00000000-0000-0000-0000-000000000000';
    const res = await request(app)
      .put(`/api/metrics/weight/${fakeUuid}`)
      .set('Cookie', `${SESSION_COOKIE_NAME}=${token}`)
      .send({ weight: 84.5 });

    expect(res.status).toBe(404);
  });

  it('permite deletar um peso existente', async () => {
    const res = await request(app)
      .delete(`/api/metrics/weight/${weightId}`)
      .set('Cookie', `${SESSION_COOKIE_NAME}=${token}`);

    expect(res.status).toBe(204);

    const check = await db.select().from(weightLogs).where(eq(weightLogs.id, weightId));
    expect(check.length).toBe(0);
  });

  it('permite atualizar uma pressão existente', async () => {
    const res = await request(app)
      .put(`/api/metrics/blood-pressure/${bpId}`)
      .set('Cookie', `${SESSION_COOKIE_NAME}=${token}`)
      .send({ systolic: 135, diastolic: 85 });

    expect(res.status).toBe(200);
    expect(res.body.systolic).toBe(135);
    expect(res.body.diastolic).toBe(85);
  });

  it('permite deletar uma pressão existente', async () => {
    const res = await request(app)
      .delete(`/api/metrics/blood-pressure/${bpId}`)
      .set('Cookie', `${SESSION_COOKIE_NAME}=${token}`);

    expect(res.status).toBe(204);

    const check = await db.select().from(bloodPressureLogs).where(eq(bloodPressureLogs.id, bpId));
    expect(check.length).toBe(0);
  });
});
