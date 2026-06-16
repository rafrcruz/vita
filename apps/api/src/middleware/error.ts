import type { ErrorRequestHandler, RequestHandler } from 'express';
import type { ApiError } from '@vita/shared';
import { isProduction } from '../config/env';
import { logger } from './logging';

/** Erro de aplicação com código e status HTTP explícitos. */
export class AppError extends Error {
  readonly status: number;
  readonly code: string;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
  }
}

/** 404 padronizado para rotas não encontradas. */
export const notFoundHandler: RequestHandler = (_req, res) => {
  const body: ApiError = { error: { code: 'not_found', message: 'Recurso não encontrado' } };
  res.status(404).json(body);
};

/**
 * Tratador de erros central: responde sempre no formato { error: { code, message } },
 * sem vazar stack/detalhes internos ou segredos (FR-017).
 */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    logger.warn({ code: err.code, status: err.status }, err.message);
    const body: ApiError = { error: { code: err.code, message: err.message } };
    res.status(err.status).json(body);
    return;
  }

  logger.error({ err }, 'Erro não tratado');
  const body: ApiError = {
    error: {
      code: 'internal_error',
      message: isProduction ? 'Erro interno' : err instanceof Error ? err.message : 'Erro interno',
    },
  };
  res.status(500).json(body);
};
