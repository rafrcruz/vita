import express, { type Express } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import { env, isProduction } from './config/env';
import { httpLogger } from './middleware/logging';
import { errorHandler, notFoundHandler } from './middleware/error';
import { healthRouter } from './health/health.route';
import { authRouter } from './auth/auth.route';
import { allowlistRouter } from './allowlist/allowlist.route';
import { docsRouter } from './docs/docs.route';
import { requireAuth } from './auth/middleware';
import metricsRouter from './health_metrics/metrics.route';


/** Cria e configura a instância do Express (usada por dev local e serverless). */
export function createApp(): Express {
  const app = express();

  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.use((req, res, next) => {
    const forwardedProto = req.header('x-forwarded-proto');
    if (isProduction && forwardedProto === 'http') {
      res.redirect(308, `https://${req.header('host') ?? env.WEB_ORIGIN}${req.originalUrl}`);
      return;
    }
    next();
  });

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
      crossOriginEmbedderPolicy: false,
      hsts: isProduction
        ? {
            maxAge: 15552000,
            includeSubDomains: true,
          }
        : false,
    })
  );
  app.use(
    cors({
      origin(origin, callback) {
        const isAllowed =
          !origin ||
          origin === env.WEB_ORIGIN ||
          origin === 'http://localhost:5173' ||
          /^https:\/\/vita-web.*\.vercel\.app$/.test(origin);
        callback(null, isAllowed);
      },
      credentials: true,
    })
  );

  app.use(express.json());
  app.use(cookieParser());
  app.use(httpLogger);

  // Rotas da API (todas sob /api).
  app.use('/api/health', healthRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/allowlist', allowlistRouter);
  app.use('/api/docs', docsRouter);
  app.use('/api/metrics', requireAuth, metricsRouter);


  // 404 e tratador de erros central por último.
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
