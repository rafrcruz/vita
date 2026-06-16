import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';

describe('GET /api/docs/openapi.json', () => {
  const app = createApp();

  it('gera o documento OpenAPI refletindo os endpoints da fundação', async () => {
    const res = await request(app).get('/api/docs/openapi.json');
    expect(res.status).toBe(200);
    expect(res.body.openapi).toBe('3.0.0');
    expect(res.body.paths).toHaveProperty('/api/health');
    expect(res.body.paths).toHaveProperty('/api/allowlist');
    expect(res.body.paths).toHaveProperty('/api/auth/me');
  });
});
