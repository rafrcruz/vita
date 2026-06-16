import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';
import { AppError, errorHandler, notFoundHandler } from './error';
import { asyncHandler } from './async';

function appWith() {
  const app = express();
  app.get('/handled', () => {
    throw new AppError(400, 'bad_input', 'Entrada inválida.');
  });
  app.get(
    '/unhandled',
    asyncHandler(async () => {
      throw new Error('boom: segredo=abc123');
    })
  );
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}

describe('errorHandler (formato padronizado)', () => {
  const app = appWith();

  it('erro tratado retorna o código e a mensagem no formato padrão', async () => {
    const res = await request(app).get('/handled');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: { code: 'bad_input', message: 'Entrada inválida.' } });
  });

  it('erro não tratado retorna 500 com código internal_error e sem stack', async () => {
    const res = await request(app).get('/unhandled');
    expect(res.status).toBe(500);
    expect(res.body.error.code).toBe('internal_error');
    expect(JSON.stringify(res.body)).not.toMatch(/stack|at \//i);
  });

  it('rota inexistente retorna 404 padronizado', async () => {
    const res = await request(app).get('/nope');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('not_found');
  });
});
