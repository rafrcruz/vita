import express, { type Express } from 'express';
import cookieParser from 'cookie-parser';
import { httpLogger } from './middleware/logging';
import { errorHandler, notFoundHandler } from './middleware/error';
import { healthRouter } from './health/health.route';
import { authRouter } from './auth/auth.route';
import { allowlistRouter } from './allowlist/allowlist.route';
import { docsRouter } from './docs/docs.route';

/** Cria e configura a instância do Express (usada por dev local e serverless). */
export function createApp(): Express {
  const app = express();

  app.disable('x-powered-by');
  app.use(express.json());
  app.use(cookieParser());
  app.use(httpLogger);

  // Rotas da API (todas sob /api).
  app.use('/api/health', healthRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/allowlist', allowlistRouter);
  app.use('/api/docs', docsRouter);

  // 404 e tratador de erros central por último.
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
