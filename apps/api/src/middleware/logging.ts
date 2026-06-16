import { pinoHttp } from 'pino-http';
import pino from 'pino';
import { env, isProduction } from '../config/env';

// Logger estruturado (JSON). Em produção escreve em stdout (capturado pela Vercel).
// Em dev usa pino-pretty se disponível; caso contrário, JSON puro.
export const logger = pino({
  level: env.NODE_ENV === 'test' ? 'silent' : isProduction ? 'info' : 'debug',
  // Redação de campos sensíveis para nunca vazar segredos/credenciais nos logs.
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'res.headers["set-cookie"]',
    ],
    remove: true,
  },
});

export const httpLogger = pinoHttp({ logger });
