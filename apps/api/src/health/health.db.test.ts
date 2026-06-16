import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';

// Controla o resultado da checagem de banco para validar os dois caminhos do health.
const checkDatabase = vi.fn();
vi.mock('../db/client', () => ({ checkDatabase: () => checkDatabase() }));

const { createApp } = await import('../app');

describe('GET /api/health (estado do banco)', () => {
  const app = createApp();

  it('reporta db up e status ok (200) quando o banco responde', async () => {
    checkDatabase.mockResolvedValueOnce(true);
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: 'ok', db: 'up' });
  });

  it('reporta db down e status degraded (503) quando o banco falha', async () => {
    checkDatabase.mockResolvedValueOnce(false);
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(503);
    expect(res.body).toMatchObject({ status: 'degraded', db: 'down' });
  });
});
