import { pinoHttp } from 'pino-http';
import pino from 'pino';
import { env, isProduction } from '../config/env';

// Campos sensíveis que NUNCA devem aparecer nos logs (FR-018).
export const REDACT_PATHS = [
  'req.headers.authorization',
  'req.headers.cookie',
  'res.headers["set-cookie"]',
  'req.body.password',
  'req.body.token',
  '*.password',
  '*.secret',
  '*.token',
];

// Logger estruturado (JSON). Em produção escreve em stdout (capturado pela Vercel).
export const logger = pino({
  level: env.NODE_ENV === 'test' ? 'silent' : isProduction ? 'info' : 'debug',
  redact: { paths: REDACT_PATHS, remove: true },
});

export const httpLogger = pinoHttp({ logger });
