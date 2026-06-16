// Schemas e tipos compartilhados entre web e api (Zod como fonte única de verdade).
export * from './auth';

export const SHARED_PACKAGE_VERSION = '0.1.0';

/** Formato padrão de erro retornado pela API. */
export type ApiError = {
  error: {
    code: string;
    message: string;
  };
};

/** Resposta do endpoint de health. */
export type HealthStatus = {
  status: 'ok' | 'degraded';
  db?: 'up' | 'down';
  time: string;
};
