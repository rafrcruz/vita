import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';

// Mocka a checagem de banco para o teste de US1 não depender de rede.
vi.mock('../db/client', () => ({
  checkDatabase: vi.fn(async () => true),
}));

const { createApp } = await import('../app');

describe('GET /api/health', () => {
  const app = createApp();

  it('retorna 200 com status ok quando o banco responde', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.db).toBe('up');
    expect(typeof res.body.time).toBe('string');
  });

  it('retorna erro padronizado para rota inexistente', async () => {
    const res = await request(app).get('/api/inexistente');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('not_found');
  });
});
