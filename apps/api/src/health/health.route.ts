import { Router } from 'express';
import type { HealthStatus } from '@vita/shared';
import { checkDatabase } from '../db/client';

// Health check da fundação: reporta o estado do banco (db: up/down).
export const healthRouter: Router = Router();

healthRouter.get('/', async (_req, res) => {
  const dbUp = await checkDatabase();
  const body: HealthStatus = {
    status: dbUp ? 'ok' : 'degraded',
    db: dbUp ? 'up' : 'down',
    time: new Date().toISOString(),
  };
  res.status(dbUp ? 200 : 503).json(body);
});
